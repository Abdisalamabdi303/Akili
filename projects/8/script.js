// TaskMaster - Interactive Todo List Application
// Built by Abdisalam Abdi Shakul

// State management
let tasks = JSON.parse(localStorage.getItem('taskMasterTasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');
const searchInput = document.getElementById('searchInput');

// Wait for Lucide to be ready before initializing
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
} else {
    document.addEventListener('lucide-ready', () => lucide.createIcons());
}

// Load tasks on startup
renderTasks();

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
filterAll.addEventListener('click', () => setFilter('all'));
filterActive.addEventListener('click', () => setFilter('active'));
filterCompleted.addEventListener('click', () => setFilter('completed'));
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTasks();
});

// Core Functions
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    taskInput.value = '';
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
    
    // Update button styles
    [filterAll, filterActive, filterCompleted].forEach(btn => {
        btn.classList.remove('btn-active', 'btn-primary');
    });
    
    if (filter === 'all') filterAll.classList.add('btn-active', 'btn-primary');
    if (filter === 'active') filterActive.classList.add('btn-active', 'btn-primary');
    if (filter === 'completed') filterCompleted.classList.add('btn-active', 'btn-primary');
}

function saveTasks() {
    localStorage.setItem('taskMasterTasks', JSON.stringify(tasks));
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getFilteredTasks() {
    let filtered = tasks;
    
    // Apply status filter
    if (currentFilter === 'active') {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
    }
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(task => 
            task.text.toLowerCase().includes(searchQuery)
        );
    }
    
    return filtered;
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Update task count
    const pendingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} pending`;
    
    // Clear current list
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-8">
                    <div class="alert alert-info">
                        <i data-lucide="info" class="w-6 h-6"></i>
                        <span>No tasks found</span>
                    </div>
                </td>
            </tr>
        `;
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 0);
        return;
    }
    
    // Render tasks
    filteredTasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-base-200 transition-colors';
        tr.innerHTML = `
            <td>
                <button 
                    class="btn btn-ghost btn-circle ${task.completed ? 'btn-success' : 'btn-ghost'}"
                    onclick="toggleTask(${task.id})"
                    title="${task.completed ? 'Mark as active' : 'Mark as completed'}"
                >
                    <i data-lucide="${task.completed ? 'check-circle' : 'circle'}" class="w-5 h-5"></i>
                </button>
            </td>
            <td class="${task.completed ? 'text-gray-500 line-through' : ''}">
                ${task.text}
            </td>
            <td class="text-sm text-gray-500">
                ${formatDate(task.createdAt)}
            </td>
            <td>
                <button 
                    class="btn btn-ghost btn-circle btn-error"
                    onclick="deleteTask(${task.id})"
                    title="Delete task"
                >
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        `;
        taskList.appendChild(tr);
    });
    
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 0);
}

// Initialize filter state
setFilter('all');