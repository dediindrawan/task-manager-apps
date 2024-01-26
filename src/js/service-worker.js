self.addEventListener('push', event => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
      const data = JSON.parse(serializedData);
  
      let dates = new Date();
      let date = dates.getDate().toString();
      let month = (dates.getMonth() + 1).toString(); // Tambahkan 1 karena Januari dimulai dari 0
      let year = dates.getFullYear().toString();
  
      const dateIndicator = `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`;
  
      let times = new Date();
      let hour = times.getHours().toString().padStart(2, '0');
      let minute = times.getMinutes().toString().padStart(2, '0');
  
      const timeIndicator = `${hour}:${minute}`;
  
      for (const index of data) {
        if (dateIndicator === index.taskDateStart && timeIndicator === index.taskTimeStart) {
          const options = {
            body: `Nama tugas "${index.taskName.toUpperCase()}" menunggu untuk kamu selesaikan sekarang!`,
            icon: '/src/asset/task-manager-web-application-icon.png',
            vibrate: [1000], // Pola getar (ms)
          };
  
          // Tambahkan suara
          const notificationSound = new Audio('/src/asset/audio/sound-notification.wav');
          notificationSound.play();
  
          // Tambahkan event listener onclick ke notifikasi
          options.onclick = function (event) {
            event.preventDefault();
            window.open('https://task-manager-apps.vercell.app/task-uncomplete.html');
          };
  
          event.waitUntil(
            self.registration.showNotification('Cek Dulu, Yuk!', options)
          );
        };
      };
    };
  });
  