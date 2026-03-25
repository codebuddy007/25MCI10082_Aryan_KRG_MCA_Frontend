const taskButton = document.querySelector('#addTaskBtn');
const taskList = document.querySelector('#taskList');

let tasks = [];
if (localStorage.getItem('tasks')) {
    try {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    } catch (e) {
        tasks = [];
    }
}
let currentFilter = 'all';

taskButton.addEventListener('click', () => {
    const taskName = document.querySelector('#taskName').value;
    const priority = document.querySelector('#priority').value;
    const deadline = document.querySelector('#deadline').value;
    if (taskName && deadline) {
        tasks.push({ name: taskName, priority, deadline, completed: false });
        saveTasks();
        renderTasks();
        updateStats();
        document.querySelector('#taskName').value = '';
        document.querySelector('#priority').value = 'Medium';
        document.querySelector('#deadline').value = '';
    } else {
        alert('Please enter all fields.');
    }
});

function renderTasks() {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        let cardClass = 'card p-3 mb-2';
        if (task.completed) cardClass += ' completed';
        if (task.priority === 'High') cardClass += ' red-border';
        taskItem.className = cardClass;
        taskItem.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <input type="checkbox" class="form-check-input me-2" ${task.completed ? 'checked' : ''} data-index="${index}">
                    <span>${task.name}</span>
                    <span class="badge ms-2 ${
                        task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-success'
                    }">${task.priority}</span>
                </div>
                <div>
                    <span class="me-3"><i class="bi bi-calendar"></i> ${task.deadline || '-'} </span>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    });

    const checkboxes = taskList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const idx = this.getAttribute('data-index');
            tasks[idx].completed = this.checked;
            saveTasks();
            renderTasks();
            updateStats();
        });
    });
}

const totalTasks = document.querySelector('#totalTasks');
const completedTasks = document.querySelector('#completedTasks');
const pendingTasks = document.querySelector('#pendingTasks');

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;



let filterTimeout = null;
function debounceFilter(filterType) {
    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        currentFilter = filterType;
        renderTasks();
        filterTimeout = null;
    }, 300);
}

document.getElementById('allTasksBtn').addEventListener('click', function() {
    debounceFilter('all');
});
document.getElementById('completedTasksBtn').addEventListener('click', function() {
    debounceFilter('completed');
});
document.getElementById('pendingTasksBtn').addEventListener('click', function() {
    debounceFilter('pending');
});
}

taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        debounceDeleteTask(e.target.getAttribute('data-index'));
    }
});

let deleteTimeout = null;
function debounceDeleteTask(idx) {
    if (deleteTimeout) clearTimeout(deleteTimeout);
    deleteTimeout = setTimeout(() => {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
        updateStats();
        deleteTimeout = null;
    }, 300); 
}



function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


renderTasks();
updateStats();



let sortTimeout = null;
function debounceSort(option) {
    if (sortTimeout) clearTimeout(sortTimeout);
    sortTimeout = setTimeout(() => {
        if (option === 'priority') {
            tasks.sort((a, b) => {
                const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } else if (option === 'deadline') {
            tasks.sort((a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
        }
        renderTasks();
        sortTimeout = null;
    }, 300);
}

document.getElementById('sortOption').addEventListener('change', function() {
    debounceSort(this.value);
});

function highlightOverdueTasks() {
    const today = new Date();
    const taskItems = document.querySelectorAll('.card');
    taskItems.forEach((item, index) => {
        const task = tasks[index];
        if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            if (deadlineDate < today && !task.completed) {
                item.classList.add('overdue');
            } else {                item.classList.remove('overdue');
            }
        } else {
            item.classList.remove('overdue');
        }
    });
}

setInterval(highlightOverdueTasks, 60000);
highlightOverdueTasks();




