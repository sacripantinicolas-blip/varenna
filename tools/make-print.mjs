// Genera i file di stampa tradotti (EN, ES) dalla cartolina originale.
// I nomi propri dei luoghi restano in italiano; si traducono testi UI e descrizioni.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'C:/Users/Utente/Downloads/varenna-cartolina-fronte-retro.html10.html';
const OUT_DIR = 'C:/Users/Utente/varenna/stampa';
mkdirSync(OUT_DIR, { recursive: true });

// Le 6 descrizioni del fronte, nell'ordine in cui appaiono nel file.
const DESCS = {
  en: [
    '14th-century Romanesque church on the village square.',
    'Terraced botanical gardens overlooking the lake.',
    'Villa-museum with a botanical garden along the shore.',
    'Historic collection of local lake birds, in the centre.',
    "Italy's shortest river, with milky-white waters.",
    'Romantic walkway suspended over the water.'
  ],
  es: [
    'Iglesia románica del siglo XIV, en la plaza del pueblo.',
    'Jardines botánicos en terrazas con vistas al lago.',
    'Villa-museo con jardín botánico a lo largo de la orilla.',
    'Histórica colección de aves del lago, en el centro.',
    'El río más corto de Italia, de aguas blancas.',
    'Romántico paseo suspendido sobre el agua.'
  ]
};

// Disclaimer trasporti (contiene apostrofo): sostituito per intero dentro il wrapper.
const TDISC = {
  en: '<b>Train and ferry times vary by season and on public holidays.</b> Always check the latest official timetable (trenord.it · navigazionelaghi.it).',
  es: '<b>Los horarios de tren y transbordador varían según la temporada y en festivos.</b> Consulta siempre el horario oficial actualizado (trenord.it · navigazionelaghi.it).'
};

// [italiano, inglese, spagnolo] — sostituzioni testuali dirette.
const TRI = [
  ['<title>Varenna · cartolina fronte-retro</title>', '<title>Varenna · postcard map</title>', '<title>Varenna · mapa postal</title>'],
  ['Fronte · pagina 1', 'Front · page 1', 'Anverso · página 1'],
  ['Retro · pagina 2', 'Back · page 2', 'Reverso · página 2'],
  ['benvenuti a Varenna', 'welcome to Varenna', 'bienvenidos a Varenna'],
  ['class="t2">Lago di Como', 'class="t2">Lake Como', 'class="t2">Lago de Como'],
  ['Varenna · pianta del paese', 'Varenna · village map', 'Varenna · plano del pueblo'],
  ['benvenuti sul lago', 'welcome to the lake', 'bienvenidos al lago'],
  ['cartografia reale · i numeri rimandano alla legenda', 'real map · numbers refer to the legend', 'mapa real · los números remiten a la leyenda'],
  ['Ristoranti</span>', 'Restaurants</span>', 'Restaurantes</span>'],
  ['Hotel &amp; B&amp;B</span>', 'Hotels &amp; B&amp;B</span>', 'Hoteles &amp; B&amp;B</span>'],
  ['Bar &amp; Gelaterie</span>', 'Bars &amp; Ice-cream</span>', 'Bares &amp; Heladerías</span>'],
  ['Negozi</span>', 'Shops</span>', 'Tiendas</span>'],
  ['Servizi</span>', 'Services</span>', 'Servicios</span>'],
  ['Da visitare</span>', 'To visit</span>', 'Para visitar</span>'],
  ['Stazione / Imbarcadero</span>', 'Station / Ferry pier</span>', 'Estación / Embarcadero</span>'],
  ['Fermate navetta 🚌</span>', 'Shuttle bus stops 🚌</span>', 'Paradas de lanzadera 🚌</span>'],
  ['a circa <b>1,5 km a sud</b> lungo la Via Statale (fuori pianta):', 'about <b>1.5 km south</b> along the Via Statale (off the map):', 'a unos <b>1,5 km al sur</b> por la Via Statale (fuera del plano):'],
  ['Come muoversi · orari', 'Getting around · times', 'Cómo moverse · horarios'],
  ['<span class="h2sub">Getting around</span>', '<span class="h2sub"></span>', '<span class="h2sub"></span>'],
  ['Treno · Train', 'Train', 'Tren'],
  ['Battello · Ferry', 'Ferry', 'Transbordador'],
  ['Navetta &amp; Bus', 'Shuttle &amp; Bus', 'Lanzadera &amp; Bus'],
  [' A piedi ', ' On foot ', ' A pie '],
  ['da Piazza S. Giorgio', 'from Piazza S. Giorgio', 'desde Piazza S. Giorgio'],
  ['Traghetto', 'Ferry', 'Transbordador'],
  ['(passeggeri + auto)', '(passengers + cars)', '(pasajeros + coches)'],
  ['>frequenza (in stagione)</span>', '>frequency (in season)</span>', '>frecuencia (en temporada)</span>'],
  ['>frequenza</span>', '>frequency</span>', '>frecuencia</span>'],
  ['>primo / ultimo</span>', '>first / last</span>', '>primero / último</span>'],
  ['>fermate</span>', '>stops</span>', '>paradas</span>'],
  ['ogni ora', 'every hour', 'cada hora'],
  ['ogni 20', 'every 20', 'cada 20'],
  ['Estate 16 mag', 'Summer 16 May', 'Verano 16 may'],
  ['4 ott 2026 · feriale/festivo diversi', '4 Oct 2026 · weekday/holiday differ', '4 oct 2026 · laborable/festivo distintos'],
  ['Stazione FS', 'FS Station', 'Estación FS'],
  ['orari: trenord.it', 'timetables: trenord.it', 'horarios: trenord.it'],
  ['app Trenord', 'Trenord app', 'app Trenord'],
  ['>Imbarcadero / Ferry<', '>Ferry pier<', '>Embarcadero<'],
  ['Sorgente di Fiumelatte', 'Fiumelatte spring', 'Manantial de Fiumelatte'],
  ['Mappa di orientamento — punti geolocalizzati su cartografia reale.', 'Orientation map — points geolocated on a real basemap.', 'Mapa de orientación — puntos geolocalizados sobre cartografía real.'],
  ['cartografia © OpenStreetMap contributors', 'cartography © OpenStreetMap contributors', 'cartografía © OpenStreetMap contributors'],
  ["title:'Ristoranti'", "title:'Restaurants'", "title:'Restaurantes'"],
  ["title:'Hotel · B&B · Agriturismi'", "title:'Hotels · B&B · Farm stays'", "title:'Hoteles · B&B · Agroturismos'"],
  ["title:'Bar & Gelaterie'", "title:'Bars & Ice-cream'", "title:'Bares y heladerías'"],
  ["title:'Negozi'", "title:'Shops'", "title:'Tiendas'"],
  ["title:'Attività'", "title:'Activities'", "title:'Actividades'"],
  ["title:'Servizi'", "title:'Services'", "title:'Servicios'"],
  ["title:'Da visitare'", "title:'To visit'", "title:'Para visitar'"],
  ["${cat.title} <small>${cat.sub}</small>", "${cat.title}", "${cat.title}"],
  ["tel:'Piazza'", "tel:'Square'", "tel:'Plaza'"],
  ["tel:'lago'", "tel:'lake'", "tel:'lago'"],
  ["tel:'centro'", "tel:'centre'", "tel:'centro'"],
  ["tel:'sud'", "tel:'south'", "tel:'sur'"]
];

const original = readFileSync(SRC, 'utf8');
const idx = { en: 1, es: 2 };

for (const lang of ['en', 'es']) {
  let out = original;
  out = out.replace('<html lang="it">', `<html lang="${lang}">`);

  let k = 0;
  out = out.replace(/(<div class="desc">)([\s\S]*?)(<\/div>)/g, (m, a, _t, b) => {
    const t = DESCS[lang][k]; k++;
    return t != null ? a + t + b : m;
  });
  if (k !== 6) console.warn(`  ⚠ ${lang}: trovati ${k} blocchi desc (attesi 6)`);

  out = out.replace(/(<div class="tdisc">)([\s\S]*?)(<\/div>)/, (m, a, _t, b) => a + TDISC[lang] + b);

  for (const row of TRI) {
    const from = row[0], to = row[idx[lang]];
    if (out.includes(from)) out = out.split(from).join(to);
    else console.warn(`  ⚠ ${lang}: non trovato → ${from.slice(0, 40)}`);
  }

  const dest = `${OUT_DIR}/varenna-${lang}.html`;
  writeFileSync(dest, out, 'utf8');
  console.log(`✓ ${lang.toUpperCase()} → ${dest} (${(Buffer.byteLength(out) / 1024 / 1024).toFixed(1)} MB)`);
}
console.log('Fatto.');
