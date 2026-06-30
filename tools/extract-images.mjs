// Estrae le immagini base64 incorporate in index.html in file separati
// dentro immagini/, e riscrive i src con i percorsi ai file. Rende l'HTML leggero.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'C:/Users/Utente/varenna/index.html';
const IMG_DIR = 'C:/Users/Utente/varenna/immagini';
mkdirSync(IMG_DIR, { recursive: true });

let html = readFileSync(SRC, 'utf8');
const names = ['hero', 'san-giorgio', 'villa-cipressi', 'villa-monastero', 'museo-scanagatta', 'fiumelatte', 'passeggiata-innamorati'];
const re = /data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)/g;

let i = 0, m;
const reps = [];
while ((m = re.exec(html)) !== null) {
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const name = names[i] || ('img' + i);
  const file = `${name}.${ext}`;
  writeFileSync(`${IMG_DIR}/${file}`, Buffer.from(m[2], 'base64'));
  reps.push([m[0], `immagini/${file}`]);
  i++;
}
for (const [from, to] of reps) html = html.split(from).join(to);
writeFileSync(SRC, html, 'utf8');
console.log(`Estratte ${i} immagini; index.html ora ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
