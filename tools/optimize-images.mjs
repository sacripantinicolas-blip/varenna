// Ridimensiona e ricomprime le foto in immagini/ per il web (mobile-first).
// hero più grande (1600px), le altre 1200px; JPEG qualità 80 mozjpeg.
// Legge i byte in memoria (no handle sul file) per poter riscrivere lo stesso percorso.
import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const DIR = 'C:/Users/Utente/varenna/immagini';
let before = 0, after = 0;

for (const f of readdirSync(DIR).filter(f => /\.(jpe?g|png|webp)$/i.test(f))) {
  const p = `${DIR}/${f}`;
  const input = readFileSync(p);
  before += input.length;
  const w = f.startsWith('hero') ? 1600 : 1200;
  const out = await sharp(input).rotate().resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  writeFileSync(p, out);
  after += out.length;
  console.log(`${f.padEnd(28)} ${(input.length / 1024).toFixed(0)} → ${(out.length / 1024).toFixed(0)} KB`);
}
console.log(`Totale: ${(before / 1024 / 1024).toFixed(1)} MB → ${(after / 1024 / 1024).toFixed(1)} MB`);
