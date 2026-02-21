const CACHE_NAME = 'seminka-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./index.html'));
});

// Scheduled notification check
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_CHECK') {
    checkAndNotify(e.data.reminders);
  }
});

function checkAndNotify(reminders) {
  if (!reminders) return;
  const now = new Date();
  reminders.forEach(r => {
    const due = new Date(r.date);
    const diff = due - now;
    if (diff > 0 && diff < 86400000) {
      self.registration.showNotification('🌱 ' + r.plant, {
        body: r.action + ' – dnes nebo zítra!',
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: r.id,
        vibrate: [200, 100, 200]
      });
    }
  });
}
