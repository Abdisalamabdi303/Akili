// Task Manager with Drag-and-Drop and Local Storage

// DOM Elements
const addTaskBtn = document.getElementById('add-task-btn');
const clearBtn = document.getElementById('clear-btn');
const addTaskModal = document.getElementById('add-task-modal');
const editTaskModal = document.getElementById('edit-task-modal');
const saveTaskBtn = document.getElementById('save-task-btn');
const updateTaskBtn = document.getElementById('update-task-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Task Data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize
renderTasks();
updateStats();
setupEventListeners();

// Event Listeners
function setupEventListeners() {
    addTaskBtn.addEventListener('click', () => {
        addTaskModal.showModal();
    });

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal();
        });
    });

    saveTaskBtn.addEventListener('click', addTask);
    updateTaskBtn.addEventListener('click', updateTask);
    clearBtn.addEventListener('click', clearAllTasks);
}

// Close Modal Function
function closeModal() {
    addTaskModal.close();
    editTaskModal.close();
    document.querySelectorAll('input, textarea').forEach(el => {
        el.value = '';
    });
}

// Render Tasks
function renderTasks() {
    const columns = {
        todo: document.querySelector('[data-column="todo"] .task-list'),
        inprogress: document.querySelector('[data-column="inprogress"] .task-list'),
        completed: document.querySelector('[data-column="completed"] .task-list')
    };

    // Clear existing tasks
    Object.values(columns).forEach(list => list.innerHTML = '');

    // Render each task
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        columns[task.status].appendChild(taskElement);
    });

    updateStats();
}

// Create Task Element
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-card bg-base-100 p-4 rounded-xl shadow-md border-l-4';
    div.draggable = true;
    div.dataset.id = task.id;
    
    // Priority styling
    const priorityColors = {
        high: 'border-red-500',
        medium: 'border-yellow-500',
        low: 'border-green-500'
    };
    div.classList.add(priorityColors[task.priority]);

    div.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-lg">${task.title}</h3>
            <div class="flex space-x-2">
                <button class="btn btn-ghost btn-xs edit-btn" data-id="${task.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-ghost btn-xs delete-btn" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        ${task.description ? `<p class="text-sm text-gray-600 mb-2">${task.description}</p>` : ''}
        <div class="flex justify-between items-center text-xs">
            <span class="badge badge-${task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            ${task.dueDate ? `<span class="text-gray-500">Due: ${task.dueDate}</span>` : ''}
        </div>
    `;

    // Add event listeners for edit and delete
    div.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

    // Drag and drop events
    addDragEvents(div);

    return div;
}

// Add Drag Events
function addDragEvents(element) {
    element.addEventListener('dragstart', () => {
        element.classList.add('dragging');
    });

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        saveTasks();
        updateStats();
    });
}

// Drop Zone Setup
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            list.appendChild(draggable);
        } else {
            list.insertBefore(draggable, afterElement);
        }
    });

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.target.closest('.task-card').dataset.id;
        const newStatus = e.target.closest('[data-column]').dataset.column;
        
        // Update task status
        const taskIndex = tasks.findIndex(t => t.id == taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            saveTasks();
            updateStats();
        }
    });
});

// Get Drag After Element
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Add New Task
function addTask() {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        dueDate,
        status: 'todo'
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    closeModal();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.id == id);
    if (!task) return;

    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-description').value = task.description;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-due-date').value = task.dueDate;
    document.getElementById('edit-task-status').value = task.status;

    editTaskModal.showModal();
}

// Update Task
function updateTask() {
    const id = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value.trim();
    const description = document.getElementById('edit-task-description').value.trim();
    const priority = document.getElementById('edit-task-priority').value;
    const dueDate = document.getElementById('edit-task-due-date').value;
    const status = document.getElementById('edit-task-status').value;

    if (!title) {
        alert('Please enter a task title');
        return;
    }

    const taskIndex = tasks.findIndex(t => t.id == id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title,
            description,
            priority,
            dueDate,
            status
        };
        
        saveTasks();
        renderTasks();
        closeModal();
    }
}

// Delete Task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Clear All Tasks
function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Save Tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update Stats
function updateStats() {
    const totalTasks = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;

    document.querySelector('.stat-value.text-primary').textContent = totalTasks;
    document.querySelector('.stat-value.text-secondary').textContent = inProgress;
    document.querySelector('.stat-value.text-success').textContent = completed;

    document.getElementById('todo-count').textContent = tasks.filter(t => t.status === 'todo').length;
    document.getElementById('inprogress-count').textContent = inProgress;
    document.getElementById('completed-count').textContent = completed;
}