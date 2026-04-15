document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between mb-4';
            li.innerHTML = `
                <span class="text-base">${taskText}</span>
                <button class="btn btn-error rounded-3xl">Delete</button>
            `;

            li.querySelector('button').addEventListener('click', () => {
                taskList.removeChild(li);
            });

            li.querySelector('span').addEventListener('click', () => {
                li.classList.toggle('line-through');
            });

            taskList.appendChild(li);
            taskInput.value = '';
        }
    }
});