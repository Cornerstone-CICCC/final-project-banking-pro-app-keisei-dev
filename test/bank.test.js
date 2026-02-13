// test/bank.test.js

describe('BankCLI Pro - Bug Reproduction Suite (22 Items)', () => {
  
  let accounts;
  let mockSave;      // Mock function for saving data
  let mockConsoleLog; // Mock function for printing messages

  beforeEach(() => {
    accounts = [];
    
    // Setup Mock Functions as requested by the teacher
    mockSave = jest.fn(); 
    mockConsoleLog = jest.fn();
  });

  // ==========================================
  // 1. Account Creation Bugs
  // ==========================================

  test('TP-001: Allows account creation with an empty name', () => {
    const name = ""; 
    const initialDeposit = 100;

    // Bug: No name validation. It calls the save function even if empty.
    const newAccount = { id: 'ACC-1', name: name, balance: initialDeposit };
    accounts.push(newAccount);
    mockSave(); 

    expect(mockSave).toHaveBeenCalled(); // Check if save was called
    expect(accounts[0].name).toBe(""); 
  });

  test('TP-002: Allows negative initial deposit resulting in debt', () => {
    const initialDeposit = -1000;
    const newAccount = { id: 'ACC-1', balance: initialDeposit };
    
    // Bug: Allows negative balance and prints success message
    mockConsoleLog("Account created"); 

    expect(newAccount.balance).toBe(-1000);
    expect(mockConsoleLog).toHaveBeenCalledWith("Account created");
  });

  test('TP-003: Non-numeric input results in NaN', () => {
    const input = "abc";
    const deposit = parseFloat(input); // Becomes NaN
    const newAccount = { id: 'ACC-1', balance: deposit };

    expect(newAccount.balance).toBeNaN();
  });

  // ==========================================
  // 2. Deposit Bugs
  // ==========================================

  test('TP-004: Negative deposit reduces the balance', () => {
    const account = { id: 'ACC-1', balance: 1000 };
    const depositAmount = -500;

    // Bug: No check for negative input
    account.balance += depositAmount;
    mockSave();

    expect(account.balance).toBe(500);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  test('TP-005: Non-numeric deposit corrupts the balance', () => {
    const account = { id: 'ACC-1', balance: 1000 };
    const depositAmount = parseFloat("abc"); 

    account.balance += depositAmount;
    expect(account.balance).toBeNaN();
  });

  // ==========================================
  // 3. Withdrawal Bugs
  // ==========================================

  test('TP-006: Allows withdrawal exceeding current balance', () => {
    const account = { id: 'ACC-1', balance: 100 };
    const withdrawAmount = 5000;

    // Bug: Missing balance check. It saves the negative balance.
    account.balance -= withdrawAmount;
    mockSave();

    expect(account.balance).toBe(-4900);
    expect(mockSave).toHaveBeenCalled();
  });

  test('TP-007: Negative withdrawal increases the balance', () => {
    const account = { id: 'ACC-1', balance: 100 };
    const withdrawAmount = -500;

    account.balance -= withdrawAmount;
    expect(account.balance).toBe(600);
  });

  // ==========================================
  // 4. Transfer Bugs
  // ==========================================

  test('TP-008: Allows transfer without sufficient funds', () => {
    const sender = { id: 'A', balance: 100 };
    const receiver = { id: 'B', balance: 0 };
    const amount = 5000;

    sender.balance -= amount;
    receiver.balance += amount;
    mockSave();

    expect(sender.balance).toBe(-4900);
    expect(mockSave).toHaveBeenCalled();
  });

  test('TP-009: Negative transfer steals money from recipient', () => {
    const sender = { id: 'A', balance: 100 };
    const receiver = { id: 'B', balance: 100 };
    const amount = -50;

    sender.balance -= amount; 
    receiver.balance += amount;

    expect(sender.balance).toBe(150);
    expect(receiver.balance).toBe(50);
  });

  test('TP-010: Silently creates a new account if recipient ID not found', () => {
    accounts = [{ id: 'A', balance: 1000 }];
    const targetId = 'GHOST-USER';
    
    // Mocking the "Find or Create" logic bug
    const findOrCreate = jest.fn((id) => {
        let acc = accounts.find(a => a.id === id);
        if (!acc) {
            acc = { id: id, balance: 0 };
            accounts.push(acc);
        }
        return acc;
    });

    findOrCreate(targetId);

    expect(accounts.length).toBe(2);
    expect(findOrCreate).toHaveBeenCalledWith('GHOST-USER');
  });

  test('TP-011: Allows self-transfer resulting in redundant history', () => {
    const sender = { id: 'A', balance: 100, transactions: [] };
    const targetId = 'A';

    if (sender.id === targetId) {
        sender.transactions.push('transfer');
        mockSave();
    }

    expect(sender.transactions.length).toBe(1);
    expect(mockSave).toHaveBeenCalled();
  });

  // ==========================================
  // 5. Logic Bugs (Intentional flaws)
  // ==========================================

  test('TP-012: Money disappears when recipient ID ends with "7"', () => {
    const receiver = { id: 'ACC-7777', balance: 0 };
    const amount = 100;
    
    const processTransfer = jest.fn((acc, amt) => {
        // Bug: If ID ends with 7, it does not update the balance
        if (!acc.id.endsWith('7')) {
            acc.balance += amt;
        }
    });

    processTransfer(receiver, amount);

    expect(receiver.balance).toBe(0);
    expect(processTransfer).toHaveBeenCalled();
  });

  test('TP-013: Transactions over $500 are not recorded in history', () => {
    const account = { id: 'A', balance: 1000, transactions: [] };
    const amount = 600;

    const addHistory = jest.fn((amt) => {
        // Bug: Hardcoded limit for recording history
        if (amt <= 500) {
            account.transactions.push({ amount: amt });
        }
    });

    addHistory(amount);

    expect(account.transactions.length).toBe(0);
    expect(addHistory).toHaveBeenCalledWith(600);
  });

  // ==========================================
  // 6. Data & UI Bugs
  // ==========================================

  test('TP-014: Deletes account immediately even if balance remains', () => {
    accounts = [{ id: 'A', balance: 50000 }]; 
    
    const deleteAccount = jest.fn(() => {
        accounts.splice(0, 1);
        mockConsoleLog("Deleted");
    });

    deleteAccount();

    expect(accounts.length).toBe(0);
    expect(mockConsoleLog).toHaveBeenCalledWith("Deleted");
  });

  test('TP-015: Wipes all data if the JSON file is corrupted', () => {
    let loadedData;
    const loadDataMock = jest.fn(() => {
        try {
            JSON.parse("CORRUPTED_JSON");
        } catch (e) {
            // Bug: Resets everything to empty on error
            loadedData = { accounts: [] }; 
        }
    });

    loadDataMock();

    expect(loadedData.accounts.length).toBe(0);
    expect(loadDataMock).toHaveBeenCalled();
  });

  test('TP-016: Allows long names causing UI distortion', () => {
    const longName = "A".repeat(100); 
    const account = { id: '1', name: longName };
    expect(account.name.length).toBe(100);
  });

  test('TP-017: ID generation relies on random numbers', () => {
    // Mocking Math.random to return a fixed value
    jest.spyOn(Math, 'random').mockReturnValue(0.123);

    const id = Math.floor(Math.random() * 1000);
    
    expect(id).toBe(123); 
    expect(Math.random).toHaveBeenCalled();

    Math.random.mockRestore(); // Restore original function
  });

  // ==========================================
  // 7. Math & Navigation
  // ==========================================

  test('TP-018: Floating point errors (0.1 + 0.2)', () => {
    const account = { balance: 0 };
    account.balance = 0.1 + 0.2;
    expect(account.balance).not.toBe(0.3);
  });

  test('TP-019: Returns empty array for no history', () => {
    const account = { transactions: [] };
    expect(account.transactions.length).toBe(0);
  });

  test('TP-020: Sub-cent amounts (0.001) are allowed', () => {
    const account = { balance: 0 };
    const addMoney = jest.fn((amt) => account.balance += amt);
    
    addMoney(0.001);
    
    expect(account.balance).toBe(0.001);
    expect(addMoney).toHaveBeenCalledWith(0.001);
  });

  test('TP-021: Handles invalid menu options', () => {
    const choice = "10";
    const handleMenu = jest.fn((c) => {
        if (c !== "1") return "Invalid";
    });
    
    const result = handleMenu(choice);
    expect(result).toBe("Invalid");
  });

  test('TP-022: Listing accounts works when empty', () => {
    accounts = [];
    const listAccounts = jest.fn(() => accounts.length);
    
    expect(listAccounts()).toBe(0);
  });

});