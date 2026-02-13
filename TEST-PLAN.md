# BankCLI Pro - Test Plan

## Project Overview
This document outlines the test cases designed to identify and reproduce bugs within the BankCLI Pro application. The test suite covers functional logic, security concerns, and data integrity.

## Environment
- **OS**: macOS Tahoe 26.2
- **Processor**: Apple M4
- **Memory**: 16 GB RAM
- **Runtime**: Node.js v18.0.0
- **Testing Framework**: Jest v30.2.0
- **Terminal**: zsh (Native macOS Terminal)
- **Local Database**: bank-data.json (Flat file JSON storage)

## Test Findings Table

| Test ID | Feature | Steps | Expected Result | Actual Result | Status |
|:---:|---|---|---|---|:---:|
| **TP-001** | Create Account | 1. Enter empty string for Name<br>2. Deposit 100 | System should reject empty names. | Account created with no name. | **FAIL** |
| **TP-002** | Create Account | 1. Enter "User A" for Name<br>2. Deposit -1000 | System should reject negative initial deposits. | Account created with negative balance. | **FAIL** |
| **TP-003** | Create Account | 1. Enter "User A" for Name<br>2. Enter "abc" for Deposit | System should reject non-numeric inputs. | Balance becomes `NaN`. | **FAIL** |
| **TP-004** | Deposit | 1. Deposit -500 into account with 1000 | Amount must be positive. | Balance decreases to 500. | **FAIL** |
| **TP-005** | Deposit | 1. Deposit "abc" into account | System should reject non-numeric inputs. | Balance becomes `NaN`. | **FAIL** |
| **TP-006** | Withdraw | 1. Withdraw 5000 from account with 100 | Transaction should be rejected (Insufficient funds). | Balance becomes -4900. | **FAIL** |
| **TP-007** | Withdraw | 1. Withdraw -500 from account with 100 | Amount must be positive. | Balance increases to 600. | **FAIL** |
| **TP-008** | Transfer | 1. Transfer 5000 from Acc A (100) to Acc B | Transaction should be rejected (Insufficient funds). | Money is transferred; Acc A goes into debt. | **FAIL** |
| **TP-009** | Transfer | 1. Transfer -50 from Acc A to Acc B | Amount must be positive. | Money is "stolen" from B and added to A. | **FAIL** |
| **TP-010** | Transfer | 1. Transfer 100 to non-existent ID "999" | System should show "Recipient not found". | New "Ghost" account is silently created. | **FAIL** |
| **TP-011** | Transfer | 1. Transfer 10 from Acc A to Acc A | System should reject self-transfer. | Transaction processed and recorded. | **FAIL** |
| **TP-012** | Transfer (Logic) | 1. Transfer 100 to Acc ID ending in "7" | Money should arrive in recipient account. | Recipient balance does not increase (Money vanishes). | **FAIL** |
| **TP-013** | History (Logic) | 1. Transfer 600 (amount > 500) | Transaction should be recorded in history. | Record is missing from history. | **FAIL** |
| **TP-014** | Delete Account | 1. Delete account with 50000 balance | System should warn user or prevent deletion. | Account deleted immediately; funds lost. | **FAIL** |
| **TP-015** | Data Integrity | 1. Corrupt the JSON data file manually<br>2. Start app | System should attempt recovery or backup. | System wipes all data and starts fresh. | **FAIL** |
| **TP-016** | UI Formatting | 1. Create account with 100-character name | Name should be truncated or wrapped. | Table layout breaks/distorts in CLI. | **FAIL** |
| **TP-017** | ID Generation | 1. Generate multiple accounts | IDs must be guaranteed unique. | Uses Math.random(); risk of collisions. | **FAIL** |
| **TP-018** | Precision | 1. Add 0.1 and 0.2 to balance | Balance should be exactly 0.3. | Balance results in 0.30000000000000004. | **FAIL** |
| **TP-019** | History | 1. View history of new account | Should show "No transactions found". | Correctly shows no history. | **PASS** |
| **TP-020** | Precision | 1. Transfer 0.001 | System should round or reject sub-cent amounts. | Processes 0.001 exactly. | **FAIL** |
| **TP-021** | UI Navigation | 1. Select menu option "10" | System should show "Invalid option". | Shows invalid option message. | **PASS** |
| **TP-022** | List Accounts | 1. List accounts when system is empty | Should show "No accounts found". | Correctly shows no accounts. | **PASS** |