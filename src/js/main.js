'use strict';

const tasks = [];
const RENDER_EVENT = 'render-event';
const SAVED_EVENT = 'saved-event';
const STORAGE_KEY = 'Task_Manager_App';

const toasts = document.querySelectorAll('.toast');

let taskIndexUpdated = -1;

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        toasts.forEach(toast => {
            toast.textContent = 'Aplikasi ini tidak dapat berjalan karena browser kamu tidak mendukung local storage. Silakan update browser ke versi terbaru.';
            toast.classList.add('show-toast');
        });
        return false;
    };

    return true;
};

function generateId() {
    return +new Date();
};

function generateObject(id, taskName, taskDescription, taskDateStart, taskTimeStart, taskDateEnd, taskTimeEnd, isComplete) {
    return {
        id,
        taskName,
        taskDescription,
        taskDateStart,
        taskTimeStart,
        taskDateEnd,
        taskTimeEnd,
        isComplete
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    if (location.pathname === '/task-form.html') {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateForm();
        });
    };

    if (isStorageExist()) {
        loadDataFromStorage();
        console.log(tasks);
    };
});

function validateForm() {
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskDateStartInput = document.getElementById('task-date-start');
    const taskTimeStartInput = document.getElementById('task-time-start');
    const taskDateEndInput = document.getElementById('task-date-end');
    const taskTimeEndInput = document.getElementById('task-time-end');

    const taskNameErrorMsg = taskNameInput.nextElementSibling;
    const taskDescriptionErrorMsg = taskDescriptionInput.nextElementSibling;
    const taskDateStartErrorMsg = taskDateStartInput.nextElementSibling;
    const taskTimeStartErrorMsg = taskTimeStartInput.nextElementSibling;
    const taskDateEndErrorMsg = taskDateEndInput.nextElementSibling;
    const taskTimeEndErrorMsg = taskTimeEndInput.nextElementSibling;

    if (taskNameInput.value.trim() == '' && taskDescriptionInput.value.trim() == '' && taskDateStartInput.value === '' && taskTimeStartInput.value === '' && taskDateEndInput.value === '' && taskTimeEndInput.value === '') {
        document.querySelector('.notif-info').classList.add('show-notif-info');

        taskNameErrorMsg.style.display = 'none';
        taskDescriptionErrorMsg.style.display = 'none';
        taskDateStartErrorMsg.style.display = 'none';
        taskTimeStartErrorMsg.style.display = 'none';
        taskDateEndErrorMsg.style.display = 'none';
        taskTimeEndErrorMsg.style.display = 'none';

        return false;
    } else {
        document.querySelector('.notif-info').classList.remove('show-notif-info');

        if (taskNameInput.value.trim() !== '' && taskDescriptionInput.value.trim() !== '' && taskDateStartInput.value !== '' && taskTimeStartInput.value !== '' && taskDateEndInput.value !== '' && taskTimeEndInput.value !== '') {
            taskNameErrorMsg.style.display = 'none';
            taskDescriptionErrorMsg.style.display = 'none';
            taskDateStartErrorMsg.style.display = 'none';
            taskTimeStartErrorMsg.style.display = 'none';
            taskDateEndErrorMsg.style.display = 'none';
            taskTimeEndErrorMsg.style.display = 'none';

            addTask();

            toasts.forEach(toast => {
                if (toast.classList.contains('show-toast')) {
                    return false;
                } else {
                    toast.textContent = `Nama tugas "${taskNameInput.value.toUpperCase()}" berhasil disimpan.`;
                    toast.classList.add('show-toast');

                    setTimeout(() => {
                        toast.classList.remove('show-toast');

                        location.href = '/task-uncomplete.html';

                        return true;
                    }, 3000);
                };
            });
        } else {
            if (taskNameInput.value.trim() == '') {
                taskNameErrorMsg.textContent = 'Nama tugas tidak boleh kosong!';
                taskNameErrorMsg.style.display = 'inline';
            } else {
                taskNameErrorMsg.style.display = 'none';
            };

            if (taskDescriptionInput.value.trim() == '') {
                taskDescriptionErrorMsg.textContent = 'Deskripsi tugas tidak boleh kosong!';
                taskDescriptionErrorMsg.style.display = 'inline';
            } else {
                taskDescriptionErrorMsg.style.display = 'none';
            };

            if (taskDateStartInput.value.trim() == '') {
                taskDateStartErrorMsg.textContent = 'Tentukan tanggal mulai!';
                taskDateStartErrorMsg.style.display = 'inline';
            } else {
                taskDateStartErrorMsg.style.display = 'none';
            };

            if (taskTimeStartInput.value.trim() == '') {
                taskTimeStartErrorMsg.textContent = 'Tentukan jam mulai!';
                taskTimeStartErrorMsg.style.display = 'inline';
            } else {
                taskTimeStartErrorMsg.style.display = 'none';
            };

            if (taskDateEndInput.value.trim() == '') {
                taskDateEndErrorMsg.textContent = 'Tentukan tanggal selesai!';
                taskDateEndErrorMsg.style.display = 'inline';
            } else {
                taskDateEndErrorMsg.style.display = 'none';
            };

            if (taskTimeEndInput.value.trim() == '') {
                taskTimeEndErrorMsg.textContent = 'Tentukan jam selesai!';
                taskTimeEndErrorMsg.style.display = 'inline';
            } else {
                taskTimeEndErrorMsg.style.display = 'none';
            };

            return false;
        };
    };
};

function addTask() {
    const taskNameInput = document.getElementById('task-name').value.trim();
    const taskDescriptionInput = document.getElementById('task-description').value.trim();
    const taskDateStartInput = document.getElementById('task-date-start').value;
    const taskTimeStartInput = document.getElementById('task-time-start').value;
    const taskDateEndInput = document.getElementById('task-date-end').value;
    const taskTimeEndInput = document.getElementById('task-time-end').value;

    if (taskIndexUpdated === -1) {
        if (tasks.some(task => task.taskName === taskNameInput.toLowerCase())) {
            toasts.forEach(toast => {
                toast.textContent = `Nama tugas "${taskNameInput.toUpperCase()}" sudah ada didalam daftar. Silakan buat tugas baru dengan nama yang lain.`;
                toast.classList.add('show-toast');

                setTimeout(() => {
                    toast.classList.remove('show-toast');
                }, 3000);
            });

            return;
        };

        const generatedID = generateId();
        const tasksObject = generateObject(
            generatedID,
            taskNameInput,
            taskDescriptionInput,
            taskDateStartInput,
            taskTimeStartInput,
            taskDateEndInput,
            taskTimeEndInput,
            false
        );

        tasks.push(tasksObject);
    } else {
        taskUpdated(
            taskNameInput,
            taskDescriptionInput,
            taskDateStartInput,
            taskTimeStartInput,
            taskDateEndInput,
            taskTimeEndInput
        );
    };

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(tasks);
        localStorage.setItem(STORAGE_KEY, parsed);

        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if (data !== null) {
        for (const index of data) {
            tasks.push(index);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function displayTaskList(tasksObject) {
    const taskUncompleteContainer = document.querySelector('.task-uncomplete-container');
    const taskCompleteContainer = document.querySelector('.task-complete-container');

    // task name group element
    const labelTaskName = document.createElement('small');
    labelTaskName.innerText = 'Nama tugas';

    const contentTaskName = document.createElement('h1');
    contentTaskName.innerText = tasksObject.taskName;

    const taskNameGroup = document.createElement('span');
    taskNameGroup.classList.add('task-name-group');
    taskNameGroup.appendChild(labelTaskName);
    taskNameGroup.appendChild(contentTaskName);

    // task description group element
    const labelTaskDescription = document.createElement('small');
    labelTaskDescription.innerText = 'Deskripsi tugas';

    const contentTaskDescription = document.createElement('p');
    contentTaskDescription.innerText = tasksObject.taskDescription;

    const taskDescriptionGroup = document.createElement('span');
    taskDescriptionGroup.classList.add('task-description-group');
    taskDescriptionGroup.appendChild(labelTaskDescription);
    taskDescriptionGroup.appendChild(contentTaskDescription);

    // task date start group element
    const labelTaskDateStart = document.createElement('small');
    labelTaskDateStart.innerText = 'Tanggal mulai';

    const contentTaskDateStart = document.createElement('p');
    contentTaskDateStart.innerText = tasksObject.taskDateStart;

    const taskDateStartGroup = document.createElement('span');
    taskDateStartGroup.classList.add('date-group');
    taskDateStartGroup.appendChild(labelTaskDateStart);
    taskDateStartGroup.appendChild(contentTaskDateStart);

    // task time start group element
    const labelTaskTimeStart = document.createElement('small');
    labelTaskTimeStart.innerText = 'Jam mulai';

    const contentTaskTimeStart = document.createElement('p');
    contentTaskTimeStart.innerText = tasksObject.taskTimeStart;

    const taskTimeStartGroup = document.createElement('span');
    taskTimeStartGroup.classList.add('time-group');
    taskTimeStartGroup.appendChild(labelTaskTimeStart);
    taskTimeStartGroup.appendChild(contentTaskTimeStart);

    // wrapper task date and time start group element
    const wrapperDateTimeStartGroup = document.createElement('span');
    wrapperDateTimeStartGroup.classList.add('wrapper-date-group');
    wrapperDateTimeStartGroup.appendChild(taskDateStartGroup);
    wrapperDateTimeStartGroup.appendChild(taskTimeStartGroup);

    // task date end group element
    const labelTaskDateEnd = document.createElement('small');
    labelTaskDateEnd.innerText = 'Tanggal selesai';

    const contentTaskDateEnd = document.createElement('p');
    contentTaskDateEnd.innerText = tasksObject.taskDateEnd;

    const taskDateEndGroup = document.createElement('span');
    taskDateEndGroup.classList.add('date-group');
    taskDateEndGroup.appendChild(labelTaskDateEnd);
    taskDateEndGroup.appendChild(contentTaskDateEnd);

    // task time end group element
    const labelTaskTimeEnd = document.createElement('small');
    labelTaskTimeEnd.innerText = 'Jam selesai';

    const contentTaskTimeEnd = document.createElement('p');
    contentTaskTimeEnd.innerText = tasksObject.taskTimeEnd;

    const taskTimeEndGroup = document.createElement('span');
    taskTimeEndGroup.classList.add('time-group');
    taskTimeEndGroup.appendChild(labelTaskTimeEnd);
    taskTimeEndGroup.appendChild(contentTaskTimeEnd);

    // wrapper task date and time end group element
    const wrapperDateTimeEndGroup = document.createElement('span');
    wrapperDateTimeEndGroup.classList.add('wrapper-date-group');
    wrapperDateTimeEndGroup.appendChild(taskDateEndGroup);
    wrapperDateTimeEndGroup.appendChild(taskTimeEndGroup);

    // list container element
    const listContainer = document.createElement('li');
    listContainer.setAttribute('id', `taskID-${tasksObject.id}`);
    listContainer.appendChild(taskNameGroup);
    listContainer.appendChild(taskDescriptionGroup);
    listContainer.appendChild(wrapperDateTimeStartGroup);
    listContainer.appendChild(wrapperDateTimeEndGroup);

    if (tasksObject.isComplete === false) {
        const buttonCheck = document.createElement('button');
        buttonCheck.classList.add('button-check');
        buttonCheck.innerHTML = `<i class="fa-solid fa-check"></i>`;

        buttonCheck.addEventListener('click', () => {
            popupConfirmCheck(tasksObject.id, tasksObject.taskName);
        });

        const buttonUpdate = document.createElement('button');
        buttonUpdate.classList.add('button-update');
        buttonUpdate.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

        buttonUpdate.addEventListener('click', () => {
            popupConfirmUpdate(tasksObject.id, tasksObject.taskName, tasksObject.taskDescription, tasksObject.taskDateStart, tasksObject.taskTimeStart, tasksObject.taskDateEnd, tasksObject.taskTimeEnd);
        });

        const buttonRemove = document.createElement('button');
        buttonRemove.classList.add('button-remove');
        buttonRemove.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        buttonRemove.addEventListener('click', () => {
            popupConfirmRemove(tasksObject.id, tasksObject.taskName);
        });

        const buttonGroup = document.createElement('span');
        buttonGroup.classList.add('button-group');
        buttonGroup.appendChild(buttonCheck);
        buttonGroup.appendChild(buttonUpdate);
        buttonGroup.appendChild(buttonRemove);

        listContainer.append(buttonGroup);

        if (location.pathname === '/task-uncomplete.html') {
            taskUncompleteContainer.appendChild(listContainer);
        };
    } else {
        contentTaskName.classList.add('task-completed');
        contentTaskDescription.classList.add('task-completed');
        contentTaskDateStart.classList.add('task-completed');
        contentTaskTimeStart.classList.add('task-completed');
        contentTaskDateEnd.classList.add('task-completed');
        contentTaskTimeEnd.classList.add('task-completed');

        const buttonUndo = document.createElement('button');
        buttonUndo.classList.add('button-check');
        buttonUndo.innerHTML = `<i class="fa-solid fa-rotate-left"></i>`;

        buttonUndo.addEventListener('click', () => {
            popupConfirmUndo(tasksObject.id, tasksObject.taskName);
        });

        const buttonUpdate = document.createElement('button');
        buttonUpdate.classList.add('button-update');
        buttonUpdate.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

        buttonUpdate.addEventListener('click', () => {
            popupConfirmUpdate(tasksObject.id, tasksObject.taskName, tasksObject.taskDescription, tasksObject.taskDateStart, tasksObject.taskTimeStart, tasksObject.taskDateEnd, tasksObject.taskTimeEnd);
        });

        const buttonRemove = document.createElement('button');
        buttonRemove.classList.add('button-remove');
        buttonRemove.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        buttonRemove.addEventListener('click', () => {
            popupConfirmRemove(tasksObject.id, tasksObject.taskName);
        });

        const buttonGroup = document.createElement('span');
        buttonGroup.classList.add('button-group');
        buttonGroup.appendChild(buttonUndo);
        buttonGroup.appendChild(buttonUpdate);
        buttonGroup.appendChild(buttonRemove);

        listContainer.append(buttonGroup);

        if (location.pathname === '/task-complete.html') {
            taskCompleteContainer.appendChild(listContainer);
        };
    };

    return listContainer;
};

function findTaskId(id) {
    for (const taskItem of tasks) {
        if (taskItem.id === id) {
            return taskItem;
        };
    };

    return null;
};

function findTaskIndex(id) {
    for (const index in tasks) {
        if (tasks[index].id === id) {
            return index;
        };
    };

    return -1;
};

document.addEventListener(RENDER_EVENT, () => {
    const taskUncompleteContainer = document.querySelector('.task-uncomplete-container');
    const taskCompleteContainer = document.querySelector('.task-complete-container');

    for (const taskItem of tasks) {
        const listElement = displayTaskList(taskItem);

        if (taskItem.isComplete === false) {
            if (location.pathname === '/task-uncomplete.html') {
                taskUncompleteContainer.append(listElement);
            };
        } else {
            if (location.pathname === '/task-complete.html') {
                taskCompleteContainer.append(listElement);
            };
        };
    };
});