document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const searchInput = document.getElementById('searchInput');
    const filterTabs = document.getElementById('filterTabs');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskDateInput = document.getElementById('taskDate');
    
    // Stats elements
    const totalTasksEl = document.getElementById('totalTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const pendingTasksEl = document.getElementById('pendingTasks');

    // State
    let tasks = JSON.parse(localStorage.getItem('petParadiseTasks')) || [];
    let currentFilter = 'all';
    let editingTaskId = null;

    // Initialize Lucide icons
    lucide.createIcons();

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('petParadiseTasks', JSON.stringify(tasks));
        updateStats();
        renderTasks();
    }

    // Update statistics
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksEl.textContent = total;
        completedTasksEl.textContent = completed;
        pendingTasksEl.textContent = pending;
    }

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        
        // Filter tasks based on current filter and search
        const filteredTasks = tasks.filter(task => {
            const matchesFilter = currentFilter === 'all' 
                ? true 
                : currentFilter === 'completed' ? task.completed : !task.completed;
            
            const matchesSearch = task.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                task.description.toLowerCase().includes(searchInput.value.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300';
                taskItem.dataset.id = task.id;
                
                taskItem.innerHTML = `
                    <div class="card-body">
                        <div class="flex items-start gap-4">
                            <button class="btn btn-circle ${task.completed ? 'btn-success' : 'btn-ghost'} toggle-btn" data-id="${task.id}">
                                <i data-lucide="${task.completed ? 'check-circle' : 'circle'}" class="w-5 h-5"></i>
                            </button>
                            <div class="flex-1">
                                <h3 class="text-xl font-bold ${task.completed ? 'line-through text-gray-500' : ''}">${escapeHtml(task.title)}</h3>
                                <p class="text-gray-600 mt-1">${escapeHtml(task.description)}</p>
                                ${task.dueDate ? `<p class="text-sm text-gray-500 mt-2">Due: ${formatDate(task.dueDate)}</p>` : ''}
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-ghost btn-sm edit-btn" data-id="${task.id}">
                                    <i data-lucide="edit" class="w-4 h-4"></i>
                                </button>
                                <button class="btn btn-ghost btn-sm delete-btn" data-id="${task.id}">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
            });
            
            // Re-initialize Lucide icons for newly added elements
            lucide.createIcons();
            
            // Add event listeners to buttons
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', toggleTask);
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', deleteTask);
            });
            
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', editTask);
            });
        }
    }

    // Add new task
    function addTask() {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const dueDate = taskDateInput.value;
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        const task = {
            id: Date.now().toString(),
            title,
            description,
            dueDate: dueDate || null,
            completed: false
        };
        
        tasks.unshift(task);
        saveTasks();
        
        // Reset form and hide it
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskDateInput.value = '';
        document.getElementById('addTaskForm').style.display = 'none';
        addTaskBtn.innerHTML = '<i data-lucide="plus" class="mr-2"></i> Add New Task';
        lucide.createIcons();
    }

    // Update existing task
    function updateTask(id, updates) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
            saveTasks();
        }
    }

    // Delete task
    function deleteTask(e) {
        const id = e.target.closest('.delete-btn').dataset.id;
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
    }

    // Toggle task completion
    function toggleTask(e) {
        const id = e.target.closest('.toggle-btn').dataset.id;
        const task = tasks.find(task => task.id === id);
        if (task) {
            updateTask(id, { completed: !task.completed });
        }
    }

    // Edit task
    function editTask(e) {
        const id = e.target.closest('.edit-btn').dataset.id;
        const task = tasks.find(task => task.id === id);
        
        if (task) {
            taskTitleInput.value = task.title;
            taskDescriptionInput.value = task.description || '';
            taskDateInput.value = task.dueDate || '';
            editingTaskId = id;
            
            // Show form and update button text
            document.getElementById('addTaskForm').style.display = 'block';
            saveTaskBtn.textContent = 'Update Task';
            saveTaskBtn.dataset.id = id;
            
            // Scroll to form
            document.getElementById('addTaskForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Update task from edit form
    function updateExistingTask() {
        const id = saveTaskBtn.dataset.id;
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const dueDate = taskDateInput.value;
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        updateTask(id, { title, description, dueDate: dueDate || null });
        
        // Reset form and hide it
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskDateInput.value = '';
        editingTaskId = null;
        document.getElementById('addTaskForm').style.display = 'none';
        saveTaskBtn.textContent = 'Add Task';
        delete saveTaskBtn.dataset.id;
        
        addTaskBtn.innerHTML = '<i data-lucide="plus" class="mr-2"></i> Add New Task';
        lucide.createIcons();
    }

    // Clear all tasks
    function clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
        }
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        document.getElementById('addTaskForm').style.display = 'block';
        addTaskBtn.innerHTML = '<i data-lucide="x" class="mr-2"></i> Cancel';
        taskTitleInput.focus();
        lucide.createIcons();
    });

    cancelAddBtn.addEventListener('click', () => {
        document.getElementById('addTaskForm').style.display = 'none';
        addTaskBtn.innerHTML = '<i data-lucide="plus" class="mr-2"></i> Add New Task';
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskDateInput.value = '';
        lucide.createIcons();
    });

    saveTaskBtn.addEventListener('click', () => {
        if (editingTaskId) {
            updateExistingTask();
        } else {
            addTask();
        }
    });

    clearAllBtn.addEventListener('click', clearAllTasks);

    searchInput.addEventListener('input', renderTasks);

    filterTabs.addEventListener('click', (e) => {
        if (e.target.dataset.filter) {
            currentFilter = e.target.dataset.filter;
            
            // Update active state of buttons
            filterTabs.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('btn-active');
                if (btn.dataset.filter === currentFilter) {
                    btn.classList.add('btn-active');
                }
            });
            
            renderTasks();
        }
    });

    // Initialize
    updateStats();
    renderTasks();
});