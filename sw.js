/* Service worker dello Stradario.
   Tiene una copia dell'app sul dispositivo, così funziona anche senza rete.
   I dati dei residenti NON passano di qui: stanno nel localStorage del browser,
   e se la sincronizzazione è accesa vanno a Firebase per conto loro (richieste
   verso altri domini: qui sotto vengono lasciate passare senza toccarle).
   Dopo aver modificato index.html cambia il numero di versione qui sotto:
   al ricaricamento la vecchia copia viene buttata e sostituita. */
const VERSIONE = "stradario-v11";

const RISORSE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icone/icona.svg",
  "./icone/icona-192.png",
  "./icone/icona-512.png",
  "./icone/icona-maskable-512.png"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(VERSIONE)
      .then(c => c.addAll(RISORSE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(chiavi => Promise.all(chiavi.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", ev => {
  const req = ev.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  // Le pagine: prima la rete (per prendere gli aggiornamenti), poi la copia locale.
  if (req.mode === "navigate") {
    ev.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(VERSIONE).then(c => c.put("./index.html", copia));
          return res;
        })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  // Il resto: prima la copia locale, e intanto si aggiorna in sottofondo.
  ev.respondWith(
    caches.match(req).then(cached => {
      const dallaRete = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copia = res.clone();
          caches.open(VERSIONE).then(c => c.put(req, copia));
        }
        return res;
      }).catch(() => cached);
      return cached || dallaRete;
    })
  );
});
