'use strict';

const tasks = [];
const RENDER_EVENT = 'render-event';
const SAVED_EVENT = 'saved-event';
const STORAGE_KEY = 'Task_Manager_App';

const toasts = document.querySelectorAll('.toast');

const formSearchs = document.querySelectorAll('#form-search');
const searchInputs = document.querySelectorAll('#search-input');

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

    formSearchs.forEach(formSearch => {
        formSearch.addEventListener('submit', (e) => {
            e.preventDefault();
            checkSearchField();
        });
    });

    if (isStorageExist()) {
        loadDataFromStorage();
        console.table(tasks);
    };

    totalTaskInfo();
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

function popupConfirmCheck(id, taskName) {
    const confirmCheck = confirm(`Apa kamu yakin ingin menandai status "${taskName.toUpperCase()}" sebagai tugas selesai?`);

    if (confirmCheck) {
        markTaskCompleted(id, taskName);
    } else {
        return;
    };
};

function markTaskCompleted(id, taskName) {
    const taskTarget = findTaskId(id);

    if (taskTarget == null) return;

    taskTarget.isComplete = true;

    saveData();

    toasts.forEach(toast => {
        toast.textContent = `Status nama tugas "${taskName.toUpperCase()}" sudah ditandai sebagai tugas selesai.`;
        toast.classList.add('show-toast');

        setTimeout(() => {
            toast.classList.remove('show-toast');

            location.href = '/task-complete.html';
        }, 3000);
    });

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function popupConfirmUndo(id, taskName) {
    const confirmUndo = confirm(`Apa kamu yakin ingin mengubah status "${taskName.toUpperCase()}" sebagai tugas belum selesai?`);

    if (confirmUndo) {
        markTaskUncompleted(id, taskName);
    } else {
        return;
    };
};

function markTaskUncompleted(id, taskName) {
    const taskTarget = findTaskId(id);

    if (taskTarget == null) return;

    taskTarget.isComplete = false;

    saveData();

    toasts.forEach(toast => {
        toast.textContent = `Status nama tugas "${taskName.toUpperCase()}" sudah ditandai sebagai tugas belum selesai.`;
        toast.classList.add('show-toast');

        setTimeout(() => {
            toast.classList.remove('show-toast');

            location.href = '/task-uncomplete.html';
        }, 3000);
    });

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function findTaskId(id) {
    for (const taskItem of tasks) {
        if (taskItem.id === id) {
            return taskItem;
        };
    };

    return null;
};

function popupConfirmUpdate(id, taskName, taskDescription, taskDateStart, taskTimeStart, taskDateEnd, taskTimeEnd) {
    const confirmUpdate = confirm(`Apa kamu yakin ingin melakukan perubahan pada nama tugas "${taskName.toUpperCase()}"?`);

    if (confirmUpdate) {
        location.href = '/task-form.html';

        localStorage.setItem('Get_Task_Item_For_Update', JSON.stringify({
            id,
            taskName,
            taskDescription,
            taskDateStart,
            taskTimeStart,
            taskDateEnd,
            taskTimeEnd
        }));
    } else {
        return;
    };
};

document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname === '/task-form.html') {
        const getTaskItemForUpdate = localStorage.getItem('Get_Task_Item_For_Update');

        if (getTaskItemForUpdate) {
            const data = JSON.parse(getTaskItemForUpdate);
            getTaskItemSelected(data);

            localStorage.removeItem('Get_Task_Item_For_Update');
        };
    };
});

function getTaskItemSelected(data) {
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskDateStartInput = document.getElementById('task-date-start');
    const taskTimeStartInput = document.getElementById('task-time-start');
    const taskDateEndInput = document.getElementById('task-date-end');
    const taskTimeEndInput = document.getElementById('task-time-end');

    taskNameInput.value = data.taskName.trim();
    taskDescriptionInput.value = data.taskDescription.trim();
    taskDateStartInput.value = data.taskDateStart;
    taskTimeStartInput.value = data.taskTimeStart;
    taskDateEndInput.value = data.taskDateEnd;
    taskTimeEndInput.value = data.taskTimeEnd;

    taskIndexUpdated = data.id;
};

function taskUpdated(taskNameInput, taskDescriptionInput, taskDateStartInput, taskTimeStartInput, taskDateEndInput, taskTimeEndInput) {
    let taskItem = tasks.find(task => task.id === taskIndexUpdated);

    if (taskIndexUpdated !== -1) {
        if (taskItem) {
            taskItem.taskName = taskNameInput;
            taskItem.taskDescription = taskDescriptionInput;
            taskItem.taskDateStart = taskDateStartInput;
            taskItem.taskTimeStart = taskTimeStartInput;
            taskItem.taskDateEnd = taskDateEndInput;
            taskItem.taskTimeEnd = taskTimeEndInput;
        };
    };

    taskItem = -1;

    saveUpdate();
};

function saveUpdate() {
    saveData();

    toasts.forEach(toast => {
        toast.textContent = 'Tugas sudah berhasil diperbarui dan disimpan.';
        toast.classList.add('show-toast');

        setTimeout(() => {
            toast.classList.remove('show-toast');

            location.href = '/index.html';
        }, 3000);
    });
};

function popupConfirmRemove(id, taskName) {
    const confirmRemove = confirm(`Apa kamu yakin ingin menghapus "${taskName.toUpperCase()}" dari daftar tugas?`);

    if (confirmRemove) {
        taskRemoved(id, taskName);
    } else {
        return;
    };
};

function taskRemoved(id, taskName) {
    const taskTarget = findTaskId(id);

    if (taskTarget === -1) return;

    tasks.splice(taskTarget, 1);

    saveData();

    toasts.forEach(toast => {
        toast.textContent = `"${taskName.toUpperCase()}" berhasil dihapus dari daftar tugas.`;
        toast.classList.add('show-toast');

        setTimeout(() => {
            toast.classList.remove('show-toast');

            location.reload();
        }, 3000);
    });

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function totalTaskInfo() {
    if (location.pathname === '/task-uncomplete.html') {
        const taskUncompleteContainer = document.querySelector('.task-uncomplete-container');
        const childrenElement = taskUncompleteContainer.children;
        const totalLength = childrenElement.length;

        if (totalLength === 0) {
            const infoIcon = document.createElement('span');
            infoIcon.innerHTML = `<i class="fa-solid fa-clipboard-list"></i>`;

            const messageInfo = document.createElement('h1');
            messageInfo.innerText = 'Belum ada tugas apapun disini.';

            const infoWrapper = document.createElement('span');
            infoWrapper.classList.add('info-wrapper');
            infoWrapper.appendChild(infoIcon);
            infoWrapper.appendChild(messageInfo);

            taskUncompleteContainer.appendChild(infoWrapper);
        } else {
            document.querySelector('.total-uncomplete').innerText = totalLength;
        };
    } else {
        if (location.pathname === '/task-complete.html') {
            const taskCompleteContainer = document.querySelector('.task-complete-container');
            const childrenElement = taskCompleteContainer.children;
            const totalLength = childrenElement.length;

            if (totalLength === 0) {
                const infoIcon = document.createElement('span');
                infoIcon.innerHTML = `<i class="fa-solid fa-clipboard-list"></i>`;

                const messageInfo = document.createElement('h1');
                messageInfo.innerText = 'Belum ada tugas apapun disini.';

                const infoWrapper = document.createElement('span');
                infoWrapper.classList.add('info-wrapper');
                infoWrapper.appendChild(infoIcon);
                infoWrapper.appendChild(messageInfo);

                taskCompleteContainer.appendChild(infoWrapper);
            } else {
                document.querySelector('.total-complete').innerText = totalLength;
            };
        };
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if (data !== null) {
        if (location.pathname === '/index.html') {
            const taskUncompletes = data.filter(uncompletes => uncompletes.isComplete === false);
            document.querySelector('.index-task-uncomplete').textContent = taskUncompletes.length;

            const taskCompletes = data.filter(completes => completes.isComplete === true);
            document.querySelector('.index-task-complete').textContent = taskCompletes.length;
        };
    };
});

function findTaskIndex(id) {
    for (const index in tasks) {
        if (tasks[index].id === id) {
            return index;
        };
    };

    return -1;
};

function checkSearchField() {
    searchInputs.forEach(searchInput => {
        const searchErrorMsg = searchInput.nextElementSibling;
        searchErrorMsg.style.display = 'inline';

        if (searchInput.value.trim() == '') {
            searchErrorMsg.textContent = 'Masukkan nama tugas yang ingin dicari!';
            document.querySelector('.form-search').style.paddingBottom = '0.5rem';
        } else {
            if (searchInput.value.trim() !== '') {
                searchErrorMsg.style.display = 'none';
                document.querySelector('.form-search').style.paddingBottom = '1rem';

                searchTask();
            };
        };
    });
};

function searchTask() {
    searchInputs.forEach(isSearchInput => {
        const searchInput = isSearchInput.value.trim();
        const serializedData = localStorage.getItem(STORAGE_KEY);

        if (serializedData) {
            const data = JSON.parse(serializedData);

            let result = false;

            const taskUncompleteContainer = document.querySelector('.task-uncomplete-container');
            if (location.pathname === '/task-uncomplete.html') {
                taskUncompleteContainer.innerHTML = '';
            };

            const taskCompleteContainer = document.querySelector('.task-complete-container');
            if (location.pathname === '/task-complete.html') {
                taskCompleteContainer.innerHTML = '';
            };

            for (const taskItem of data) {
                if (taskItem.isComplete === false && location.pathname === '/task-uncomplete.html') {
                    if (isSearchMatch(taskItem, searchInput)) {
                        const listElement = displayTaskList(taskItem);

                        if (location.pathname === '/task-uncomplete.html') {
                            taskUncompleteContainer.appendChild(listElement);
                        };

                        result = true;
                    };
                } else if (taskItem.isComplete === true && location.pathname === '/task-complete.html') {
                    if (isSearchMatch(taskItem, searchInput)) {
                        const listElement = displayTaskList(taskItem);

                        if (location.pathname === '/task-complete.html') {
                            taskCompleteContainer.appendChild(listElement);
                        };

                        result = true;
                    };
                };
            };

            if (!result) {
                toasts.forEach(toast => {
                    toast.textContent = `"${searchInput.toUpperCase()}" tidak ada didalam daftar tugas`;
                    toast.classList.add('show-toast');

                    setTimeout(() => {
                        toast.classList.remove('show-toast');

                        location.reload();
                    }, 3000);
                });
            };
        };
    });
};

function isSearchMatch(taskItem, searchInput) {
    const isTaskName = taskItem.taskName;
    return isTaskName.includes(searchInput.toLowerCase());
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