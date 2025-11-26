// client/public/sw.js - Enhanced Service Worker
const CACHE_NAME = 'blogpro-v2.0.0';
const STATIC_CACHE = 'blogpro-static-v2.0.0';
const DYNAMIC_CACHE = 'blogpro-dynamic-v2.0.0';
const IMAGE_CACHE = 'blogpro-images-v2.0.0';

const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
];

const MAX_CACHE_SIZE = 100;
const MAX_AGE = 86400000; // 24 hours

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache installation failed', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Images - Cache First strategy
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Static assets - Cache First strategy
  if (request.destination === 'script' || request.destination === 'style' || 
      url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // HTML pages - Stale While Revalidate strategy
  if (request.destination === 'document' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }

  // Default - Network First strategy
  event.respondWith(networkFirstStrategy(request));
});

// Caching strategies
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      await limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Check if cache is still fresh
    const cachedDate = new Date(cachedResponse.headers.get('date'));
    const now = new Date();
    
    if (now - cachedDate < MAX_AGE) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        await limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE);
      }
      return networkResponse;
    })
    .catch(() => null);
  
  return cachedResponse || networkResponsePromise;
}

async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncPosts() {
  try {
    // Sync any pending posts when online
    const pendingPosts = await getFromIndexedDB('pendingPosts');
    
    for (const post of pendingPosts) {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      
      if (response.ok) {
        await removeFromIndexedDB('pendingPosts', post.id);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Read Now',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BlogPro', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// IndexedDB helpers
async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BlogProDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BlogProDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
  });
}

