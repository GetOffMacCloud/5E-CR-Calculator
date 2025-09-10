# 5E CR Calculator
![alt text](https://github.com/GetOffMacCloud/5E-CR-Calculator/blob/main/LazyCR_Screenshot.PNG?raw=true)

Calculate Average Party Level and Effective Party CR from a simple, offline-friendly web app. Built for DMs who don’t want to babysit spreadsheets mid-session.

*TL;DR: Enter player count → enter each level → click Calculate CR → get Average Party Level (rounded .5 up) and Effective Party CR.*
## Features

* ⚡ Zero dependencies at runtime (plain HTML/CSS/JS)

* 🧮 Correct “average → divisor” logic with half-up rounding

* 🧩 Emits a calculateCR CustomEvent so you can embed it elsewhere

* ♿ Keyboard and screen-reader friendly

## The Math (exact spec)

 1. Sum all character levels / number of players = Avg Party Level (APL).
 2. Round the average to nearest integer, .5 rounds up (half-up).
 3. Choose divisor by the rounded average:
  * If APL ≤ 4 → Effective Party CR = sum / 4
  * If APL ≥ 5 and APL < 10 → Effective Party CR = sum / 2
  * If APL < 10 and APL ≥ 17 → Effective Party CR = sum / .75
  * IF APL < 17 and APL ≥ 20 → Effective Party CR = sum 

The app displays:

Total Encounter CR

Max Single Monster CR Level
