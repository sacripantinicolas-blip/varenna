// Modulo di traduzione condiviso (web + stampa).
// I nomi propri dei luoghi restano in italiano; si traducono UI e descrizioni.

// Le 6 descrizioni dei luoghi, nell'ordine del fronte / della categoria "Da visitare".
export const DESCS = {
  it: [
    'Chiesa romanica del Trecento, sulla piazza del borgo.',
    'Giardini botanici terrazzati affacciati sul lago.',
    'Villa-museo con giardino botanico lungo la riva.',
    'Storica collezione di uccelli del lago, in centro.',
    "Il fiume più corto d'Italia, dalle acque bianche.",
    "Camminamento romantico sospeso sull'acqua."
  ],
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

export const TDISC = {
  en: '<b>Train and ferry times vary by season and on public holidays.</b> Always check the latest official timetable (trenord.it · navigazionelaghi.it).',
  es: '<b>Los horarios de tren y transbordador varían según la temporada y en festivos.</b> Consulta siempre el horario oficial actualizado (trenord.it · navigazionelaghi.it).'
};

// Titoli categoria (per la legenda del web, via I18N).
export const CAT = {
  it: { rist: 'Ristoranti', hotel: 'Hotel · B&B · Agriturismi', bar: 'Bar & Gelaterie', neg: 'Negozi', att: 'Attività', serv: 'Servizi', vis: 'Da visitare' },
  en: { rist: 'Restaurants', hotel: 'Hotels · B&B · Farm stays', bar: 'Bars & Ice-cream', neg: 'Shops', att: 'Activities', serv: 'Services', vis: 'To visit' },
  es: { rist: 'Restaurantes', hotel: 'Hoteles · B&B · Agroturismos', bar: 'Bares y heladerías', neg: 'Tiendas', att: 'Actividades', serv: 'Servicios', vis: 'Para visitar' }
};

// Stringhe interfaccia.
export const UI = {
  it: { title: 'Varenna · Lago di Como', enlarge: 'tocca per ingrandire', call: 'Chiama', hint: 'Tocca i punti ♥ per foto e info', name: 'Italiano' },
  en: { title: 'Varenna · Lake Como', enlarge: 'tap to enlarge', call: 'Call', hint: 'Tap the ♥ points for photos and info', name: 'English' },
  es: { title: 'Varenna · Lago de Como', enlarge: 'toca para ampliar', call: 'Llamar', hint: 'Toca los puntos ♥ para fotos e info', name: 'Español' }
};

// I 6 luoghi "Da visitare": id (= id da aggiungere agli item vis), immagine, nome IT (mantenuto).
export const SIGHT_META = [
  { id: 'sangiorgio', img: 'immagini/san-giorgio.jpg', nm: 'Chiesa di San Giorgio' },
  { id: 'cipressi', img: 'immagini/villa-cipressi.jpg', nm: 'Giardini di Villa Cipressi' },
  { id: 'monastero', img: 'immagini/villa-monastero.jpg', nm: 'Villa Monastero' },
  { id: 'scanagatta', img: 'immagini/museo-scanagatta.jpg', nm: 'Museo Ornitologico Scanagatta' },
  { id: 'fiumelatte', img: 'immagini/fiumelatte.jpg', nm: 'Fiumelatte' },
  { id: 'innamorati', img: 'immagini/passeggiata-innamorati.jpg', nm: 'Passeggiata degli Innamorati' }
];

// [italiano, inglese, spagnolo] — sostituzioni testuali dirette.
export const TRI = [
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
  ['cartografia © OpenStreetMap contributors', 'cartography © OpenStreetMap contributors', 'cartografía © OpenStreetMap contributors']
];

// Traduce un frammento HTML nella lingua data ('it' = invariato).
export function translate(html, lang) {
  if (lang === 'it') return html;
  let out = html;
  let k = 0;
  out = out.replace(/(<div class="desc">)([\s\S]*?)(<\/div>)/g, (m, a, _t, b) => {
    const t = DESCS[lang][k]; k++;
    return t != null ? a + t + b : m;
  });
  out = out.replace(/(<div class="tdisc">)([\s\S]*?)(<\/div>)/, (m, a, _t, b) => a + TDISC[lang] + b);
  for (const [it, en, es] of TRI) out = out.split(it).join(lang === 'en' ? en : es);
  return out;
}

// Estrae l'innerHTML di un <div> bilanciando i tag annidati.
export function sliceDiv(html, openTag) {
  const start = html.indexOf(openTag);
  if (start < 0) return null;
  let i = start + openTag.length, depth = 1;
  const re = /<div\b|<\/div>/g; re.lastIndex = i;
  let m;
  while (depth > 0 && (m = re.exec(html)) !== null) {
    if (m[0] === '</div>') depth--; else depth++;
    i = re.lastIndex;
  }
  return { inner: html.slice(start + openTag.length, i - 6) };
}
