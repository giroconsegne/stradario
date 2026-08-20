/* Server locale dello Stradario — nessuna dipendenza, serve solo questa cartella.
   Avvio: doppio clic su "Avvia Stradario.cmd" (oppure: node server.js).
   Serve perché come app installabile e offline il file va aperto via http://,
   non con il doppio clic sul file (file://). Niente esce da questo computer. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");

const RADICE = __dirname;
let porta = Number(process.argv[2]) || 8080;

const TIPI = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (rel === "/") rel = "/index.html";

  const file = path.join(RADICE, path.normalize(rel));
  // non si esce dalla cartella dell'app
  if (!file.startsWith(RADICE)) {
    res.writeHead(403).end("Vietato");
    return;
  }
  fs.readFile(file, (err, dati) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Non trovato: " + rel);
      return;
    }
    res.writeHead(200, {
      "Content-Type": TIPI[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache"
    }).end(dati);
  });
});

server.on("error", e => {
  if (e.code === "EADDRINUSE" && porta < 8090) {
    server.listen(++porta, "0.0.0.0");
  } else {
    console.error("Impossibile avviare il server:", e.message);
    process.exit(1);
  }
});

server.listen(porta, "0.0.0.0", () => {
  const locale = `http://localhost:${porta}/`;
  const rete = Object.values(os.networkInterfaces()).flat()
    .filter(i => i && i.family === "IPv4" && !i.internal)
    .map(i => `http://${i.address}:${porta}/`);

  console.log("");
  console.log("  STRADARIO in funzione");
  console.log("  ---------------------");
  console.log("  Su questo computer:  " + locale);
  if (rete.length) {
    console.log("  Da telefono/tablet sulla stessa rete wi-fi:");
    rete.forEach(u => console.log("                       " + u));
    console.log("  (dal telefono si apre e funziona, ma l'icona-app e l'uso");
    console.log("   senza rete richiedono un indirizzo https)");
  }
  console.log("");
  console.log("  I dati restano nel browser di ogni dispositivo: quelli del PC");
  console.log("  e quelli del telefono sono archivi separati. Per travasarli:");
  console.log("  ingranaggio > Esporta backup, poi Importa sull'altro.");
  console.log("");
  console.log("  Per chiudere: premi Ctrl+C oppure chiudi questa finestra.");
  console.log("");
  exec(`start "" "${locale}"`, { shell: "cmd.exe" }, () => {});
});
