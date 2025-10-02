// Service Worker para De Brasi Propiedades
const CACHE_VERSION = 'v5.0.0'; // ✅ Nueva versión para despliegue en Vercel
const CACHE_NAME = `debrasi-cache-${CACHE_VERSION}`;

// Assets estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/properties.html',
  '/dashboard.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/propertyService.js',
  '/js/utils/cache.js',
  '/js/utils/errorHandler.js',
  '/js/utils/validators.js',
  '/js/utils/imageOptimizer.js',
  '/js/utils/performance.js',
  '/js/dashboard.js',
  '/js/supabaseClient.js',
  '/images/debrasi-isologo-ok.png',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia de caché
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests que no sean GET
  if (request.method !== 'GET') return;

  // Ignorar requests a Supabase Auth y requests internos
  if (url.hostname.includes('supabase') && !url.pathname.includes('storage')) {
    return event.respondWith(fetch(request));
  }

  // Estrategia: Cache First para assets estáticos
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
  // Estrategia: Network First para HTML y API
  else if (isHTMLRequest(request) || isAPIRequest(url)) {
    event.respondWith(networkFirst(request));
  }
  // Estrategia: Stale While Revalidate para imágenes (incluyendo Supabase Storage)
  else if (isImageRequest(request) || isSupabaseStorageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
  // Default: Network First
  else {
    event.respondWith(networkFirst(request));
  }
});

// Cache First: Intenta caché primero, luego red
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First: Intenta red primero, luego caché
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // Página offline personalizada
    if (isHTMLRequest(request)) {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate: Devuelve caché y actualiza en background
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    const cache = caches.open(CACHE_NAME);
    cache.then(c => c.put(request, response.clone()));
    return response;
  });
  
  return cached || fetchPromise;
}

// Helpers
function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|otf)$/);
}

function isImageRequest(request) {
  return request.destination === 'image';
}

function isHTMLRequest(request) {
  return request.headers.get('accept').includes('text/html');
}

function isSupabaseStorageRequest(url) {
  return url.hostname.includes('supabase') && url.pathname.includes('storage');
}

// Sincronización en background (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-properties') {
    event.waitUntil(syncProperties());
  }
});

async function syncProperties() {
  console.log('[SW] Syncing properties...');
  // Implementar lógica de sincronización
}

// Notificaciones Push (opcional)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva propiedad disponible',
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('De Brasi Propiedades', options)
  );
});
