importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },  
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/match_info.html', revision: '1' },
    { url: '/team_info.html', revision: '1' },
    { url: '/pages/home.html', revision: '1' },
    { url: '/pages/team.html', revision: '1' },
    { url: '/pages/saved.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/sw-reg.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/push-mgr.js', revision: '1' },
    { url: '/images/icon-512.png', revision: '1' },
    { url: '/images/icon-192.png', revision: '1' },
    { url: '/images/custom-icon-192.png', revision: '1' },
], {
  // Ignore all URL parameters
  ignoreURLParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp('/team_info.html'),
  workbox.strategies.staleWhileRevalidate({
  })
);

workbox.routing.registerRoute(
  new RegExp('/match_info.html'),
  workbox.strategies.staleWhileRevalidate({
  })
);

// Menyimpan cache gambar
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  }),
);

// Menyimpan cache dari CSS Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);
  
// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Menyimpan cache dari football-data.org
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

//Push notification
self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'images/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});