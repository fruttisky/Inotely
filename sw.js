/* iNotely — service worker
   Dzięki niemu iNotely instaluje się jako aplikacja i działa bez internetu.
   WAŻNE: po wrzuceniu nowej wersji index.html zmień VERSION poniżej
   (np. dopisz kolejną cyfrę) - wtedy przeglądarki pobiorą nową wersję. */
const VERSION = 'inotely-2026-09-25-7';
const EXT = 'inotely-ext';
const SHELL = ['./', './index.html', './manifest.webmanifest', './polityka-prywatnosci.html',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
/* zewnętrzne pliki, które warto trzymać na później (czcionki, biblioteki) -
   przeglądarka pobiera je tylko wtedy, gdy użytkownik się na to zgodził */
const CDN = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\//;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('inotely-') && k !== VERSION && k !== EXT).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* strona: najpierw internet (świeża wersja), bez internetu - kopia */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  /* pliki strony (ikony, manifest): z pamięci, a w tle odświeżane */
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  /* czcionki i biblioteki z CDN: z pamięci, jeśli już były */
  if (CDN.test(req.url)) {
    e.respondWith(
      caches.open(EXT).then((c) => c.match(req).then((hit) => {
        const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
  /* reszta (pogoda, YouTube) idzie prosto do internetu */
});
