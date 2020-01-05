// Register service worker
function registerServiceWorker() {
  return navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
          console.log('Registrasi service worker berhasil.');
          return registration;
      })
      .catch(function (err) {
          console.error('Registrasi service worker gagal.', err);
      });
}