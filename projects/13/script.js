// TaskFlow - Elite Vanilla JS Todo Application
// Built by Akili

// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
let currentFilter = 'all';
let currentPriorityFilter = null;

// --- DOM Elements ---
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const pendingCountEl = document.getElementById('pendingCount');
const quickAddInput = document.getElementById('quickAddInput');
const themeToggle = document.getElementById('themeToggle');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterTabs = document.querySelectorAll('.tab');
const priorityFilterSelect = document.getElementById('priorityFilter');
const toastContainer = document.getElementById('toastContainer');

// --- Initialization ---
function init() {
    // Wait for Lucide to load if needed, or just call it
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    renderTasks();
    updateStats();
    setupEventListeners();
    checkTheme();
}

// --- Core Logic ---

function addTask() {
    const text = taskInput.value.trim() || quickAddInput.value.trim();
    const priority = taskInput.value.trim() ? priorityInput.value : 'medium';

    if (!text) {
        showToast('Please enter a task description', 'error');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Reset inputs
    taskInput.value = '';
    quickAddInput.value = '';
    taskInput.focus();
    
    showToast('Task added successfully!', 'success');
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    showToast('Task deleted', 'neutral');
}

function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        showToast('No completed tasks to clear', 'neutral');
        return;
    }
    
    if(confirm(`Delete ${completedCount} completed tasks?`)) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateStats();
        showToast('Completed tasks cleared', 'success');
    }
}

// --- Rendering ---

function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter Logic
    let filteredTasks = tasks;
    
    // Status Filter
    if (currentFilter === 'active') {
        filteredTasks = filteredTasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.completed);
    }
    
    // Priority Filter
    if (currentPriorityFilter) {
        filteredTasks = filteredTasks.filter(t => t.priority === currentPriorityFilter);
    }

    if (filteredTasks.length === 0) {
        taskList.appendChild(emptyState);
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    filteredTasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `card bg-base-100 shadow-sm border border-base-content/5 hover:shadow-md transition-all duration-300 ${task.completed ? 'opacity-60' : ''}`;
        
        const priorityColor = {
            'high': 'text-error',
            'medium': 'text-warning',
            'low': 'text-info'
        }[task.priority];

        const priorityBadge = {
            'high': 'badge-error',
            'medium': 'badge-warning',
            'low': 'badge-info'
        }[task.priority];

        taskEl.innerHTML = `
            <div class="card-body p-4 flex flex-row items-center gap-4">
                <input type="checkbox" class="checkbox checkbox-primary checkbox-lg" ${task.completed ? 'checked' : ''} onchange="window.toggleTask(${task.id})" />
                
                <div class="flex-grow">
                    <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-bold text-lg ${task.completed ? 'line-through text-base-content/50' : 'text-base-content'}">${escapeHtml(task.text)}</h3>
                        <span class="badge ${priorityBadge} badge-xs font-bold uppercase tracking-wider">${task.priority}</span>
                    </div>
                    <p class="text-xs text-base-content/40">Created ${formatDate(task.createdAt)}</p>
                </div>

                <button class="btn btn-ghost btn-sm text-error hover:bg-error/10" onclick="window.deleteTask(${task.id})">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        `;
        
        taskList.appendChild(taskEl);
    });
    
    // Re-initialize icons for new elements
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function updateStats() {
    const pending = tasks.filter(t => !t.completed).length;
    pendingCountEl.textContent = pending;
    
    // Animate count
    pendingCountEl.classList.remove('scale-110');
    void pendingCountEl.offsetWidth; // trigger reflow
    pendingCountEl.classList.add('scale-110');
}

function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

// --- Utilities ---

function showToast(message, type = 'neutral') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} shadow-lg mb-2 transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" class="w-6 h-6"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });
    
    // Remove after 3s
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

function checkTheme() {
    const savedTheme = localStorage.getItem('taskflow_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('taskflow_theme', next);
    updateThemeIcon(next);
    showToast(`Switched to ${next} mode`, 'neutral');
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- Event Listeners ---

function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    quickAddInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    themeToggle.addEventListener('click', toggleTheme);
    
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Filter Tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            currentFilter = tab.dataset.filter;
            renderTasks();
        });
    });

    // Priority Filter
    priorityFilterSelect.addEventListener('change', (e) => {
        currentPriorityFilter = e.target.value === 'Filter Priority' ? null : e.target.value;
        renderTasks();
    });

    // Expose functions to window for inline HTML handlers
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
}

// Run Init
init();