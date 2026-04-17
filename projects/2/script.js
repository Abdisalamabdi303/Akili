// Task Manager with Drag-and-Drop and Local Storage

// State management
let tasks = JSON.parse(localStorage.getItem('taskManagerTasks')) || [];

// DOM Elements
const todoList = document.getElementById('todoList');
const inProgressList = document.getElementById('inProgressList');
const doneList = document.getElementById('doneList');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');

// Modal elements
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');

// Initialize Lucide icons after DOM is ready
function initIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize the app
function init() {
    initIcons();
    renderTasks();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Add task button
    addTaskBtn.addEventListener('click', () => {
        taskModal.showModal();
        taskTitleInput.focus();
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        taskModal.closeModal();
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
    });

    // Save task
    saveTaskBtn.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        if (title) {
            const newTask = {
                id: Date.now().toString(),
                title: title,
                description: description,
                status: 'todo'
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskModal.closeModal();
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
        }
    });

    // Clear all tasks
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        renderTasks(e.target.value);
    });

    // Drag and drop events for all lists
    [todoList, inProgressList, doneList].forEach(list => {
        list.addEventListener('dragstart', handleDragStart);
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
}

// Drag and drop handlers
let draggedTaskId = null;

function handleDragStart(e) {
    draggedTaskId = e.target.dataset.taskId;
    e.target.classList.add('opacity-50');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('bg-base-300');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('bg-base-300');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-base-300');

    if (draggedTaskId) {
        const newStatus = e.currentTarget.dataset.column;
        const taskIndex = tasks.findIndex(task => task.id === draggedTaskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            saveTasks();
            renderTasks();
        }

        draggedTaskId = null;
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('taskManagerTasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks(searchTerm = '') {
    // Clear lists
    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    // Filter tasks based on search term
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group tasks by status
    const todoTasks = filteredTasks.filter(task => task.status === 'todo');
    const inProgressTasks = filteredTasks.filter(task => task.status === 'inProgress');
    const doneTasks = filteredTasks.filter(task => task.status === 'done');

    // Update counters
    document.getElementById('todoCount').textContent = todoTasks.length;
    document.getElementById('inProgressCount').textContent = inProgressTasks.length;
    document.getElementById('doneCount').textContent = doneTasks.length;

    // Render tasks in each column
    todoTasks.forEach(task => createTaskElement(task, todoList));
    inProgressTasks.forEach(task => createTaskElement(task, inProgressList));
    doneTasks.forEach(task => createTaskElement(task, doneList));
    
    // Re-initialize Lucide icons after rendering
    initIcons();
}

// Create task element
function createTaskElement(task, container) {
    const taskElement = document.createElement('div');
    taskElement.className = 'card bg-base-100 shadow-md p-4 draggable cursor-move transition-all duration-300 hover:scale-105 active:scale-95';
    taskElement.dataset.taskId = task.id;
    taskElement.draggable = true;

    taskElement.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-base-content">${escapeHtml(task.title)}</h3>
            <button class="btn btn-ghost btn-xs btn-circle delete-btn" data-task-id="${task.id}">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
        ${task.description ? `<p class="text-sm text-base-content/70 mb-3">${escapeHtml(task.description)}</p>` : ''}
        <div class="flex justify-between items-center mt-auto">
            <span class="badge badge-outline badge-sm ${
                task.status === 'todo' ? 'badge-primary' : 
                task.status === 'inProgress' ? 'badge-secondary' : 'badge-success'
            }">
                ${task.status === 'todo' ? 'To Do' : 
                  task.status === 'inProgress' ? 'In Progress' : 'Done'}
            </span>
        </div>
    `;

    container.appendChild(taskElement);

    // Add delete button functionality
    const deleteBtn = taskElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize the app
init();