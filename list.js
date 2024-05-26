const ul = document.querySelector('ul');
const addBtn = document.querySelector('.add-btn');
const clearBtn = document.querySelector('.clear-btn');
const saveBtn = document.querySelector('.save-btn');
const input = document.querySelector('#main-input');
const editInput = document.querySelector('#edit-input');

function toggleCompletedState(li) {
    const textSpan = li.querySelector('span');
    const icon = li.querySelector('i');
    if (li.classList.contains('completed')) {
        textSpan.removeAttribute('style');
        icon.className = 'fa-regular fa-circle';
        li.classList.remove('completed');
    } else {
        textSpan.style.textDecoration = 'line-through';
        icon.className = 'fa-solid fa-circle-check';
        li.classList.add('completed');
    }
}

function moveCompletedTasks() {
    const completedTasks = Array.from(ul.querySelectorAll('.completed'));
    completedTasks.forEach(task => {
        ul.appendChild(task);
        setTimeout(() => {
            task.style.transform = 'translateY(0)';
        }, 10);
    });
}

function toggleEditMode(li) {
    const span = li.querySelector('.item-text');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.id = 'edit-input';
    li.replaceChild(input, span);
    input.focus();

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            exitEditMode();
        }
    }

    function exitEditMode() {
        span.textContent = input.value;
        li.replaceChild(span, input);
        input.removeEventListener('blur', exitEditMode);
        input.removeEventListener('keydown', handleKeyDown);
    }

    input.addEventListener('blur', exitEditMode);
    input.addEventListener('keydown', handleKeyDown);
}

function addTask() {
    ul.insertAdjacentHTML(
        'afterbegin',
         `<li>
            <button class='complete-btn'>
                <i class="fa-regular fa-circle"></i>
            </button>
            <span class='item-text'>${input.value}</span>
            <button class='edit-btn'>
                <i class="fa-solid fa-pencil"></i>
            </button>
            <button class='delete-btn'>
                <i class="fa-solid fa-xmark"></i>
            </button>
        </li>
    `);

    input.value = '';
}

function saveList() {
    const list = [];
    const items = ul.querySelectorAll('li');
    
    items.forEach(item => {
        const text = item.querySelector('.item-text').textContent;
        const isCompleted = item.classList.contains('completed');
        list.push({ text, isCompleted });
    });

    localStorage.setItem('taskList', JSON.stringify(list));
}

function loadList() {
    const savedList = localStorage.getItem('taskList');
    if (savedList) {
        const list = JSON.parse(savedList);
        list.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button class='complete-btn'>
                    <i class="${item.isCompleted ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                </button>
                <span class='item-text'>${item.text}</span>
                <button class='edit-btn'>
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class='delete-btn'>
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            if (item.isCompleted) {
                li.classList.add('completed');
            }
            ul.appendChild(li);
        });
    }
}

addBtn.addEventListener('click', () => { 
    if (input.value !== '') {
        addTask();
    } else {
        alert('Oops! Field is blank. Please type something in the box before clicking "add task".');
    }
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value === '') {
        alert('Oops! Field is blank. Please type something in the box before clicking "add task".');
    } else if (event.key === 'Enter' && input.value !== '') {
        addTask();
    }
});

ul.addEventListener('click', (event) => {
    const target = event.target;
    const li = target.closest('li');

    if (target.classList.contains('delete-btn') || target.classList.contains('fa-xmark')) {
        ul.removeChild(li);
    } else if (target.classList.contains('edit-btn') || target.classList.contains('fa-pencil')) {
        toggleEditMode(li);
    } else if (target.classList.contains('complete-btn') || target.classList.contains('fa-circle') || target.classList.contains('fa-circle-check')){
        toggleCompletedState(li);
        moveCompletedTasks();
    }
});

clearBtn.addEventListener('click', () => {
    ul.innerHTML = '';
    localStorage.removeItem('taskList');
});

saveBtn.addEventListener('click', saveList);

document.addEventListener('DOMContentLoaded', loadList);

