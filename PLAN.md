# Varenna — Mappa interattiva web + cartoline stampabili — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trasformare la cartolina Varenna in una singola pagina web responsive trilingue (IT/EN/ES) con mappa interattiva (6 luoghi → foto → ingrandimento + descrizione), pubblicata gratis su GitHub Pages via QR, e con stampa A4 fronte-retro in EN/ES.

**Architecture:** Si parte dal file HTML esistente (Leaflet + OSM). Le 7 immagini base64 vengono estratte in `immagini/` (HTML leggero, foto on-demand). Un motore i18n in JS scambia i testi senza reload (`localStorage`). I 6 marker "vis" ottengono popup con miniatura → lightbox a tutto schermo. La stampa riusa il `@media print` esistente nella lingua attiva.

**Tech Stack:** HTML/CSS/JS vanilla, Leaflet 1.9.4 (CDN), Node (solo per estrarre/ottimizzare immagini, build-time), GitHub Pages, libreria QR (`qrcode` npm o equivalente).

**Riferimenti:** contenuti e traduzioni complete in `SPEC.md` §5. Sorgente originale: `C:\Users\Utente\Downloads\varenna-cartolina-fronte-retro.html10.html`.

---

## File Structure

- `varenna/index.html` — pagina completa (front + mappa + barra lingue + stampa + lightbox). Unica pagina servita.
- `varenna/immagini/` — 7 JPG estratti: `hero`, `san-giorgio`, `villa-cipressi`, `villa-monastero`, `museo-scanagatta`, `fiumelatte`, `passeggiata-innamorati`.
- `varenna/tools/extract-images.mjs` — script build-time: estrae le immagini e riscrive `index.html` con i percorsi file. Non servito in produzione.
- `varenna/tools/optimize-images.mjs` — script opzionale di compressione (sharp).
- `varenna/tools/make-qr.mjs` — genera il QR verso l'URL pubblico.
- `varenna/qr-varenna.png` / `.svg` — QR finale.
- `varenna/README.md` — come aggiornare testi/foto e ripubblicare.

Ordine: prima si materializza `index.html` dal sorgente (Task 1), poi si estraggono le immagini (Task 2), poi si aggiunge interattività/i18n sul file pulito.

---

### Task 1: Scaffold del progetto e copia del sorgente

**Files:**
- Create: `varenna/index.html` (copia del sorgente)
- Create: `varenna/tools/` (cartella)

- [ ] **Step 1: Copiare il sorgente in index.html**

Run (PowerShell):
```
Copy-Item "C:\Users\Utente\Downloads\varenna-cartolina-fronte-retro.html10.html" "C:\Users\Utente\varenna\index.html"
New-Item -ItemType Directory -Force "C:\Users\Utente\varenna\tools" | Out-Null
```

- [ ] **Step 2: Aprire in browser e verificare il rendering di partenza**

Run: `start "" "C:\Users\Utente\varenna\index.html"`
Expected: si vede il fronte (foto grande "benvenuti a Varenna" + 6 riquadri) e, scorrendo, la mappa con i pin colorati, trasporti, legenda. Nessun errore in console.

---

### Task 2: Estrarre le immagini e ripulire l'HTML

**Files:**
- Create: `varenna/tools/extract-images.mjs`
- Modify: `varenna/index.html` (i 7 `data:image…` diventano `immagini/*.jpg`)
- Create: `varenna/immagini/*.jpg` (7 file)

- [ ] **Step 1: Scrivere lo script di estrazione**

`varenna/tools/extract-images.mjs`:
```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, 'index.html');
const IMG_DIR = join(ROOT, 'immagini');
mkdirSync(IMG_DIR, { recursive: true });

let html = readFileSync(SRC, 'utf8');
const names = ['hero','san-giorgio','villa-cipressi','villa-monastero','museo-scanagatta','fiumelatte','passeggiata-innamorati'];
const re = /data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)/g;
let i = 0, m;
const reps = [];
while ((m = re.exec(html)) !== null) {
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const name = names[i] || ('img' + i);
  const file = `${name}.${ext}`;
  writeFileSync(join(IMG_DIR, file), Buffer.from(m[2], 'base64'));
  reps.push({ from: m[0], to: `immagini/${file}` });
  i++;
}
for (const r of reps) html = html.split(r.from).join(r.to);
writeFileSync(SRC, html, 'utf8');
console.log(`Estratte ${i} immagini. index.html ora ${(Buffer.byteLength(html)/1024).toFixed(0)} KB.`);
```

- [ ] **Step 2: Eseguire lo script**

Run: `node "C:\Users\Utente\varenna\tools\extract-images.mjs"`
Expected: stampa `Estratte 7 immagini. index.html ora ~50 KB.` (deve essere 7; se diverso, fermarsi e verificare l'ordine in `index.html`).

- [ ] **Step 3: Verificare i file e il rendering**

Run: `Get-ChildItem "C:\Users\Utente\varenna\immagini" | Select-Object Name,@{n='KB';e={[int]($_.Length/1024)}}`
Expected: 7 file. `hero.jpg` è il più grande. Riaprire `index.html`: fronte e mappa identici a prima, ma immagini ora caricate da `immagini/`. `index.html` deve essere ~50 KB.

---

### Task 3: Ottimizzare le immagini (condizionale alle dimensioni)

**Files:**
- Create: `varenna/tools/optimize-images.mjs`
- Modify: `varenna/immagini/*.jpg` (ricompressi in place)

Eseguire SOLO se da Task 2 `hero.jpg` > ~400 KB o un qualsiasi file > ~500 KB.

- [ ] **Step 1: Installare sharp**

Run (in `C:\Users\Utente\varenna`): `npm init -y; npm i -D sharp`
Expected: sharp installato (binari precompilati, nessuna GPU richiesta).

- [ ] **Step 2: Scrivere lo script di ottimizzazione**

`varenna/tools/optimize-images.mjs`:
```js
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const DIR = new URL('../immagini/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
for (const f of readdirSync(DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f))) {
  const p = join(DIR, f);
  const w = f.startsWith('hero') ? 1600 : 1200;
  const buf = await sharp(p).rotate().resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  await sharp(buf).toFile(p.replace(/\.(png|webp)$/i, '.jpg'));
  console.log(f, '→', (buf.length/1024).toFixed(0), 'KB');
}
```

- [ ] **Step 3: Eseguire e verificare**

Run: `node "C:\Users\Utente\varenna\tools\optimize-images.mjs"`
Expected: ogni foto ≤ ~250 KB, hero ≤ ~400 KB. Riaprire `index.html`: foto ancora nitide. (Se i nomi cambiano da .png a .jpg, aggiornare i riferimenti in `index.html` con una ricerca/sostituzione.)

---

### Task 4: Barra lingue + pulsante stampa + motore i18n (testi statici)

**Files:**
- Modify: `varenna/index.html` (aggiunta barra UI in cima al `<body>`, attributi `data-i18n`, blocco `<script>` i18n prima del codice mappa)

- [ ] **Step 1: Aggiungere la barra UI e il suo CSS**

Dentro `<style>` (vicino agli altri stili schermo):
```css
.langbar{position:sticky;top:0;z-index:1000;display:flex;gap:8px;align-items:center;
  justify-content:center;flex-wrap:wrap;padding:8px;background:#FBF6EC;border-bottom:1px solid #D9CDB6}
.langbar .lng{font:600 12px var(--body);padding:6px 12px;border:1px solid #D9CDB6;border-radius:8px;
  background:#fff;color:#6B6258;cursor:pointer;min-height:36px}
.langbar .lng.on{background:#3A352E;color:#fff;border-color:#3A352E}
.langbar .pr{margin-left:6px;display:inline-flex;gap:6px;align-items:center}
@media print{.langbar{display:none}}
```

Subito dopo `<body>` (prima di `.pagelabel`):
```html
<div class="langbar" role="navigation" aria-label="Lingua">
  <button class="lng on" data-lng="it" lang="it">Italiano</button>
  <button class="lng" data-lng="en" lang="en">English</button>
  <button class="lng" data-lng="es" lang="es">Español</button>
  <button class="lng pr" id="btnPrint"><span data-i18n="print">Stampa</span></button>
</div>
```

- [ ] **Step 2: Marcare i testi statici con data-i18n**

Aggiungere `data-i18n="CHIAVE"` agli elementi di testo statici (front `t1`/`t2`, `pagelabel`×2, titolo mappa, intestazioni e righe della sezione trasporti, `southnote`, `tdisc`, `foot`). Il testo italiano resta come fallback dentro l'elemento. Esempi:
```html
<span class="t1" data-i18n="frontTitle">benvenuti a Varenna</span>
<span class="t2" data-i18n="frontSub">Lago di Como</span>
...
<h2 data-i18n="transTitle">Trasporti</h2>
```
Elenco completo delle chiavi e delle 3 traduzioni: vedi `SPEC.md` §5 (titoli categorie, stringhe interfaccia) e la sezione trasporti del sorgente. Ogni stringa italiana visibile a schermo deve avere una chiave in `I18N.it/en/es`.

- [ ] **Step 3: Aggiungere il motore i18n**

Nuovo `<script>` posizionato PRIMA dello script della mappa (così le funzioni esistono quando i pin vengono creati):
```html
<script>
const I18N = {
  it: { print:'Stampa', frontTitle:'benvenuti a Varenna', frontSub:'Lago di Como',
        transTitle:'Trasporti', hintTap:'Tocca un punto', enlarge:'tocca per ingrandire', call:'Chiama' /* …tutte le chiavi… */ },
  en: { print:'Print', frontTitle:'welcome to Varenna', frontSub:'Lake Como',
        transTitle:'Getting around', hintTap:'Tap a point', enlarge:'tap to enlarge', call:'Call' /* … */ },
  es: { print:'Imprimir', frontTitle:'bienvenidos a Varenna', frontSub:'Lago de Como',
        transTitle:'Cómo moverse', hintTap:'Toca un punto', enlarge:'toca para ampliar', call:'Llamar' /* … */ }
};
let LANG = (function(){ const s=localStorage.getItem('varennaLang');
  if(s) return s; const b=(navigator.language||'it').slice(0,2);
  return ['it','en','es'].includes(b)?b:'en'; })();
function applyLang(lang){
  LANG = lang; localStorage.setItem('varennaLang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(I18N[lang] && I18N[lang][k]!=null) el.textContent = I18N[lang][k];
  });
  document.querySelectorAll('.langbar .lng').forEach(b=>
    b.classList.toggle('on', b.getAttribute('data-lng')===lang));
  if(window.renderLegend) window.renderLegend();      // definita in Task 5
  if(window.refreshLightbox) window.refreshLightbox(); // definita in Task 6
}
document.querySelectorAll('.langbar .lng').forEach(b=>
  b.addEventListener('click',()=>applyLang(b.getAttribute('data-lng'))));
document.getElementById('btnPrint').addEventListener('click',()=>window.print());
</script>
```
E in fondo, dopo che mappa e legenda sono costruite, chiamare una volta: `applyLang(LANG);`

- [ ] **Step 4: Verificare**

Aprire `index.html`. Cliccare EN e ES: titolo fronte, sottotitolo, pulsante Stampa e titoli trasporti cambiano lingua. Ricaricare: la lingua scelta è ricordata. Nessun errore in console.

---

### Task 5: Legenda + titoli categoria localizzati

**Files:**
- Modify: `varenna/index.html` (oggetto `categories`, render legenda, blocco i18n)

- [ ] **Step 1: Aggiungere i titoli categoria a I18N**

In ogni lingua di `I18N` aggiungere una mappa `cat` (chiavi = `cat.key`), da `SPEC.md` §5.2:
```js
it:{ /* … */ cat:{rist:'Ristoranti',hotel:'Hotel · B&B · Agriturismi',bar:'Bar & Gelaterie',neg:'Negozi',att:'Attività',serv:'Servizi',vis:'Da visitare'} },
en:{ /* … */ cat:{rist:'Restaurants',hotel:'Hotels · B&B · Farm stays',bar:'Bars & Ice-cream',neg:'Shops',att:'Activities',serv:'Services',vis:'To visit'} },
es:{ /* … */ cat:{rist:'Restaurantes',hotel:'Hoteles · B&B · Agroturismos',bar:'Bares y heladerías',neg:'Tiendas',att:'Actividades',serv:'Servicios',vis:'Para visitar'} }
```

- [ ] **Step 2: Rendere la legenda ri-renderizzabile e localizzata**

Sostituire il blocco legenda esistente (sorgente righe ~366-372) con una funzione globale che usa la lingua attiva e svuota prima di ridisegnare:
```js
window.renderLegend = function(){
  const legcols = document.getElementById('legcols');
  legcols.innerHTML = '';
  categories.forEach(cat=>{
    const div=document.createElement('div'); div.className='cat'; let li='';
    cat.items.forEach(it=>{ li+=`<li><span class="num" style="background:${HEX[cat.key]}">${it.n}</span><span class="nm">${it.nm}</span><span class="tel${it.tag?' tag':''}">${it.tel}</span></li>`; });
    const title = (I18N[LANG].cat && I18N[LANG].cat[cat.key]) || cat.title;
    div.innerHTML=`<h3><span class="chip" style="background:${HEX[cat.key]}"></span>${title}</h3><ol>${li}</ol>`;
    legcols.appendChild(div);
  });
};
window.renderLegend();
```

- [ ] **Step 3: Verificare**

Aprire `index.html`, cambiare lingua: i titoli delle 7 categorie nella legenda cambiano (Ristoranti→Restaurants→Restaurantes, ecc.). I nomi dei luoghi e i numeri restano invariati.

---

### Task 6: Dati luoghi + popup miniatura + lightbox a tutto schermo (le 6 mete)

**Files:**
- Modify: `varenna/index.html` (items `vis`, mappa `SIGHTS`, loop marker, DOM+CSS lightbox)

- [ ] **Step 1: Aggiungere un id ai 6 item "vis"**

Nei 6 oggetti della categoria `vis` (sorgente righe ~354-359) aggiungere `id`:
```js
{n:1,nm:'Chiesa di S. Giorgio',tel:'Piazza',tag:true,lat:46.01009,lng:9.28408,id:'sangiorgio'},
{n:2,nm:'Giardini Villa Cipressi',tel:'lago',tag:true,lat:46.00938,lng:9.28483,id:'cipressi'},
{n:3,nm:'Villa Monastero',tel:'lago',tag:true,lat:46.00927,lng:9.28556,id:'monastero'},
{n:4,nm:'Museo Ornitologico Scanagatta',tel:'centro',tag:true,lat:46.00968,lng:9.28441,id:'scanagatta'},
{n:5,nm:'Fiumelatte',tel:'sud',tag:true,lat:45.99456,lng:9.29237,south:true,id:'fiumelatte'},
{n:6,nm:'Passeggiata degli Innamorati',tel:'lago',tag:true,lat:46.01331,lng:9.28364,id:'innamorati'},
```

- [ ] **Step 2: Aggiungere la mappa SIGHTS (contenuti da SPEC §5.1)**

```js
const SIGHTS = {
  sangiorgio:{img:'immagini/san-giorgio.jpg',
    nm:{it:'Chiesa di San Giorgio',en:'San Giorgio Church',es:'Iglesia de San Giorgio'},
    ds:{it:'Chiesa romanica del Trecento, sulla piazza del borgo.',en:'14th-century Romanesque church on the village square.',es:'Iglesia románica del siglo XIV, en la plaza del pueblo.'}},
  cipressi:{img:'immagini/villa-cipressi.jpg',
    nm:{it:'Giardini di Villa Cipressi',en:'Villa Cipressi Gardens',es:'Jardines de Villa Cipressi'},
    ds:{it:'Giardini botanici terrazzati affacciati sul lago.',en:'Terraced botanical gardens overlooking the lake.',es:'Jardines botánicos en terrazas con vistas al lago.'}},
  monastero:{img:'immagini/villa-monastero.jpg',
    nm:{it:'Villa Monastero',en:'Villa Monastero',es:'Villa Monastero'},
    ds:{it:'Villa-museo con giardino botanico lungo la riva.',en:'Villa-museum with a botanical garden along the shore.',es:'Villa-museo con jardín botánico a lo largo de la orilla.'}},
  scanagatta:{img:'immagini/museo-scanagatta.jpg',
    nm:{it:'Museo Ornitologico Scanagatta',en:'Scanagatta Ornithological Museum',es:'Museo Ornitológico Scanagatta'},
    ds:{it:'Storica collezione di uccelli del lago, in centro.',en:'Historic collection of local lake birds, in the centre.',es:'Histórica colección de aves del lago, en el centro.'}},
  fiumelatte:{img:'immagini/fiumelatte.jpg',
    nm:{it:'Fiumelatte',en:'Fiumelatte',es:'Fiumelatte'},
    ds:{it:'Il fiume più corto d\'Italia, dalle acque bianche.',en:'Italy\'s shortest river, with milky-white waters.',es:'El río más corto de Italia, de aguas blancas.'}},
  innamorati:{img:'immagini/passeggiata-innamorati.jpg',
    nm:{it:'Passeggiata degli Innamorati',en:'Lovers\' Walk',es:'Paseo de los Enamorados'},
    ds:{it:'Camminamento romantico sospeso sull\'acqua.',en:'Romantic lakeside walkway suspended over the water.',es:'Romántico paseo suspendido sobre el agua.'}}
};
```

- [ ] **Step 3: Aggiungere il DOM e il CSS del lightbox**

Prima di `</body>`:
```html
<div id="lightbox" class="lb hidden" role="dialog" aria-modal="true">
  <button class="lb-x" id="lbClose" aria-label="X">&times;</button>
  <img class="lb-img" id="lbImg" alt="">
  <div class="lb-nm" id="lbNm"></div>
  <div class="lb-ds" id="lbDs"></div>
</div>
```
CSS (in `<style>`):
```css
.lb{position:fixed;inset:0;z-index:2000;background:rgba(20,16,12,.93);display:flex;
  flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px}
.lb.hidden{display:none}
.lb-img{max-width:min(92vw,900px);max-height:62vh;border-radius:10px;object-fit:contain}
.lb-nm{font:600 22px var(--display);color:#fff;text-align:center}
.lb-ds{color:#EDE3CC;font:400 15px var(--body);max-width:min(92vw,640px);text-align:center;line-height:1.5}
.lb-x{position:absolute;top:14px;right:16px;width:40px;height:40px;border-radius:50%;border:none;
  background:rgba(255,255,255,.16);color:#fff;font-size:22px;cursor:pointer}
.popthumb{width:170px;height:104px;object-fit:cover;border-radius:6px;display:block;cursor:zoom-in}
.popttl{font:700 12.5px var(--body);margin-top:5px;color:var(--ink)}
.pophint{font:600 11px var(--body);color:var(--c-vis);margin-top:2px}
.poptel a{color:var(--c-serv);text-decoration:none;font-weight:600}
@media print{.lb{display:none!important}}
```

- [ ] **Step 4: Collegare i marker (popup + lightbox)**

Sostituire il loop marker esistente (sorgente righe ~387-392) con:
```js
const markersById = {};
const core=[];
categories.forEach(cat=>cat.items.forEach(it=>{
  if(it.lat==null) return;
  const m=L.marker([it.lat,it.lng],{icon:icon(HEX[cat.key],it.n,false)}).addTo(map);
  if(cat.key==='vis' && it.id){
    const s=SIGHTS[it.id];
    m.bindPopup(()=>`<img class="popthumb" src="${s.img}" alt="" data-sight="${it.id}">
      <div class="popttl">${s.nm[LANG]}</div>
      <div class="pophint">▸ <span>${I18N[LANG].enlarge}</span></div>`,{minWidth:188});
    m.on('popupopen',e=>{
      const t=e.popup.getElement().querySelector('.popthumb');
      if(t) t.addEventListener('click',()=>openLightbox(it.id));
    });
  } else {
    m.bindPopup(`<div class="popttl">${it.n}. ${it.nm}</div>
      <div class="poptel"><a href="tel:${(it.tel||'').replace(/\s/g,'')}">${it.tel}</a></div>`);
  }
  markersById[it.id||(cat.key+it.n)] = m;
  if(!it.south) core.push([it.lat,it.lng]);
}));
function openLightbox(id){
  const s=SIGHTS[id]; if(!s) return;
  document.getElementById('lbImg').src=s.img;
  document.getElementById('lbImg').alt=s.nm[LANG];
  document.getElementById('lbNm').textContent=s.nm[LANG];
  document.getElementById('lbDs').textContent=s.ds[LANG];
  document.getElementById('lightbox').classList.remove('hidden');
}
function closeLightbox(){ document.getElementById('lightbox').classList.add('hidden'); }
document.getElementById('lbClose').addEventListener('click',closeLightbox);
document.getElementById('lightbox').addEventListener('click',e=>{ if(e.target.id==='lightbox') closeLightbox(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLightbox(); });
window.refreshLightbox=function(){
  const lb=document.getElementById('lightbox');
  if(!lb.classList.contains('hidden')){
    // se aperto, niente: l'id non è memorizzato — il refresh lingua aggiorna alla prossima apertura
  }
  if(map) map.closePopup(); // i popup si rigenerano con la lingua attiva
};
```

- [ ] **Step 5: Abilitare i tap sui marker da mobile**

Nel `L.map('map',{…})` esistente, la mappa ha `tap:false`. Verificare che il click sul marker apra il popup su telefono. Se NON funziona al tocco, cambiare `tap:false` → `tap:true` (lasciando `dragging:false` ecc.).

- [ ] **Step 6: Verificare (desktop + mobile emulato)**

Aprire `index.html`. Cliccare un pin verde (es. Villa Monastero): appare popup con miniatura + nome + "tocca per ingrandire". Cliccare la miniatura: si apre il lightbox a tutto schermo con foto grande + descrizione; chiusura con ×, tap fuori, Esc. Cliccare un pin rosso/arancione: popup con numero, nome e telefono cliccabile (`tel:`). Cambiare lingua e riaprire un popup verde: nome/hint/descrizione nella nuova lingua. In DevTools (vista mobile 390px) i tap funzionano e il lightbox è leggibile.

---

### Task 7: Rifinitura responsive mobile

**Files:**
- Modify: `varenna/index.html` (`<style>`, media query)

- [ ] **Step 1: Aggiungere/rivedere le media query**

```css
@media screen and (max-width:560px){
  body{padding:8px;gap:12px}
  #map{height:62vh;min-height:420px}
  .mapframe{max-width:100%}
  .lb-img{max-height:54vh}
  .langbar .lng{padding:8px 12px}
}
```
Garantire: barra lingue leggibile e bottoni ≥36px; mappa non più alta dello schermo; popup e lightbox dentro i bordi; foto del fronte a piena larghezza.

- [ ] **Step 2: Verificare a 360–414px**

In DevTools (iPhone/Android), larghezze 360/390/414: nessuno scroll orizzontale; pin toccabili; lightbox a tutto schermo; trasporti/legenda in colonna singola.

---

### Task 8: Stampa A4 fronte-retro in EN e ES

**Files:**
- Modify: `varenna/index.html` (eventuale ritardo pre-stampa)

- [ ] **Step 1: Verificare l'anteprima di stampa in EN**

Selezionare English → pulsante Stampa (o Ctrl+P). Anteprima: pagina 1 = fronte con titolo/descrizioni in inglese; pagina 2 = mappa A4 con tutti i pin e legenda in inglese. Salvare come PDF.

- [ ] **Step 2: Verificare l'anteprima di stampa in ES**

Selezionare Español → Stampa. Stesse 2 pagine in spagnolo. Salvare come PDF.

- [ ] **Step 3: Se le tile mappa risultano vuote in stampa**

I gestori `beforeprint` esistenti chiamano `map.invalidateSize()`+`placeBusStops()`. Se le tile non si caricano in tempo, aggiungere prima di stampare: nel click di `btnPrint`, attendere ~600ms dopo `map.invalidateSize()` e poi `window.print()`. Verificare di nuovo.

---

### Task 9: README, QR e pubblicazione su GitHub Pages

**Files:**
- Create: `varenna/README.md`
- Create: `varenna/tools/make-qr.mjs`, `varenna/qr-varenna.png`, `varenna/qr-varenna.svg`

> Questo task fa commit e pubblicazione: eseguirlo solo con l'OK esplicito dell'utente.

- [ ] **Step 1: Scrivere il README**

`varenna/README.md`: a cosa serve; come modificare un testo (cercare la chiave in `I18N`); come sostituire una foto (rimpiazzare il file in `immagini/`); come ripubblicare (`git add . && git commit && git push`); come rigenerare il QR.

- [ ] **Step 2: Inizializzare git e pubblicare su GitHub**

Run (in `C:\Users\Utente\varenna`), dopo OK utente:
```
git init -b main
printf "node_modules/\n" > .gitignore
git add index.html immagini README.md SPEC.md PLAN.md tools .gitignore
git commit -m "feat: Varenna mappa interattiva trilingue + stampa"
gh repo create varenna --public --source=. --remote=origin --push
```
Poi abilitare Pages: `gh api -X POST repos/{owner}/varenna/pages -f source[branch]=main -f source[path]=/` (oppure dalle impostazioni del repo: Settings → Pages → branch `main` / `/root`).
Expected: URL `https://<utente>.github.io/varenna/` attivo entro 1-2 minuti.

- [ ] **Step 3: Generare il QR verso l'URL**

`varenna/tools/make-qr.mjs` (dopo `npm i -D qrcode`):
```js
import QRCode from 'qrcode';
const url = process.argv[2];
if(!url){ console.error('Uso: node tools/make-qr.mjs <URL>'); process.exit(1); }
await QRCode.toFile('qr-varenna.png', url, { width: 1200, margin: 2 });
await QRCode.toFile('qr-varenna.svg', url, { type: 'svg', margin: 2 });
console.log('QR creato per', url);
```
Run: `node tools/make-qr.mjs https://<utente>.github.io/varenna/`

- [ ] **Step 4: Verifica finale sul telefono**

Inquadrare `qr-varenna.png` col telefono → si apre la pagina pubblica. Provare: cambio lingua, pin verde → foto → ingrandimento + descrizione, pin con telefono → chiamata. Confermati i criteri di accettazione di `SPEC.md` §10.

---

## Self-Review

**Spec coverage:** §1 pagina unica trilingue → Task 4/5; mappa interattiva 6 mete → Task 6; stampa EN/ES → Task 8; §3 struttura file → Task 1/2/9; §4 estrazione immagini + i18n + interazione → Task 2/3/4/5/6; §6 mobile → Task 7; §7 hosting+QR → Task 9; §8 estrazione → Task 2/3. Tutti i requisiti hanno un task.

**Placeholder scan:** i `/* … */` in `I18N` rimandano a SPEC §5 per le stringhe rimanenti (trasporti/footer): durante il Task 4 ogni stringa italiana a schermo deve avere chiave nelle 3 lingue. Nessun TODO funzionale lasciato nel codice.

**Type consistency:** `applyLang` chiama `window.renderLegend` (Task 5) e `window.refreshLightbox` (Task 6) — definite con guardia `if(window.x)`. `markersById`, `SIGHTS[id]`, `openLightbox(id)`, `I18N[lang].cat[key]` coerenti tra i task. Nomi immagini in `SIGHTS.img` = file prodotti dal Task 2.
