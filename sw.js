/**
 * Service Worker for ScandiText - Nordisk Verktøysuite
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'scanditext-v2.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline use
const CACHE_FILES = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/components.css',
    '/css/logo.css',
    '/js/app.js',
    '/js/textAnalyzer.js',
    '/js/languageDetector.js',
    '/js/textTransforms.js',
    '/js/textCompare.js',
    '/js/exportUtils.js',
    '/js/i18n.js',
    '/js/ui/modal.js',
    '/js/ui/findReplace.js',
    '/js/tools/socialFormatter.js',
    '/js/tools/passwordGenerator.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache all files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('Service Worker: All files cached');
                // Force immediate activation
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Caching failed:', error);
            })
    );
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients immediately
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker: Activated and controlling all clients');
            // Notify all clients about the update
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'SW_UPDATED' });
                });
            });
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    // Special handling for navigation requests - always try network first for HTML
    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the new response
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match('/index.html')
                        .then(response => response || caches.match(OFFLINE_URL));
                })
        );
        return;
    }
    
    // For CSS, JS and other assets - try network first, fallback to cache
    if (event.request.url.includes('/css/') || event.request.url.includes('/js/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // For all other requests, try cache first, then network
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response before caching
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('Service Worker: Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // Return a basic offline response for other requests
                        return new Response('Offline - Innhold ikke tilgjengelig', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync for saving text
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'save-text') {
        event.waitUntil(
            // Handle background text saving
            saveTextInBackground()
        );
    }
});

// Handle background text saving
async function saveTextInBackground() {
    try {
        // Get text from IndexedDB or localStorage
        const textData = await getSavedTextData();
        
        if (textData && textData.needsSync) {
            // Mark as synced
            textData.needsSync = false;
            textData.lastSynced = Date.now();
            
            // Save back to storage
            await saveTextData(textData);
            
            console.log('Service Worker: Text saved in background');
        }
    } catch (error) {
        console.error('Service Worker: Background save failed:', error);
    }
}

// Helper functions for data management
async function getSavedTextData() {
    return new Promise((resolve) => {
        const data = localStorage.getItem('scanditext-data');
        resolve(data ? JSON.parse(data) : null);
    });
}

async function saveTextData(data) {
    return new Promise((resolve) => {
        localStorage.setItem('scanditext-data', JSON.stringify(data));
        resolve();
    });
}

// Handle push notifications (for future features)
self.addEventListener('push', event => {
    console.log('Service Worker: Push received');
    
    const options = {
        body: 'Din tekst har blitt oppdatert',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-96x96.png',
        tag: 'text-update',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Åpne app',
                icon: '/icons/open-96x96.png'
            },
            {
                action: 'dismiss',
                title: 'Avvis',
                icon: '/icons/dismiss-96x96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('ScandiText - Nordisk Verktøysuite', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    switch (event.action) {
        case 'open':
            event.waitUntil(
                clients.openWindow('/')
            );
            break;
        case 'dismiss':
            // Just close the notification
            break;
        default:
            // Default action - open the app
            event.waitUntil(
                clients.openWindow('/')
            );
            break;
    }
});

// Message handling from the main app
self.addEventListener('message', event => {
    console.log('Service Worker: Message received:', event.data);
    
    switch (event.data.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'CACHE_UPDATE':
            // Force update cache
            caches.delete(CACHE_NAME).then(() => {
                console.log('Service Worker: Cache cleared for update');
            });
            break;
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
    }
});
