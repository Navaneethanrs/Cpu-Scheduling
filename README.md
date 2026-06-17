# CPU Scheduling Simulator

A premium, interactive, and highly visual web application to simulate and understand classic CPU scheduling algorithms. Designed with a modern, glassmorphic dark interface, dynamic glowing effects, and smooth animations.

Developed by **NAKSHATHRA**.

---

## 🚀 Features

- **Modern Glassmorphic UI:** A dark, visually pleasing theme with smooth color gradients, glowing hover states, and responsive layout.
- **Interactive Process Input:** Easily add processes with custom Arrival Time, Burst Time, and Priority.
- **Multiple Scheduling Algorithms:**
  - **First Come First Serve (FCFS)**
  - **Shortest Job First (SJF) [Non-preemptive]**
  - **Priority Scheduling [Non-preemptive]**
  - **Round Robin (RR)** with configurable Time Quantum.
- **Instant Calculations:** Automatically calculates and displays:
  - Completion Time (CT)
  - Turnaround Time (TAT)
  - Waiting Time (WT)
  - Average Turnaround Time
  - Average Waiting Time
- **Animated Gantt Chart:** A proportional, animated timeline showing CPU execution states (including IDLE states) with exact timestamps.

---

## 🛠️ Technology Stack

- **HTML5:** Semantic markup structure.
- **CSS3:** Custom properties (CSS variables), glassmorphism effect (`backdrop-filter`), flexbox, grid, and CSS keyframe animations.
- **JavaScript (ES6+):** CPU scheduling logic, dynamic DOM manipulation, and Gantt chart generation.
- **Google Fonts:** Outfit typography for a clean, futuristic look.

---

## 📁 File Structure

```
OS NAKS/
├── index.html   # Main structure & page layout
├── style.css    # Premium CSS design & glassmorphism styling
├── script.js    # Scheduling algorithms & visual rendering logic
└── README.md    # Project documentation
```

---

## 💻 How to Run

Since the project uses pure vanilla web technology, no installation, building, or Node.js server is required. 

1. **Clone or Download** the project folder.
2. Open the directory `OS NAKS`.
3. Double-click on **`index.html`** to run the simulator instantly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari, etc.).

---

## 🧠 Algorithms Explained

### 1. First Come First Serve (FCFS)
- **Concept:** Simple and intuitive. The CPU executes processes in the exact order they arrive in the ready queue (FIFO).
- **Type:** Non-preemptive.

### 2. Shortest Job First (SJF)
- **Concept:** Out of all available processes in the ready queue, the one with the smallest Burst Time is scheduled first. Reduces average waiting time.
- **Type:** Non-preemptive.

### 3. Priority Scheduling
- **Concept:** Each process is assigned a priority integer. The CPU is allocated to the process with the highest priority (where lower integer value represents higher priority).
- **Type:** Non-preemptive.

### 4. Round Robin (RR)
- **Concept:** Designed specifically for time-sharing systems. Each process is allocated a small unit of CPU time, called a **Time Quantum** (usually 10-100 milliseconds). After the quantum expires, the process is preempted and put back into the ready queue.
- **Type:** Preemptive.

---

## 🎯 How to Use

1. **Select an Algorithm:** Click on FCFS, SJF, Priority, or Round Robin from the top navigation menu.
2. **Add Processes:** 
   - Enter the **Arrival Time** and **Burst Time**.
   - *(Optional)* Enter the **Priority** value (only visible/required for Priority Scheduling).
   - Click the **Add Process** button. Repeat to add multiple processes.
3. **Set Algorithm Constants:** 
   - Enter the **Time Quantum** (only visible/required for Round Robin).
4. **Simulate:** Click **Simulate** to run the scheduling algorithm.
   - The process table will instantly fill in the Completion Time, Turnaround Time, and Waiting Time for each process.
   - The averages for Turnaround Time and Waiting Time will be calculated.
   - A colored, proportional **Gantt Chart** timeline will render at the bottom.
5. **Reset:** Click the **Reset** button to clear all inputs, processes, and charts to start over.