// Genera i18n.js (BLOCKS + I18N + SIGHTS) dalla base IT pristina.
// Rieseguibile: legge tools/base-it.html (contenitori in italiano) e traduce.
import { readFileSync, writeFileSync } from 'node:fs';
import { translate, sliceDiv, CAT, UI, SIGHT_META, DESCS } from './dict.mjs';

const BASE = 'C:/Users/Utente/varenna/tools/base-it.html';
const OUT = 'C:/Users/Utente/varenna/i18n.js';
const html = readFileSync(BASE, 'utf8');

// [id elemento, tag di apertura del contenitore | null se testo semplice, testo]
const CONT = [
  ['pl-1', null, 'Fronte · pagina 1'],
  ['pl-2', null, 'Retro · pagina 2'],
  ['b-front', '<div class="frontpage">', null],
  ['b-maptitle', '<div class="maptitle">', null],
  ['b-keys', '<div class="keys">', null],
  ['b-southnote', '<div class="southnote">', null],
  ['b-transport', '<div class="transport">', null],
  ['b-foot', '<div class="foot">', null]
];

const BLOCKS = {};
for (const [id, openTag, text] of CONT) {
  let it = text;
  if (openTag) {
    const r = sliceDiv(html, openTag);
    if (!r) { console.warn('  ⚠ contenitore non trovato:', openTag); continue; }
    it = r.inner;
  }
  BLOCKS[id] = { en: translate(it, 'en'), es: translate(it, 'es') };
}

const I18N = {
  it: { cat: CAT.it, ui: UI.it },
  en: { cat: CAT.en, ui: UI.en },
  es: { cat: CAT.es, ui: UI.es }
};

const SIGHTS = {};
SIGHT_META.forEach((s, i) => {
  SIGHTS[s.id] = { img: s.img, nm: s.nm, ds: { it: DESCS.it[i], en: DESCS.en[i], es: DESCS.es[i] } };
});

const out = `// File generato da tools/gen-i18n.mjs — non modificare a mano.
window.BLOCKS = ${JSON.stringify(BLOCKS)};
window.I18N = ${JSON.stringify(I18N)};
window.SIGHTS = ${JSON.stringify(SIGHTS)};
`;
writeFileSync(OUT, out, 'utf8');
console.log(`i18n.js generato: ${Object.keys(BLOCKS).length} blocchi, ${Object.keys(SIGHTS).length} luoghi, ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB`);
