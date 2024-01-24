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
    timer = timer < 10 ? '0' + timer : timer;
    return timer;
};