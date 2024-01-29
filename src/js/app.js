// popup of informasi aplikasi on file index.html
const appsInfo = document.querySelector('.apps-info');

function closeAppsInfo() {
    appsInfo.classList.add('close-apps-info');
};

function popupAppsInfo() {
    const buttonNeverShowAppsInfo = document.querySelector('.button-never-show-apps-info');
    const neverShowInfo = localStorage.getItem('Never_Show_Apps_Info');

    if (location.pathname === '/index.html') {
        if (neverShowInfo) {
            appsInfo.classList.add('close-apps-info');
        };

        // saved changes to local storage
        buttonNeverShowAppsInfo.addEventListener('click', () => {
            appsInfo.classList.add('close-apps-info');
            localStorage.setItem('Never_Show_Apps_Info', 'true');
        });
    };
};
popupAppsInfo();

// sticky navbar is activated on task-uncomplete.html and task-complete.html
function stickyNavbar() {
    const buttonNavbars = document.querySelectorAll('.button-navbar');
    buttonNavbars.forEach(buttonNavbar => {
        buttonNavbar.addEventListener('click', () => {
            const stickyNavbars = document.querySelectorAll('.sticky-navbar');
            stickyNavbars.forEach(stickyNavbar => {
                stickyNavbar.classList.toggle('show-navbar');

                if (stickyNavbar.classList.contains('show-navbar')) {
                    buttonNavbar.innerHTML = `<i class="fa-solid fa-angles-left"></i>`;
                } else {
                    buttonNavbar.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
                };
            });
        });
    });
};
stickyNavbar();

// display date information on task-uncomplete.html and task-complete.html 
function displayDate() {
    const daily = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    let times = new Date(), days, months, dates, years;
    days = daily[times.getDay()];
    months = monthly[times.getMonth()];
    dates = times.getDate();
    years = times.getFullYear();

    const thisDate = document.querySelectorAll('.date');
    thisDate.forEach(date => {
        date.textContent = `${days}, ${dates} ${months} ${years}`;
    });

    const copyrights = document.querySelectorAll('.copyright');
    copyrights.forEach(copyright => {
        copyright.textContent = `${years}`;
    });
};
displayDate();

// display time information on task-uncomplete.html and task-complete.html 
function displayTimer() {
    let date = new Date(), hours, minutes, seconds;
    hours = set(date.getHours());
    minutes = set(date.getMinutes());
    seconds = set(date.getSeconds());

    const times = document.querySelectorAll('.time');
    times.forEach(time => {
        time.textContent = `${hours}:${minutes}:${seconds}`;
    });

    setTimeout('displayTimer()', 1000);
};
displayTimer();

function set(timer) {
    // added string "0" if hours, minutes, or seconds less than 10 
    timer = timer < 10 ? '0' + timer : timer;
    return timer;
};