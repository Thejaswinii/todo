document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <span class="task-text">${taskText}</span>
        <input type="checkbox" class="task-checkbox">
        <button class="delete-btn">❌</button>
    `;

    taskItem.querySelector(".task-checkbox").addEventListener("change", toggleComplete);
    taskItem.querySelector(".delete-btn").addEventListener("click", deleteTask);

    taskList.appendChild(taskItem);
    saveTask(taskText, false);

    taskInput.value = "";
}

function toggleComplete(event) {
    const taskItem = event.target.parentElement;
    taskItem.querySelector(".task-text").classList.toggle("completed");

    if (event.target.checked) {
        startFireworks();
    }

    updateTasks();
}

function deleteTask(event) {
    const taskItem = event.target.parentElement;
    taskList.removeChild(taskItem);
    updateTasks();
}

function saveTask(task, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: task, completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(taskItem => {
        let taskText = taskItem.querySelector(".task-text").textContent;
        let completed = taskItem.querySelector(".task-checkbox").checked;
        tasks.push({ text: taskText, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
            <button class="delete-btn">❌</button>
        `;

        taskItem.querySelector(".task-checkbox").addEventListener("change", toggleComplete);
        taskItem.querySelector(".delete-btn").addEventListener("click", deleteTask);

        taskList.appendChild(taskItem);
    });
}

// 🎆 Fireworks Effect (Longer & Smooth Fade)
function startFireworks() {
    let particles = [];
    
    for (let i = 0; i < 100; i++) { // More particles for a grander effect
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 3,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            speedX: (Math.random() - 0.5) * 6,
            speedY: (Math.random() - 0.5) * 6,
            alpha: 1, // Opacity for smooth fade-out
            shrink: 0.98 // Slower shrinking effect
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.radius *= p.shrink;
            p.alpha *= 0.98; // Smooth fade-out over time

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
            ctx.fill();
        });

        particles = particles.filter(p => p.alpha > 0.01 && p.radius > 0.1);

        if (particles.length > 0) {
            requestAnimationFrame(animateParticles);
        }
    }

    animateParticles();

    // Fireworks last longer (10 seconds fade-out)
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

// Converts HSL to RGB for transparency effect
function hexToRgb(hsl) {
    let h = hsl.match(/\d+/g);
    return `${h[0]}, ${h[1]}, ${h[2]}`;
}
