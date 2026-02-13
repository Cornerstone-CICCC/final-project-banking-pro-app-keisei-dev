# Reflection

**Challenges Faced**
The biggest challenge was that all the code was in one big file. The banking logic and the menu interface were mixed together, making it difficult to test specific functions. I had to be very careful to reproduce 22 different bugs in my test file. This was necessary to accurately demonstrate how the application fails under certain conditions.

**Difficulties in Debugging**
It was very hard to find "silent" bugs that did not crash the app. For example, money disappearing when a recipient ID ends in '7' or the history hiding transfers over $500. The app seemed to work fine, but the internal calculations were wrong. I only found these issues by reading the source code line by line. Simply using the app was not enough to find them.

**What I Learned**
I learned that "running without errors" does not mean the app is correct. An app can run perfectly but still have broken logic. In the future, I will always implement strict input validation to block negative numbers or invalid text. I also learned that keeping the business logic and the UI separate is essential for making code easier to test and maintain.
