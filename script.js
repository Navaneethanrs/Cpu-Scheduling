let processes = [];
let currentAlgo = 'home';
let processCounter = 1;

// Color palette for Gantt chart
const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            // Update active nav
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update visible section
            sections.forEach(sec => sec.classList.remove('active'));
            
            if (target === 'home') {
                document.getElementById('home').classList.add('active');
            } else {
                document.getElementById('simulator').classList.add('active');
                setAlgorithm(target);
            }
        });
    });

    // Button Listeners
    document.getElementById('add-process-btn').addEventListener('click', addProcess);
    document.getElementById('calculate-btn').addEventListener('click', calculate);
    document.getElementById('reset-btn').addEventListener('click', resetSimulation);
});

function setAlgorithm(algo) {
    currentAlgo = algo;
    resetSimulation();
    
    const title = document.getElementById('algo-title');
    const priorityGroup = document.getElementById('priority-group');
    const quantumGroup = document.getElementById('quantum-group');
    const priorityCols = document.querySelectorAll('.priority-col');

    priorityGroup.style.display = 'none';
    quantumGroup.style.display = 'none';
    priorityCols.forEach(col => col.style.display = 'none');

    switch(algo) {
        case 'fcfs':
            title.textContent = 'First Come First Serve (FCFS)';
            break;
        case 'sjf':
            title.textContent = 'Shortest Job First (SJF)';
            break;
        case 'priority':
            title.textContent = 'Priority Scheduling';
            priorityGroup.style.display = 'flex';
            priorityCols.forEach(col => col.style.display = 'table-cell');
            break;
        case 'rr':
            title.textContent = 'Round Robin (RR)';
            quantumGroup.style.display = 'flex';
            break;
    }
}

function addProcess() {
    const atInput = document.getElementById('arrival-time');
    const btInput = document.getElementById('burst-time');
    const ptInput = document.getElementById('priority-val');

    const at = parseInt(atInput.value);
    const bt = parseInt(btInput.value);
    const pt = parseInt(ptInput.value);

    if (isNaN(at) || isNaN(bt) || bt <= 0) {
        alert("Please enter valid Arrival and Burst times.");
        return;
    }

    const process = {
        pid: `P${processCounter++}`,
        at: at,
        bt: bt,
        pt: currentAlgo === 'priority' ? pt : 0,
        color: colors[(processCounter - 2) % colors.length]
    };

    processes.push(process);
    renderTable();
}

function resetSimulation() {
    processes = [];
    processCounter = 1;
    document.getElementById('arrival-time').value = '0';
    document.getElementById('burst-time').value = '1';
    document.getElementById('priority-val').value = '1';
    document.getElementById('results-panel').style.display = 'none';
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    processes.forEach(p => {
        const tr = document.createElement('tr');
        let html = `
            <td>${p.pid}</td>
            <td>${p.at}</td>
            <td>${p.bt}</td>
        `;
        
        if (currentAlgo === 'priority') {
            html += `<td>${p.pt}</td>`;
        }
        
        html += `
            <td>${p.ct || '-'}</td>
            <td>${p.tat || '-'}</td>
            <td>${p.wt || '-'}</td>
        `;
        
        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}

function calculate() {
    if (processes.length === 0) {
        alert("Please add at least one process.");
        return;
    }

    // Clone processes to avoid mutating inputs during calculation
    let procs = JSON.parse(JSON.stringify(processes));
    let gantt = [];

    if (currentAlgo === 'fcfs') {
        gantt = calcFCFS(procs);
    } else if (currentAlgo === 'sjf') {
        gantt = calcSJF(procs);
    } else if (currentAlgo === 'priority') {
        gantt = calcPriority(procs);
    } else if (currentAlgo === 'rr') {
        const tq = parseInt(document.getElementById('time-quantum').value);
        if (isNaN(tq) || tq <= 0) {
            alert("Please enter a valid Time Quantum.");
            return;
        }
        gantt = calcRR(procs, tq);
    }

    // Update original processes with calculated results
    processes.forEach(p => {
        const calculatedProc = procs.find(cp => cp.pid === p.pid);
        p.ct = calculatedProc.ct;
        p.tat = calculatedProc.tat;
        p.wt = calculatedProc.wt;
    });

    renderTable();
    renderResults(gantt);
}

// === Algorithms ===

function calcFCFS(procs) {
    procs.sort((a, b) => a.at - b.at);
    let time = 0;
    let gantt = [];

    procs.forEach(p => {
        if (time < p.at) {
            gantt.push({ pid: 'IDLE', start: time, end: p.at, color: '#334155' });
            time = p.at;
        }
        let start = time;
        time += p.bt;
        p.ct = time;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        
        gantt.push({ pid: p.pid, start: start, end: time, color: p.color });
    });
    return gantt;
}

function calcSJF(procs) {
    // Non-preemptive SJF
    let time = 0;
    let completed = 0;
    let n = procs.length;
    let isCompleted = new Array(n).fill(false);
    let gantt = [];

    while (completed < n) {
        let minBt = Infinity;
        let shortestIdx = -1;

        for (let i = 0; i < n; i++) {
            if (procs[i].at <= time && !isCompleted[i]) {
                if (procs[i].bt < minBt) {
                    minBt = procs[i].bt;
                    shortestIdx = i;
                } else if (procs[i].bt === minBt) {
                    if (procs[i].at < procs[shortestIdx].at) {
                        shortestIdx = i;
                    }
                }
            }
        }

        if (shortestIdx === -1) {
            // Find next arriving process
            let nextArrival = Infinity;
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && procs[i].at < nextArrival) {
                    nextArrival = procs[i].at;
                }
            }
            gantt.push({ pid: 'IDLE', start: time, end: nextArrival, color: '#334155' });
            time = nextArrival;
        } else {
            let p = procs[shortestIdx];
            let start = time;
            time += p.bt;
            p.ct = time;
            p.tat = p.ct - p.at;
            p.wt = p.tat - p.bt;
            isCompleted[shortestIdx] = true;
            completed++;
            gantt.push({ pid: p.pid, start: start, end: time, color: p.color });
        }
    }
    return gantt;
}

function calcPriority(procs) {
    // Non-preemptive Priority (Higher number = Higher priority, or we can assume lower number = higher priority. Let's assume HIGHER NUMBER = HIGHER PRIORITY for this example, or wait, usually 1 is highest. Let's make Lower number = Higher priority to be standard).
    let time = 0;
    let completed = 0;
    let n = procs.length;
    let isCompleted = new Array(n).fill(false);
    let gantt = [];

    while (completed < n) {
        let maxPriority = Infinity; // Lower number is higher priority
        let targetIdx = -1;

        for (let i = 0; i < n; i++) {
            if (procs[i].at <= time && !isCompleted[i]) {
                if (procs[i].pt < maxPriority) {
                    maxPriority = procs[i].pt;
                    targetIdx = i;
                } else if (procs[i].pt === maxPriority) {
                    if (procs[i].at < procs[targetIdx].at) {
                        targetIdx = i;
                    }
                }
            }
        }

        if (targetIdx === -1) {
            let nextArrival = Infinity;
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && procs[i].at < nextArrival) {
                    nextArrival = procs[i].at;
                }
            }
            gantt.push({ pid: 'IDLE', start: time, end: nextArrival, color: '#334155' });
            time = nextArrival;
        } else {
            let p = procs[targetIdx];
            let start = time;
            time += p.bt;
            p.ct = time;
            p.tat = p.ct - p.at;
            p.wt = p.tat - p.bt;
            isCompleted[targetIdx] = true;
            completed++;
            gantt.push({ pid: p.pid, start: start, end: time, color: p.color });
        }
    }
    return gantt;
}

function calcRR(procs, tq) {
    let n = procs.length;
    let remainingBt = procs.map(p => p.bt);
    let time = 0;
    let completed = 0;
    let gantt = [];
    
    // Sort initially by arrival
    procs.sort((a, b) => a.at - b.at);
    
    let queue = [];
    let isAdded = new Array(n).fill(false);
    
    // Initial arrivals at time 0
    for(let i=0; i<n; i++) {
        if(procs[i].at <= time) {
            queue.push(i);
            isAdded[i] = true;
        }
    }

    while (completed < n) {
        if (queue.length === 0) {
            let nextArrival = Infinity;
            let nextIdx = -1;
            for (let i = 0; i < n; i++) {
                if (remainingBt[i] > 0 && procs[i].at < nextArrival) {
                    nextArrival = procs[i].at;
                    nextIdx = i;
                }
            }
            gantt.push({ pid: 'IDLE', start: time, end: nextArrival, color: '#334155' });
            time = nextArrival;
            queue.push(nextIdx);
            isAdded[nextIdx] = true;
        }

        let curr = queue.shift();
        let p = procs[curr];
        let start = time;

        if (remainingBt[curr] > tq) {
            time += tq;
            remainingBt[curr] -= tq;
            gantt.push({ pid: p.pid, start: start, end: time, color: p.color });
        } else {
            time += remainingBt[curr];
            gantt.push({ pid: p.pid, start: start, end: time, color: p.color });
            remainingBt[curr] = 0;
            completed++;
            
            p.ct = time;
            p.tat = p.ct - p.at;
            p.wt = p.tat - p.bt;
        }

        // Add newly arrived processes to queue
        for (let i = 0; i < n; i++) {
            if (remainingBt[i] > 0 && procs[i].at <= time && !isAdded[i]) {
                queue.push(i);
                isAdded[i] = true;
            }
        }

        // Re-add the current process to queue if not finished
        if (remainingBt[curr] > 0) {
            queue.push(curr);
        }
    }
    return gantt;
}

// === Rendering ===

function renderResults(gantt) {
    document.getElementById('results-panel').style.display = 'block';

    // Calculate Averages
    let totalTat = 0;
    let totalWt = 0;
    processes.forEach(p => {
        totalTat += p.tat;
        totalWt += p.wt;
    });
    
    document.getElementById('avg-tat').textContent = (totalTat / processes.length).toFixed(2) + ' ms';
    document.getElementById('avg-wt').textContent = (totalWt / processes.length).toFixed(2) + ' ms';

    // Render Gantt Chart
    const ganttContainer = document.getElementById('gantt-chart');
    ganttContainer.innerHTML = '';

    const totalTime = gantt[gantt.length - 1].end;

    gantt.forEach((block, index) => {
        const div = document.createElement('div');
        div.className = 'gantt-block';
        
        // Flex basis proportional to duration
        const duration = block.end - block.start;
        const percentage = (duration / totalTime) * 100;
        
        div.style.flex = `0 0 ${percentage}%`;
        div.style.backgroundColor = block.color;
        
        div.innerHTML = `
            <span>${block.pid}</span>
            ${index === 0 ? `<span class="time-label-start">${block.start}</span>` : ''}
            <span class="time-label">${block.end}</span>
        `;
        
        ganttContainer.appendChild(div);
    });
}
