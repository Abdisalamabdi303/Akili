// TaskMaster - Vanilla JS Todo List Application

// State management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentSort = 'date-desc';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Priority colors mapping
const priorityColors = {
    high: 'badge-error',
    medium: 'badge-warning',
    low: 'badge-success'
};

// Initialize the app
function init() {
    renderTasks();
    updateStats();
    
    // Event Listeners
    taskForm.addEventListener('submit', handleAddTask);
    searchInput.addEventListener('input', () => renderTasks());
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderTasks();
    });
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('btn-active'));
            e.target.classList.add('btn-active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
}

// Add new task
function handleAddTask(e) {
    e.preventDefault();
    
    const text = taskInput.value.trim();
    if (!text) return;
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: prioritySelect.value,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    taskInput.value = '';
    taskInput.focus();
}

// Render tasks
function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter = currentFilter === 'all' 
            ? true 
            : currentFilter === 'completed' 
                ? task.completed 
                : !task.completed;
        
        return matchesSearch && matchesFilter;
    });
    
    // Sort tasks
    filteredTasks.sort((a, b) => {
        if (currentSort === 'date-desc') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (currentSort === 'date-asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (currentSort === 'priority') {
            const priorityValues = { high: 3, medium: 2, low: 1 };
            return priorityValues[b.priority] - priorityValues[a.priority];
        }
        return 0;
    });
    
    // Clear list and empty state
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.innerHTML = `
            <div class="empty-state rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <i class="fas fa-clipboard text-white text-4xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No Tasks Found</h3>
            <p class="text-white/80">${searchTerm ? 'Try a different search term' : 'Add a task above to get started!'}</p>
        `;
    } else {
        emptyState.classList.add('hidden');
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item bg-base-100 rounded-box shadow border border-base-content/10 p-4 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="checkbox checkbox-primary" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})" />
                <div class="flex-1 min-w-0">
                    <p class="font-medium truncate ${task.completed ? 'text-base-content/60' : ''}">${escapeHtml(task.text)}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="badge ${priorityColors[task.priority]} badge-sm">${task.priority}</span>
                        <span class="text-xs text-base-content/50">Created: ${formatDate(task.createdAt)}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="deleteTask(${task.id})" class="btn btn-ghost btn-xs btn-error" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
    
    // Show/hide clear completed button
    const hasCompleted = tasks.some(t => t.completed);
    clearCompletedBtn.classList.toggle('hidden', !hasCompleted);
}

// Toggle task completion
window.toggleTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
};

// Delete task
window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
};

// Clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
}

// Update stats
function updateStats() {
    totalTasksEl.textContent = tasks.length;
    pendingTasksEl.textContent = tasks.filter(t => !t.completed).length;
    completedTasksEl.textContent = tasks.filter(t => t.completed).length;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
init();