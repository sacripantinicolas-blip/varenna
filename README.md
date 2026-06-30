# Varenna · mappa interattiva + cartoline stampabili

Mappa di Varenna (Lago di Como) in **3 lingue** (IT/EN/ES), con mappa interattiva,
foto dei luoghi e versioni stampabili. Tutto gratuito (GitHub Pages + GoatCounter).

## Link

- 🌐 **Sito live:** https://sacripantinicolas-blip.github.io/varenna/
- 📲 **QR code:** `qr-varenna.png` (stampa) · `qr-varenna.svg` (vettoriale) → puntano al sito con `?src=qr`
- 📊 **Statistiche visite:** https://sacripantinicolas.goatcounter.com (login col tuo account GoatCounter)
- 🖨️ **File di stampa:** `stampa/varenna-en.html` (inglese) · `stampa/varenna-es.html` (spagnolo)

## Struttura

```
index.html        Pagina web interattiva (italiano come base). Servita da GitHub Pages.
i18n.js           Traduzioni EN/ES (generato — non modificare a mano).
immagini/         7 foto ottimizzate per il web.
stampa/           File statici tradotti per la stampa (foto incorporate).
qr-varenna.*      QR code.
tools/            Script di build (Node). Vedi sotto.
SPEC.md PLAN.md   Documentazione di progetto.
```

## Come aggiornare

> Serve [Node.js](https://nodejs.org). Dopo ogni modifica: `git add -A && git commit -m "..." && git push` → il sito si aggiorna da solo in ~1 minuto.

**Cambiare un testo italiano:** modifica `index.html` (e l'identica voce in `tools/base-it.html`).
Se il testo ha una traduzione, aggiorna anche `tools/dict.mjs`, poi rigenera:
```
node tools/gen-i18n.mjs
```

**Cambiare una traduzione EN/ES:** modifica `tools/dict.mjs`, poi `node tools/gen-i18n.mjs`.

**Sostituire una foto:** rimpiazza il file in `immagini/` (stesso nome), poi
`node tools/optimize-images.mjs` per ricomprimerla.

**Rigenerare i file di stampa:** `node tools/make-print.mjs`

**Rigenerare il QR** (se cambia l'URL): `node tools/make-qr.mjs "https://nuovo-url/?src=qr"`

**Anteprima locale:** `node tools/serve.mjs` → http://localhost:5555

## Note

- I nomi propri dei luoghi restano in italiano (standard per le mappe turistiche).
- Le statistiche GoatCounter non usano cookie (nessun banner di consenso richiesto in UE).
