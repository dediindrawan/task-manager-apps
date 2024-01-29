// all code here will be on strict mode
'use strict';

const tasks = [];
const RENDER_EVENT = 'render-event';
const SAVED_EVENT = 'saved-event';
const STORAGE_KEY = 'Task_Manager_App';

const toasts = document.querySelectorAll('.toast');

const formSearchs = document.querySelectorAll('#form-search');
const searchInputs = document.querySelectorAll('#search-input');

// set value task index updated to -1 for assign there is have no task is updated
let taskIndexUpdated = -1;

// check browser is having a local storage
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

// set id for every task item using timestamp
function generateId() {
    return +new Date();
};

// this is a key object of array "tasks"
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

// event listener for DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // task form
    const taskForm = document.getElementById('task-form');
    if (location.pathname === '/task-form.html') {
        taskForm.addEventListener('submit', (e) => {
            if (!validateForm()) {
                e.preventDefault();
            } else {
                taskForm.submit();
            };
        });
    };

    // form search
    formSearchs.forEach(formSearch => {
        formSearch.addEventListener('submit', (e) => {
            if (!checkSearchField()) {
                e.preventDefault();
            } else {
                searchTask();
                formSearch.submit();
            };
        });
    });

    // data will be loaded from storage if exist
    if (isStorageExist()) {
        loadDataFromStorage();
        totalTaskInfo();
        totalTaskInfoOnMainPage();
    };
});

// validate form
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

// add task is activated
function addTask() {
    const taskNameInput = document.getElementById('task-name').value.trim();
    const taskDescriptionInput = document.getElementById('task-description').value.trim();
    const taskDateStartInput = document.getElementById('task-date-start').value;
    const taskTimeStartInput = document.getElementById('task-time-start').value;
    const taskDateEndInput = document.getElementById('task-date-end').value;
    const taskTimeEndInput = document.getElementById('task-time-end').value;

    // checking whether a new task is being added or an existing task is being updated
    if (taskIndexUpdated === -1) {
        // checking if the newly entered task name already exists in the list
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

        // creating a unique ID and a new task object
        const generatedID = generateId();
        const tasksObject = generateObject(
            generatedID,
            taskNameInput.toLowerCase(),
            taskDescriptionInput,
            taskDateStartInput,
            taskTimeStartInput,
            taskDateEndInput,
            taskTimeEndInput,
            false
        );

        // adding the new task object to the list of tasks
        tasks.push(tasksObject);
    } else {
        taskUpdated(
            // updating an existing task
            taskNameInput.toLowerCase(),
            taskDescriptionInput,
            taskDateStartInput,
            taskTimeStartInput,
            taskDateEndInput,
            taskTimeEndInput
        );
    };

    saveData();

    // triggering an event to re-render the view
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// save data is activated
function saveData() {
    // if storage exists, store task items in local storage using the "Storage Key"
    if (isStorageExist()) {
        // convert the tasks array to a JSON string and store it in local storage
        const parsed = JSON.stringify(tasks);
        localStorage.setItem(STORAGE_KEY, parsed);

        // triggering an event to notify that data has been saved
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

// load data form storage is activated
function loadDataFromStorage() {
    // retrieve serialized data from local storage using the "Storage Key"
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    // if data is not null, add each item from the parsed data to the tasks array
    if (data !== null) {
        for (const index of data) {
            tasks.push(index);
        };
    };

    // triggering an event to initiate a re-render of the view
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// display task list is activated
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

// mark taks item status is complete
function popupConfirmCheck(id, taskName) {
    const confirmCheck = confirm(`Apa kamu yakin ingin menandai status "${taskName.toUpperCase()}" sebagai tugas selesai?`);

    if (confirmCheck) {
        markTaskCompleted(id, taskName);
    } else {
        return;
    };
};

function markTaskCompleted(id, taskName) {
    // function to find a task by its ID in the tasks array
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

// mark taks item status is uncomplete or bring back the task item to task uncomplete page
function popupConfirmUndo(id, taskName) {
    const confirmUndo = confirm(`Apa kamu yakin ingin mengubah status "${taskName.toUpperCase()}" sebagai tugas belum selesai?`);

    if (confirmUndo) {
        markTaskUncompleted(id, taskName);
    } else {
        return;
    };
};

function markTaskUncompleted(id, taskName) {
    // function to find a task by its ID in the tasks array
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

// find task id is activated
function findTaskId(id) {
    for (const taskItem of tasks) {
        if (taskItem.id === id) {
            return taskItem;
        };
    };

    return null;
};

// update confirmation popup
function popupConfirmUpdate(id, taskName, taskDescription, taskDateStart, taskTimeStart, taskDateEnd, taskTimeEnd) {
    const confirmUpdate = confirm(`Apa kamu yakin ingin melakukan perubahan pada nama tugas "${taskName.toUpperCase()}"?`);

    if (confirmUpdate) {
        location.href = '/task-form.html';

        // store task information in local storage for updating
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

// event listener for DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname === '/task-form.html') {
        // retrieve task information from local storage for updating
        const getTaskItemForUpdate = localStorage.getItem('Get_Task_Item_For_Update');

        if (getTaskItemForUpdate) {
            const data = JSON.parse(getTaskItemForUpdate);
            getTaskItemSelected(data);

            // remove the stored task information from local storage
            localStorage.removeItem('Get_Task_Item_For_Update');
        };
    };
});

// get task item selected is activated
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

// task updated is activated
function taskUpdated(taskNameInput, taskDescriptionInput, taskDateStartInput, taskTimeStartInput, taskDateEndInput, taskTimeEndInput) {
    // find the task in the tasks array based on the stored task index updated
    let taskItem = tasks.find(task => task.id === taskIndexUpdated);

    // check if a valid task index is stored not -1
    if (taskIndexUpdated !== -1) {
        // if the task is found in the tasks array
        if (taskItem) {
            taskItem.taskName = taskNameInput;
            taskItem.taskDescription = taskDescriptionInput;
            taskItem.taskDateStart = taskDateStartInput;
            taskItem.taskTimeStart = taskTimeStartInput;
            taskItem.taskDateEnd = taskDateEndInput;
            taskItem.taskTimeEnd = taskTimeEndInput;
        };
    };

    // Reset the taskItem variable to -1 might be intended to clear it
    taskItem = -1;

    saveUpdate();
};

// save update is activated
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

// remove task item is from array
function popupConfirmRemove(id, taskName) {
    const confirmRemove = confirm(`Apa kamu yakin ingin menghapus "${taskName.toUpperCase()}" dari daftar tugas?`);

    if (confirmRemove) {
        taskRemoved(id, taskName);
    } else {
        return;
    };
};

// task remove is activated
function taskRemoved(id, taskName) {
    // find the index of the task item in the tasks array based on this id
    const taskTarget = findTaskIndex(id);

    // if the task item is not found, return without further action
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

    // trigger an event to initiate a re-render of the view
    document.dispatchEvent(new Event(RENDER_EVENT));
};

// find task index is activated
function findTaskIndex(id) {
    for (const index in tasks) {
        if (tasks[index].id === id) {
            return index;
        };
    };

    // if no matching task is found return -1
    return -1;
};

// total task info is activated
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

// total task info on main page is activated
function totalTaskInfoOnMainPage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    if (serializedData) {
        const data = JSON.parse(serializedData);

        if (data !== null && location.pathname === '/index.html') {
            const taskUncompletes = data.filter(task => !task.isComplete);
            document.querySelector('.index-task-uncomplete').textContent = taskUncompletes.length;

            const taskCompletes = data.filter(task => task.isComplete);
            document.querySelector('.index-task-complete').textContent = taskCompletes.length;
        };
    };
};

// check search field is activated
function checkSearchField() {
    searchInputs.forEach(searchInput => {
        const searchErrorMsg = searchInput.nextElementSibling;
        searchErrorMsg.style.display = 'inline';

        if (searchInput.value.trim() == '') {
            searchErrorMsg.textContent = 'Masukkan nama tugas yang ingin dicari!';
            document.querySelector('.form-search').style.paddingBottom = '0.5rem';
        } else {
            searchErrorMsg.style.display = 'none';
            document.querySelector('.form-search').style.paddingBottom = '1rem';

            searchTask();

            return true
        };

        return false;
    });
};

function searchTask() {
    searchInputs.forEach(isSearchInput => {
        const searchInput = isSearchInput.value.trim();
        const serializedData = localStorage.getItem(STORAGE_KEY);

        if (serializedData) {
            let data = JSON.parse(serializedData);

            let result = false;

            const taskUncompleteContainer = document.querySelector('.task-uncomplete-container');
            if (location.pathname === '/task-uncomplete.html') {
                taskUncompleteContainer.innerHTML = '';
            };

            const taskCompleteContainer = document.querySelector('.task-complete-container');
            if (location.pathname === '/task-complete.html') {
                taskCompleteContainer.innerHTML = '';
            };

            const buttonReloads = document.querySelectorAll('.button-reload');
            buttonReloads.forEach(buttonReload => {
                buttonReload.classList.remove('show-button-reload');
            });

            for (const taskItem of data) {
                if (taskItem.isComplete === false && location.pathname === '/task-uncomplete.html') {
                    // iterating function is search match
                    if (isSearchMatch(taskItem, searchInput)) {
                        const listElement = displayTaskList(taskItem);

                        if (location.pathname === '/task-uncomplete.html') {
                            taskUncompleteContainer.append(listElement);

                            buttonReloads.forEach(buttonReload => {
                                buttonReload.classList.add('show-button-reload');
                            });
                        };

                        result = true;
                    };
                } else if (taskItem.isComplete === true && location.pathname === '/task-complete.html') {
                    // iterating function is search match
                    if (isSearchMatch(taskItem, searchInput)) {
                        const listElement = displayTaskList(taskItem);

                        if (location.pathname === '/task-complete.html') {
                            taskCompleteContainer.append(listElement);

                            buttonReloads.forEach(buttonReload => {
                                buttonReload.classList.add('show-button-reload');
                            });
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

// is search match is activated
function isSearchMatch(taskItem, searchInput) {
    const isTaskName = taskItem.taskName;
    return isTaskName.includes(searchInput.toLowerCase());
};

// event listener for RENDER EVENT
document.addEventListener(RENDER_EVENT, () => {
    const taskUncompleteContainer = document.querySelector('.task-uncomplete-container');
    const taskCompleteContainer = document.querySelector('.task-complete-container');

    // sorting tasks based on taskDateStart
    tasks.sort(function (a, b) {
        const dateA = new Date(a.taskDateStart);
        const dateB = new Date(b.taskDateStart);
        return dateA - dateB;
    });

    for (const taskItem of tasks) {
        // displaying the task in a list element using displayTaskList
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