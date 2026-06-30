# Specifica — Varenna: mappa interattiva web + cartoline stampabili (IT / EN / ES)

- **Data:** 2026-06-30
- **Stato:** design approvato — in attesa di revisione della specifica
- **File sorgente originale:** `C:\Users\Utente\Downloads\varenna-cartolina-fronte-retro.html10.html`

---

## 1. Obiettivo — DUE percorsi distinti

Dal file cartolina esistente nascono **due cose separate**:

**Percorso A — Pagina web interattiva** (nuova)
- Una pagina unica, responsive (mobile-first), con **selettore lingua IT / EN / ES**.
- **Mappa interattiva**: i 6 luoghi "Da visitare" → clic sul pin → mini-foto → clic → foto grande + descrizione.
- Pubblicata **gratis** su GitHub Pages, accessibile via **QR code**.

**Percorso B — File per la stampa** (traduzione del file esistente)
- Copie **statiche** della cartolina fronte-retro originale, **tradotte** in inglese e spagnolo, nello stesso formato A4.
- La mappa resta **NON interattiva** (è materiale da stampa): nessun popup né lightbox.
- File **autonomi** (immagini incorporate), pronti da aprire e stampare / salvare in PDF, anche da consegnare a una tipografia.

> Le **traduzioni** (testi luoghi, categorie, trasporti, legenda) sono **condivise** tra i due percorsi: si scrivono una volta e si riusano.

## 2. Vincoli

- **Costo zero**: hosting gratuito, QR gratuito, nessuna foto a pagamento.
- **Mobile-first**: la priorità è l'uso da telefono (accesso via QR).
- **Riuso**: mantenere il design e i contenuti già presenti nel file originale.

## 3. Struttura dei file (deliverable)

```
varenna/
├─ index.html              ← PERCORSO A: pagina web interattiva (root → GitHub Pages)
├─ immagini/               ← 7 foto estratte e ottimizzate (per il web)
│   ├─ hero.jpg  san-giorgio.jpg  villa-cipressi.jpg  villa-monastero.jpg
│   └─ museo-scanagatta.jpg  fiumelatte.jpg  passeggiata-innamorati.jpg
├─ stampa/                 ← PERCORSO B: file statici per la stampa (immagini incorporate)
│   ├─ varenna-en.html
│   └─ varenna-es.html
├─ qr-varenna.png / .svg   ← QR verso l'URL pubblico (Percorso A)
├─ tools/                  ← script build-time (estrazione immagini, QR)
├─ SPEC.md  PLAN.md  README.md
```

> Il file italiano originale resta quello che mi hai mandato; se vuoi lo copio anche in `stampa/varenna-it.html` per completezza.

## 4. Architettura

- **Percorso B (stampa):** copie del file originale con i **soli testi tradotti**; nessuna modifica al comportamento — mappa statica, immagini incorporate, `@media print` A4 invariato. Una versione per lingua (EN, ES).
- **Percorso A (web):** dalla stessa base si ricava la versione web — immagini estratte, selettore lingua, interattività (popup + lightbox), responsive, hosting.
- **Base:** il file HTML attuale (Leaflet 1.9.4 via CDN, tiles OpenStreetMap in tono seppia).
- **Approccio approvato (A):** estrarre le immagini base64 (ora incorporate in una riga da ~3 MB) in file separati e ottimizzati → l'HTML diventa leggero (~50 KB) e le foto grandi si caricano **solo quando l'utente clicca** un luogo.
- **Internazionalizzazione (i18n):** un oggetto JavaScript `I18N = { it:{…}, en:{…}, es:{…} }`. I bottoni lingua scambiano i testi tramite attributi `data-i18n`, **senza ricaricare** la pagina. La scelta viene ricordata (`localStorage`). Lingua iniziale = lingua del browser se IT/EN/ES, altrimenti EN.
- **Interazione mappa:**
  - **6 luoghi "Da visitare"**: marker → popup con thumbnail + nome + "tocca per ingrandire" → tap → **lightbox a tutto schermo** (foto grande + nome + descrizione + chiudi). Chiusura con X, tap fuori, tasto Esc.
  - **Altri ~39 punti**: popup con nome + telefono (link `tel:` cliccabile per chiamare da mobile).
- **Stampa:** bottone "Stampa/Print" → `window.print()`. Il CSS `@media print` già esistente produce la cartolina A4 fronte-retro **nella lingua attiva**.

## 5. Contenuti da tradurre — ⚠️ DA REVISIONARE

### 5.1 I 6 luoghi "Da visitare"

| # | Nome (IT) | Descrizione IT | Descrizione EN | Descrizione ES |
|---|-----------|----------------|----------------|----------------|
| 1 | Chiesa di San Giorgio | Chiesa romanica del Trecento, sulla piazza del borgo. | 14th-century Romanesque church on the village square. | Iglesia románica del siglo XIV, en la plaza del pueblo. |
| 2 | Giardini di Villa Cipressi | Giardini botanici terrazzati affacciati sul lago. | Terraced botanical gardens overlooking the lake. | Jardines botánicos en terrazas con vistas al lago. |
| 3 | Villa Monastero | Villa-museo con giardino botanico lungo la riva. | Villa-museum with a botanical garden along the shore. | Villa-museo con jardín botánico a lo largo de la orilla. |
| 4 | Museo Ornitologico Scanagatta | Storica collezione di uccelli del lago, in centro. | Historic collection of local lake birds, in the centre. | Histórica colección de aves del lago, en el centro. |
| 5 | Fiumelatte | Il fiume più corto d'Italia, dalle acque bianche. | Italy's shortest river, with milky-white waters. | El río más corto de Italia, de aguas blancas. |
| 6 | Passeggiata degli Innamorati | Camminamento romantico sospeso sull'acqua. | Romantic lakeside walkway suspended over the water. | Romántico paseo suspendido sobre el agua. |

### 5.2 Titoli delle categorie

| IT | EN | ES |
|----|----|----|
| Ristoranti | Restaurants | Restaurantes |
| Hotel · B&B · Agriturismi | Hotels · B&B · Farm stays | Hoteles · B&B · Agroturismos |
| Bar & Gelaterie | Bars & Ice-cream | Bares y heladerías |
| Negozi | Shops | Tiendas |
| Attività | Activities | Actividades |
| Servizi | Services | Servicios |
| Da visitare | To visit | Para visitar |

### 5.3 Stringhe interfaccia

| Chiave | IT | EN | ES |
|--------|----|----|----|
| sottotitolo | Lago di Como | Lake Como | Lago de Como |
| suggerimento | Tocca un punto della mappa | Tap a point on the map | Toca un punto del mapa |
| ingrandisci | tocca per ingrandire | tap to enlarge | toca para ampliar |
| chiama | Chiama | Call | Llamar |
| stampa | Stampa | Print | Imprimir |
| trasporti | Trasporti | Getting around | Cómo moverse |

> La sezione Trasporti (treno / battello / bus / a piedi) e la legenda contengono altro testo: verranno tradotte integralmente in fase di implementazione e segnalate per revisione.

## 6. Mobile

- `viewport` già presente. Layout responsive.
- Pin e bottoni con area di tocco ≥ ~40px.
- Lightbox a tutto schermo. Mappa con altezza adattata allo schermo.
- Trasporti e legenda passano a colonna singola sotto una certa larghezza (già previsto nel CSS esistente).

## 7. Hosting + QR

- **GitHub Pages**: repo `varenna` → Settings → Pages → branch `main` / root → URL pubblico tipo `https://<utente>.github.io/varenna/`.
- **QR code** generato verso quell'URL: PNG ad alta risoluzione (per la stampa) + SVG.

## 8. Estrazione immagini

- Script (Node) per estrarre i `data:image` dal file originale, salvarli in `immagini/`, ridimensionare/comprimere (larghezza max ~1600px, qualità ~80, JPEG; eventualmente WebP).

## 9. Fuori ambito (per ora)

- Foto per i punti non turistici (ristoranti / hotel / bar).
- Backend, analytics, mappe offline, dominio personalizzato.

## 10. Criteri di accettazione

- [ ] La pagina si apre su telefono velocemente (HTML leggero, foto on-demand).
- [ ] Il cambio lingua IT / EN / ES aggiorna **tutti** i testi.
- [ ] I 6 pin "Da visitare": clic → foto → clic → ingrandita + descrizione nella lingua attiva.
- [ ] Punti non turistici: clic → nome + telefono cliccabile.
- [ ] Bottone "Stampa": produce la cartolina fronte-retro A4 in EN e in ES.
- [ ] Pubblicata su GitHub Pages, QR funzionante.
