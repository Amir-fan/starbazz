// STAR BAZZ Service Worker
const CACHE_NAME = 'starbazz-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Amiri:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  '/images/لفيديو (المصنع).mp4',
  '/images/فتاة تحمل منتج STAR BAZZ.jpg',
  '/images/شهادة الاعتماد Starbazz.jpg',
  '/images/لوغو STAR BAZZ ثلاثي الأبعاد مع أدوات أركيلة.jpg',
  '/images/One%20Nation%20-%20Premium%20Shisha%20Cubes%20%2326er.jpg',
  '/images/One%20Nation%20-%20Premium%20Shisha%20Coal%20%23360er.jpg',
  '/images/One%20Nation%20-%20Premium%20Shisha%20Coal%20%2327er.jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (1).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (2).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (3).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (4).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (5).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (6).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (7).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (8).jpg',
  '/images/صور (Coco Phenix – جميع الألوان والموديلات المختلفة) (9).jpg'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'STAR BAZZ - عروض جديدة متاحة!',
    icon: 'https://via.placeholder.com/192x192/D4AF37/111111?text=SB',
    badge: 'https://via.placeholder.com/72x72/D4AF37/111111?text=SB',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'تصفح المنتجات',
        icon: 'https://via.placeholder.com/96x96/D4AF37/111111?text=P'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: 'https://via.placeholder.com/96x96/D4AF37/111111?text=X'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('STAR BAZZ', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#products')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the main page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
function doBackgroundSync() {
  // Handle offline form submissions
  return new Promise((resolve) => {
    // This would typically involve sending queued data
    console.log('Background sync completed');
    resolve();
  });
}

// Message handling
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 