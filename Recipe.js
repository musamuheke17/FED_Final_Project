document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearBtn = document.getElementById('clear-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Initialization: Set the date
    const dateDisplay = document.getElementById('date-display');
    dateDisplay.innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    function renderTasks() {
        // 1. Filter the tasks based on current selection
        let filteredTasks = tasks;
        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        // 2. Clear the current list
        taskList.innerHTML = '';

        // 3. Handle Empty State
        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<li class="empty-state">No tasks found in "${currentFilter}"</li>`;
        } else {
            filteredTasks.forEach((task) => {
                // Find the actual index in the main tasks array for operations
                const actualIndex = tasks.indexOf(task);
                
                const li = document.createElement('li');
                li.className = `task ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <span onclick="toggleTask(${actualIndex})">${task.text}</span>
                    <button class="delete-btn" onclick="deleteTask(${actualIndex})">Delete</button>
                `;
                taskList.appendChild(li);
            });
        }

        // 4. Update Stats and LocalStorage
        const pendingCount = tasks.filter(t => !t.completed).length;
        taskCount.innerText = `${pendingCount} items pending`;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- Core Actions ---

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            renderTasks();
        }
    }
    window.addTask = addTask;

    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        renderTasks();
    };

    // --- Event Listeners ---

    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Handle Filter Button Clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI update: toggle active class
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');

            // Logic update: change filter and re-render
            currentFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });

    // Clear All Logic
    clearBtn.addEventListener('click', () => {
        if (tasks.length > 0 && confirm("Delete everything?")) {
            tasks = [];
            renderTasks();
        }
    });

    renderTasks();
});
