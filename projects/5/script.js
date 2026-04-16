document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // State management
    let tasks = JSON.parse(localStorage.getItem('brightTasks') || '[]');
    let currentFilter = 'all';

    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const filterAll = document.getElementById('filterAll');
    const filterActive = document.getElementById('filterActive');
    const filterCompleted = document.getElementById('filterCompleted');
    const itemsLeft = document.getElementById('itemsLeft');
    const clearCompleted = document.getElementById('clearCompleted');

    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('brightTasks', JSON.stringify(tasks));
    };

    // Render tasks
    const renderTasks = () => {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-base-200 transition-colors';
            tr.innerHTML = `
                <td class="flex items-center gap-3">
                    <button class="btn btn-ghost btn-circle ${task.completed ? 'btn-success' : 'btn-ghost'}" onclick="toggleTask(${task.id})">
                        <i data-lucide="${task.completed ? 'check-circle' : 'circle'}" class="w-5 h-5"></i>
                    </button>
                    <span class="${task.completed ? 'line-through text-base-content/50' : ''}">${escapeHtml(task.text)}</span>
                </td>
                <td class="text-right">
                    <button class="btn btn-ghost btn-circle text-error" onclick="deleteTask(${task.id})">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </td>
            `;
            taskList.appendChild(tr);
        });

        // Update icon library after DOM updates
        lucide.createIcons();

        // Update items left count
        const activeCount = tasks.filter(task => !task.completed).length;
        itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    };

    // Add new task
    const addTask = () => {
        const text = taskInput.value.trim();
        if (text === '') return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.unshift(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    };

    // Toggle task completion
    window.toggleTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };

    // Delete task
    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    };

    // Clear completed tasks
    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    // Filter buttons
    filterAll.addEventListener('click', () => {
        currentFilter = 'all';
        updateFilterButtons();
        renderTasks();
    });

    filterActive.addEventListener('click', () => {
        currentFilter = 'active';
        updateFilterButtons();
        renderTasks();
    });

    filterCompleted.addEventListener('click', () => {
        currentFilter = 'completed';
        updateFilterButtons();
        renderTasks();
    });

    const updateFilterButtons = () => {
        filterAll.classList.remove('active');
        filterActive.classList.remove('active');
        filterCompleted.classList.remove('active');

        if (currentFilter === 'all') filterAll.classList.add('active');
        else if (currentFilter === 'active') filterActive.classList.add('active');
        else if (currentFilter === 'completed') filterCompleted.classList.add('active');
    };

    // Event listeners
    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initialize
    renderTasks();
});

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}