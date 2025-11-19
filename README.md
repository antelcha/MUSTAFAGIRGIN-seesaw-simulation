# Seesaw Logic Simulation

A pure JavaScript visualization of a physics-based seesaw, created as a technical challenge submission. This project simulates torque mechanics, gravity, and object interaction without the use of any external frameworks or physics engines.

**Live Demo:** https://antelcha.github.io/MUSTAFAGIRGIN-seesaw-simulation/

## 📋 Project Overview

The goal of this project was to build a visual simulation where users can drop random-weighted objects onto a seesaw. The application calculates the torque on both sides in real-time and tilts the plank accordingly, strictly adhering to "Vanilla JS" constraints.

## ✨ Features

* **Core Physics:**
    * Calculates torque (`Weight × Distance`) for every object.
    * Caps tilt angle at ±30 degrees based on net torque difference.
    * Real-time rebalancing logic.
* **Interaction:**
    * **Precision Drop:** Objects appear exactly at the mouse cursor's position relative to the tilted bar.
    * **Preview System:** A ghost circle and guide line appear on hover to show exactly where an object will land.
    * **Interactive UI:** Displays dynamic weight totals, tilt angle, and a log of drop events.
* **Animation & Polish:**
    * Smooth angular transitions (damping) to prevent instant snapping.
    * Gravity simulation for falling objects.
    * Sound effects (`swoosh`) on drop.
    * Fully responsive design (recalculates pivot points on window resize).
* **Persistence:**
    * Uses `localStorage` to save the state (weights and positions), so progress isn't lost on refresh.

## 🧠 Thought Process & Implementation

### 1. The "Pure JS" Architecture
Since no frameworks (React, p5.js, etc.) were allowed, I relied on the DOM API for rendering.
* **Why DOM?** Since the object count is manageable, manipulating DOM elements (`divs`) via absolute positioning was more lightweight than setting up a Canvas render loop. It also makes CSS styling for the UI much cleaner.

### 2. The Physics of "Falling to a Tilted Surface"
The hardest challenge was determining *where* a falling object should stop. Since the bar tilts, the "ground" level changes for every X coordinate.
* **Solution:** I implemented a trigonometric helper function `getBarSurfaceY`. It takes the current angle and the object's distance from the pivot to calculate the exact Y-coordinate of the bar's surface at that specific point.

### 3. Rotational Linear Algebra
Once an object lands, it becomes part of the seesaw system. As the seesaw rotates, the objects sitting on it must rotate with it.
* **Solution:** I used a 2D rotation matrix formula. When the angle changes, the code iterates through all "landed" objects and updates their $(x, y)$ coordinates relative to the pivot point using:
    ```javascript
    newX = dx * cos(θ) - dy * sin(θ)
    newY = dx * sin(θ) + dy * cos(θ)
    ```

### 4. Smooth Rebalancing
Updating the angle instantly looked robotic.
* **Solution:** I added a smoothing factor (`0.2`). In every animation frame, the bar moves only 20% of the way towards the target angle. This creates a natural, physical "weighty" feeling.

## ⚖️ Trade-offs & Design Decisions

* **Friction vs. Simplicity:** In a real-world scenario, objects placed on a steep angle would slide off. Per the requirements, I prioritized the torque calculation logic and kept objects "stuck" to the plank upon landing to focus on the balancing mechanics.
* **Animation Loop:** I used `requestAnimationFrame` for the falling and rotating logic instead of `setInterval`.

## 🤖 AI Usage Declaration

In accordance with the assessment policy, AI tools (ChatGPT) were used strictly as **assistants** for syntax and debugging, not for generating the core logic.

* **Assisted:** I used AI to verify the trigonometric syntax for the `getBarSurfaceY` function and to debug a sign error in my rotation matrix formula.
* **Manual:** The project structure, the `fall()` recursive loop logic, the DOM event handling, and the decision to use a preview line were all designed and implemented manually.

## 🚀 How to Run

1.  Clone this repository.
2.  Open `index.html` in any web browser.
3.  Enjoy the simulation (Sound is enabled by default).

---
*Implemnted by Mustafa Girgin*