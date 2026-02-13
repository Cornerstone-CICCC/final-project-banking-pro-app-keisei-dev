# Reflection

**Challenges Faced**
The biggest challenge was that all the code was in one big file. The part that handles money and the part that shows the menu were mixed together. This made it very difficult to test small parts of the code. I had to be very careful to find and copy 22 different bugs into my test file so I could prove they exist.

**Difficulties in Debugging**
It was very hard to find bugs that did not crash the app. For example, the money disappearing when an ID ends in '7' or the history hiding large transfers. The app looked like it was working, but the math was wrong. I only found these bugs because I read the source code carefully. Just using the app was not enough to find them.

**What I Learned**
I learned that "running without errors" does not mean the app is correct. An app can run perfectly but still have bad logic. In the future, I will always check user input very strictly to block things like minus numbers or text where numbers should be. I also learned that keeping the logic and the UI separate makes testing much easier.