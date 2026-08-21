# Stradario

**App online: <https://giroconsegne.github.io/stradario/>**

Piccola web app per tenere l'elenco delle vie con i residenti, numero civico e interno.
Pensata per la preparazione del casellario: si cerca un nome e viene fuori l'indirizzo,
si apre una via e vengono fuori i nominativi raggruppati per civico.

## Come funziona

- **Vie** in ordine alfabetico, con il numero di nominativi.
- **Dentro la via**: residenti raggruppati per civico e ordinati in modo naturale
  (2 → 12 → 12/A), poi per interno.
- **Inserimento rapido**: nome, civico, interno, Invio — il civico resta compilato,
  così si carica un intero palazzo di seguito.
- **Più nomi in un colpo**: una cella per nome, ne compare una nuova mano a mano;
  diventano nominativi separati allo stesso indirizzo.
- **Scheda completa**: note (citofono, cassetta, ecc.).
- **Ricerca** unica su nomi, vie, civici e note, accenti ignorati. Scorciatoia: `/`.
- **Backup**: esportazione e importazione in JSON, esportazione in CSV per Excel.
- **Sincronizzazione** facoltativa fra PC e telefono, da accendere a mano.

## Dove finiscono i dati

**Come esce dalla scatola**: solo nel browser del dispositivo che usi
(`localStorage`). Nessun server, nessun account: i nominativi non escono dal
dispositivo, nemmeno quando l'app è pubblicata online (viene servita la pagina,
non i dati). PC e telefono restano due archivi separati, e se si puliscono i dati
di navigazione l'archivio sparisce — per questo c'è l'esportazione del backup.

**Se accendi la sincronizzazione** (facoltativa, spenta finché non la configuri):
l'archivio viene tenuto allineato fra i dispositivi passando da Firebase, quindi
i nominativi stanno anche sui server di Google. L'app continua a lavorare sulla
copia locale, per cui resta veloce e funziona senza rete; la rete serve solo a
scambiare le novità. Istruzioni e conseguenze in [SINCRONIZZAZIONE.txt](SINCRONIZZAZIONE.txt).

Il backup su file conviene comunque: la copia in rete protegge dal telefono rotto,
non da una cancellazione sbagliata, che si propaga ovunque.

## Uso in locale

Doppio clic su `Avvia Stradario.cmd` (Windows, richiede [Node.js](https://nodejs.org)),
oppure da terminale:

```
node server.js
```

e poi <http://localhost:8080>. Il server serve solo i file di questa cartella e non
espone nulla fuori dalla rete locale.

## Installazione come app

Servita da un indirizzo `https` (o da `localhost`) è una PWA: si installa con l'icona
e funziona senza rete, grazie a `sw.js`.

## File

| File | A cosa serve |
| --- | --- |
| `index.html` | l'app, interfaccia e logica |
| `sw.js` | copia locale dell'app per l'uso offline |
| `manifest.webmanifest` | nome e icone dell'app installata |
| `server.js` | server locale senza dipendenze |
| `SINCRONIZZAZIONE.txt` | come accendere l'archivio condiviso fra dispositivi |
| `Avvia Stradario.cmd` | avvio con doppio clic su Windows |
| `icone/` | icone dell'app |

Dopo ogni modifica a `index.html` conviene alzare il numero di versione in cima a
`sw.js`, altrimenti i dispositivi che l'hanno già installata continuano a usare la
copia vecchia.
