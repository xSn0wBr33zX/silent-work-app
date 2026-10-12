/* =========================================================
   Stille Arbeit – Unsichtbare Arbeit sichtbar machen
   Alles läuft lokal im Browser. Gespeichert wird im localStorage.

   Aufbau dieser Datei:
    1. Feste Daten (Länder, Kategorien, Fakten)
    2. Hilfsfunktionen (Zeit, Geld, Datum)
    3. Speichern & Laden
    4. Navigation zwischen den Seiten
    5.–11. Die einzelnen Seiten
   12. Start der App
   ========================================================= */

// ---------- 1. Feste Daten ----------

/*
  LÄNDER
  satz:     Mindestlohn für Arbeit im Haushalt (pro Stunde, Landeswährung)
  frauen /
  maenner:  Durchschnittliche unbezahlte Arbeit pro Tag in MINUTEN
  Werte prüfen und bei Bedarf hier anpassen (meist zum 1. Januar).
*/
const LAENDER = {
  ch: {
    name: "Schweiz", flagge: "🇨🇭", waehrung: "CHF", sprache: "de-CH",
    satz: 19.95, satzQuelle: "NAV Hauswirtschaft (Bund), ungelernt, 2026",
    frauen: 246, maenner: 164, zeitQuelle: "BFS, Arbeitskräfteerhebung 2020"
  },
  it: {
    name: "Italien", flagge: "🇮🇹", waehrung: "EUR", sprache: "de-DE",
    satz: 7.01, satzQuelle: "CCNL Lavoro domestico, Stufe B, 2026",
    frauen: 306, maenner: 131, zeitQuelle: "OECD Time Use"
  },
  at: {
    name: "Österreich", flagge: "🇦🇹", waehrung: "EUR", sprache: "de-AT",
    satz: 12.23, satzQuelle: "Mindestlohntarif für im Haushalt Beschäftigte, 2026",
    frauen: 238, maenner: 146, zeitQuelle: "Statistik Austria, Zeitverwendung 2021/22"
  },
  se: {
    name: "Schweden", flagge: "🇸🇪", waehrung: "SEK", sprache: "sv-SE",
    satz: 171.46, satzQuelle: "Kollektivvertrag Reinigung (Fastighets/Almega)",
    frauen: 220, maenner: 171, zeitQuelle: "OECD Time Use"
  }
};

/*
  KATEGORIEN
  hell = Kachel-Hintergrund, dunkel = Linienfarbe des Symbols,
  mittel = Füllfarbe im Symbol und Farbe im Diagramm
*/
const KATEGORIEN = [
  { id: "kochen",       name: "Kochen",          hell: "#F7D6D6", mittel: "#E58A8F", dunkel: "#B94752" },
  { id: "putzen",       name: "Putzen",          hell: "#D7E8D4", mittel: "#8DBF8B", dunkel: "#3F7D4E" },
  { id: "waesche",      name: "Wäsche",          hell: "#E2DAF3", mittel: "#A996DE", dunkel: "#6250AE" },
  { id: "kinder",       name: "Kinderbetreuung", hell: "#FBE4C8", mittel: "#F5C46B", dunkel: "#B26E22" },
  { id: "einkaufen",    name: "Einkaufen",       hell: "#D6E5F4", mittel: "#8DB4E2", dunkel: "#355F96" },
  { id: "organisation", name: "Organisation",    hell: "#F7DCD3", mittel: "#EBA27E", dunkel: "#B4553F" },
  { id: "pflege",       name: "Pflege",          hell: "#D7E8D4", mittel: "#5FA36F", dunkel: "#2F6B40" },
  { id: "sonstiges",    name: "Sonstiges",       hell: "#E2DAF3", mittel: "#B9B2C9", dunkel: "#6250AE" }
];

// Fakten mit Quelle für "Schon gewusst?"
const FAKTEN = [
  { text: "In 23 europäischen Ländern leisten Frauen im Schnitt 86 % mehr unbezahlte Arbeit als Männer – rund 2 Stunden pro Tag.",
    quelle: "OECD, berichtet von Euronews (2025)" },
  { text: "In der Schweiz wurde 2020 unbezahlte Arbeit im Wert von 434 Milliarden Franken geleistet – 60 % davon von Frauen.",
    quelle: "BFS, Satellitenkonto Haushaltsproduktion" },
  { text: "In der Schweiz wurden 2020 mehr Stunden unbezahlt gearbeitet (9,8 Mrd.) als gegen Bezahlung (7,6 Mrd.).",
    quelle: "BFS, Satellitenkonto Haushaltsproduktion" },
  { text: "Schweden hat in Europa den kleinsten Unterschied: Frauen leisten dort 49 Minuten pro Tag mehr unbezahlte Arbeit als Männer.",
    quelle: "OECD Time Use" },
  { text: "In Italien leisten Frauen mehr als doppelt so viel unbezahlte Arbeit wie Männer.",
    quelle: "OECD Time Use" },
  { text: "In Österreich übernehmen Frauen fast zwei Drittel (62,6 %) der gesamten unbezahlten Arbeit.",
    quelle: "Statistik Austria, Zeitverwendung 2021/22" },
  { text: "Hausarbeit ist der größte Teil der unbezahlten Arbeit – in vielen Ländern mehr als 70 %.",
    quelle: "OECD" }
];

// Aufklappbare Themen unter "Mehr Fakten"
const MEHR_FAKTEN = [
  { titel: "Zeitverwendung in Europa", symbol: "📊", farbe: "var(--lila-hell)", ziel: "vergleich" },
  { titel: "Warum ist Care-Arbeit unsichtbar?", symbol: "❓", farbe: "var(--gelb-hell)",
    text: "Care-Arbeit passiert meist zu Hause und wird nicht bezahlt. Deshalb taucht sie auf keiner Lohnabrechnung " +
          "und nicht im Bruttoinlandsprodukt auf. Oft fällt sie erst auf, wenn sie nicht gemacht wird: wenn kein Essen " +
          "auf dem Tisch steht oder die Wäsche liegen bleibt." },
  { titel: "Auswirkungen auf Karriere und Einkommen", symbol: "📈", farbe: "var(--gruen-hell)",
    text: "Wer viel unbezahlte Arbeit übernimmt, hat weniger Zeit für bezahlte Arbeit. Viele Frauen arbeiten deshalb " +
          "Teilzeit – in Österreich etwa jede zweite. Weniger Lohn bedeutet später auch weniger Rente: Frauen haben im " +
          "Alter ein höheres Armutsrisiko.",
    quelle: "Statistik Austria (Teilzeitquote 50,7 %), Kanton Zürich, Statistisches Amt" },
  { titel: "Tipps für eine gerechtere Verteilung", symbol: "👥", farbe: "var(--lila-hell)",
    text: "Schreibt gemeinsam auf, was alles anfällt – auch Unsichtbares wie Termine im Kopf behalten. " +
          "Verteilt Zuständigkeiten statt „Mithelfen“: Wer zuständig ist, denkt auch daran. " +
          "Wechselt unbeliebte Aufgaben regelmäßig. Und erfasst eure Zeit – was man sieht, kann man fair teilen." }
];

const SPEICHER = {
  eintraege: "stilleArbeit.eintraege", // Name aus Version 1 behalten, damit alte Daten bleiben
  land: "stilleArbeit.land",
  willkommen: "care.willkommen",
  timer: "care.timer"
};

// ---------- 2. Hilfsfunktionen ----------

const $ = id => document.getElementById(id);

function kategorie(id) {
  return KATEGORIEN.find(k => k.id === id) || KATEGORIEN[KATEGORIEN.length - 1];
}

// Minuten -> "1:05 h"
function hm(minuten, mitH = true) {
  const h = Math.floor(minuten / 60);
  const m = Math.round(minuten % 60);
  return `${h}:${String(m).padStart(2, "0")}${mitH ? " h" : ""}`;
}

// Millisekunden -> "00:45:12"
function uhrzeit(ms) {
  const s = Math.floor(ms / 1000);
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(z => String(z).padStart(2, "0")).join(":");
}

function geld(betrag, landCode) {
  const land = LAENDER[landCode];
  return new Intl.NumberFormat(land.sprache, { style: "currency", currency: land.waehrung }).format(betrag);
}

// Date -> "2026-10-12"
function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function ausIso(text) {
  const [j, m, t] = text.split("-").map(Number);
  return new Date(j, m - 1, t);
}
function heute() { return iso(new Date()); }

// Schützt vor kaputtem HTML, wenn jemand z. B. "<b>" eintippt
function sicher(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/*
  Zeitraum berechnen.
  art: "tag" | "woche" | "monat" | "gesamt", versatz: 0 = aktuell, -1 = davor ...
  Rückgabe: { von, bis, text } – von/bis als ISO-Text (inklusive)
*/
function zeitraum(art, versatz = 0) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  if (art === "gesamt") return { von: "0000-01-01", bis: "9999-12-31", text: "Gesamt" };

  if (art === "tag") {
    d.setDate(d.getDate() + versatz);
    return { von: iso(d), bis: iso(d),
      text: d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  }
  if (art === "woche") {
    const montag = new Date(d);
    montag.setDate(d.getDate() - ((d.getDay() + 6) % 7) + versatz * 7); // Woche beginnt am Montag
    const sonntag = new Date(montag);
    sonntag.setDate(montag.getDate() + 6);
    const gleicherMonat = montag.getMonth() === sonntag.getMonth();
    const anfang = montag.toLocaleDateString("de-DE", gleicherMonat ? { day: "numeric" } : { day: "numeric", month: "short" });
    const ende = sonntag.toLocaleDateString("de-DE", { day: "numeric", month: gleicherMonat ? "long" : "short", year: "numeric" });
    return { von: iso(montag), bis: iso(sonntag), text: `${anfang.replace(/\.$/, "")}.–${ende}` };
  }
  // Monat
  const erster = new Date(d.getFullYear(), d.getMonth() + versatz, 1);
  const letzter = new Date(d.getFullYear(), d.getMonth() + versatz + 1, 0);
  return { von: iso(erster), bis: iso(letzter),
    text: erster.toLocaleDateString("de-DE", { month: "long", year: "numeric" }) };
}

function imZeitraum(eintraege, z) {
  return eintraege.filter(e => e.datum >= z.von && e.datum <= z.bis);
}

function summeMinuten(eintraege) {
  return eintraege.reduce((s, e) => s + e.minuten, 0);
}

// Minuten pro Kategorie, größte zuerst: [{...kategorie, minuten}]
function proKategorie(eintraege) {
  const summen = {};
  for (const e of eintraege) summen[e.kategorie] = (summen[e.kategorie] || 0) + e.minuten;
  return KATEGORIEN.filter(k => summen[k.id]).map(k => ({ ...k, minuten: summen[k.id] }))
    .sort((a, b) => b.minuten - a.minuten);
}

/*
  Symbole der Kategorien als kleine SVG-Zeichnungen.
  Linien in der dunklen Farbe, Flächen in der mittleren Farbe.
*/
function symbol(id) {
  const k = kategorie(id);
  const L = `fill="none" stroke="${k.dunkel}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
  const F = `fill="${k.mittel}" stroke="${k.dunkel}" stroke-width="2.4" stroke-linejoin="round"`;
  const formen = {
    kochen: `<path d="M9 21h30v11a8 8 0 0 1-8 8H17a8 8 0 0 1-8-8z" ${F}/><path d="M5 24h4M39 24h4" ${L}/>
             <path d="M10 21c1-5 27-5 28 0z" fill="#F7D6D6" stroke="${k.dunkel}" stroke-width="2.4" stroke-linejoin="round"/><path d="M21 15h6" ${L}/>`,
    putzen: `<path d="M36 5 25 25" ${L}/><path d="M17 24h14l5 17H12z" ${F}/><path d="M19 41l1-8M24 41v-9M29 41l-1-8" ${L}/>`,
    waesche: `<rect x="10" y="6" width="28" height="36" rx="5" ${F}/><circle cx="24" cy="27" r="9" fill="#F4F0FB" stroke="${k.dunkel}" stroke-width="2.4"/>
              <path d="M18 29c3-3 9 3 12 0" ${L}/><path d="M15 12h4M31 12h1" ${L}/>`,
    kinder: `<circle cx="16" cy="26" r="10" ${F}/><circle cx="33" cy="25" r="9" fill="#FCEBD4" stroke="${k.dunkel}" stroke-width="2.4"/>
             <path d="M7 22c3-9 15-10 19-2" fill="${k.dunkel}" opacity=".85"/><path d="M25 19c3-6 14-5 16 3" ${L}/>
             <path d="M12 30c2 2 6 2 8 0M29 29c2 2 6 2 8 0" ${L}/><circle cx="13" cy="25" r="1.2" fill="${k.dunkel}"/><circle cx="19" cy="25" r="1.2" fill="${k.dunkel}"/>
             <circle cx="30" cy="24" r="1.2" fill="${k.dunkel}"/><circle cx="36" cy="24" r="1.2" fill="${k.dunkel}"/>`,
    einkaufen: `<path d="M5 9h6l5 21h21l4-15H13" ${L}/><path d="M13 15h28l-4 15H16z" ${F}/><circle cx="18" cy="37" r="3" ${F}/><circle cx="34" cy="37" r="3" ${F}/>`,
    organisation: `<rect x="8" y="10" width="32" height="30" rx="5" fill="#FBEDEA" stroke="${k.dunkel}" stroke-width="2.4"/>
                   <path d="M8 18h32" ${L}/><path d="M16 6v8M32 6v8" ${L}/>
                   <g fill="${k.mittel}"><rect x="14" y="23" width="5" height="4" rx="1"/><rect x="22" y="23" width="5" height="4" rx="1"/><rect x="30" y="23" width="5" height="4" rx="1"/>
                   <rect x="14" y="31" width="5" height="4" rx="1"/><rect x="22" y="31" width="5" height="4" rx="1"/></g>`,
    pflege: `<path d="M24 41S7 31 7 18.5C7 12 11.5 8 16.5 8c3.4 0 5.8 2 7.5 4.6C25.7 10 28.1 8 31.5 8 36.5 8 41 12 41 18.5 41 31 24 41 24 41z" ${F}/>`,
    sonstiges: `<circle cx="13" cy="24" r="3.5" fill="${k.dunkel}"/><circle cx="24" cy="24" r="3.5" fill="${k.dunkel}"/><circle cx="35" cy="24" r="3.5" fill="${k.dunkel}"/>`
  };
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${formen[k.id]}</svg>`;
}

// ---------- 3. Speichern & Laden ----------

/*
  Einträge aus älteren App-Versionen ins aktuelle Format bringen:
  { id, kategorie, minuten, datum, notiz }
*/
function migrieren(e) {
  if (!e || typeof e.datum !== "string") return null;
  if (e.kategorie && typeof e.minuten === "number") return e;
  if (e.kategorie && typeof e.stunden === "number") {               // Version 2
    return { id: e.id, kategorie: e.kategorie, minuten: Math.round(e.stunden * 60), datum: e.datum, notiz: e.text || "" };
  }
  if (e.taetigkeit && typeof e.stunden === "number") {               // Version 1
    return { id: e.id, kategorie: "sonstiges", minuten: Math.round(e.stunden * 60), datum: e.datum, notiz: e.taetigkeit };
  }
  return null;
}

function eintraegeLaden() {
  try {
    const roh = JSON.parse(localStorage.getItem(SPEICHER.eintraege)) || [];
    return roh.map(migrieren).filter(e => e && KATEGORIEN.some(k => k.id === e.kategorie) && e.minuten > 0);
  } catch {
    return [];
  }
}
function eintraegeSpeichern(liste) {
  localStorage.setItem(SPEICHER.eintraege, JSON.stringify(liste));
}
function eintragHinzufuegen(kategorieId, minuten, datum, notiz) {
  const liste = eintraegeLaden();
  liste.push({ id: Date.now(), kategorie: kategorieId, minuten, datum, notiz: notiz || "" });
  eintraegeSpeichern(liste);
}

function landLaden() {
  const code = localStorage.getItem(SPEICHER.land);
  return LAENDER[code] ? code : null;
}

function timerLaden() {
  try { return JSON.parse(localStorage.getItem(SPEICHER.timer)); } catch { return null; }
}
function timerSpeichern(t) {
  if (t) localStorage.setItem(SPEICHER.timer, JSON.stringify(t));
  else localStorage.removeItem(SPEICHER.timer);
}
// Gemessene Zeit in Millisekunden (auch wenn die App zwischendurch zu war)
function timerVergangen(t) {
  return t.bisher + (t.start ? Date.now() - t.start : 0);
}

// ---------- 4. Navigation ----------

let aktuell = null;
let vorher = "home";
const OHNE_NAV = ["willkommen", "timer"];
const NAV_ZUORDNUNG = { home: "home", statistik: "statistik", aufgaben: "aufgaben", mehr: "mehr", land: "mehr" };

function zeige(name) {
  // Ohne Land kann nichts berechnet werden
  if (!landLaden() && !["willkommen", "land"].includes(name)) {
    name = "land";
  }
  if (aktuell && aktuell !== name) vorher = aktuell;
  aktuell = name;

  document.querySelectorAll(".screen").forEach(s => { s.hidden = s.id !== `screen-${name}`; });
  $("nav").hidden = OHNE_NAV.includes(name);
  document.querySelectorAll(".nav [data-gehe]").forEach(b => {
    b.classList.toggle("aktiv", b.dataset.gehe === NAV_ZUORDNUNG[name]);
  });
  window.scrollTo(0, 0);
  zeichne();
}

// Alles mit data-gehe="..." wechselt die Seite (auch später erzeugte Knöpfe)
document.addEventListener("click", ereignis => {
  const ziel = ereignis.target.closest("[data-gehe]");
  if (ziel) {
    if (ziel.dataset.teil) statistik.teil = ziel.dataset.teil;
    zeige(ziel.dataset.gehe);
  }
  if (ereignis.target.closest("[data-zurueck]")) zeige(vorher);
});

// Zeichnet die gerade sichtbare Seite neu
function zeichne() {
  const funktionen = { home: zeichneHome, land: zeichneLaender, timer: zeichneTimer,
    aufgaben: zeichneAufgaben, statistik: zeichneStatistik, mehr: zeichneMehr };
  if (funktionen[aktuell]) funktionen[aktuell]();
}

// Pillen-Gruppen: setzt "aktiv" und ruft beiWahl(wert) auf
function pillenGruppe(id, beiWahl) {
  $(id).addEventListener("click", ereignis => {
    const knopf = ereignis.target.closest("button[data-wert]");
    if (!knopf) return;
    $(id).querySelectorAll("button").forEach(b => b.classList.toggle("aktiv", b === knopf));
    beiWahl(knopf.dataset.wert);
  });
}
function pillenSetzen(id, wert) {
  $(id).querySelectorAll("button").forEach(b => b.classList.toggle("aktiv", b.dataset.wert === wert));
}

// ---------- 5. Willkommen & Land ----------

$("los-gehts").addEventListener("click", () => {
  localStorage.setItem(SPEICHER.willkommen, "1");
  zeige(landLaden() ? "home" : "land");
});

function zeichneLaender() {
  const gewaehlt = landLaden();
  $("laender").innerHTML = Object.entries(LAENDER).map(([code, land]) => `
    <button class="land-karte" role="radio" aria-checked="${code === gewaehlt}" data-land="${code}">
      <span class="land-flagge" aria-hidden="true">${land.flagge}</span>
      <span class="land-text">
        <span class="land-name">${land.name}</span>
        <span class="land-quelle">${land.satzQuelle}</span>
      </span>
      <span class="land-satz">${geld(land.satz, code)}<small>pro Stunde</small></span>
    </button>`).join("");
}

$("laender").addEventListener("click", ereignis => {
  const karte = ereignis.target.closest(".land-karte");
  if (!karte) return;
  const ersteWahl = !landLaden();
  localStorage.setItem(SPEICHER.land, karte.dataset.land);
  toast(`${LAENDER[karte.dataset.land].name} gewählt`);
  if (ersteWahl) zeige("home"); else zeichneLaender();
});

// ---------- 6. Home ----------

function zeichneHome() {
  $("profil-knopf").textContent = LAENDER[landLaden()].flagge;
  $("kacheln").innerHTML = KATEGORIEN.map(k => `
    <button class="kachel" data-kategorie="${k.id}" style="--hell:${k.hell}">
      ${symbol(k.id)}
      ${k.name}
    </button>`).join("");
  bannerAktualisieren();
}

$("kacheln").addEventListener("click", ereignis => {
  const kachel = ereignis.target.closest(".kachel");
  if (kachel) timerStarten(kachel.dataset.kategorie);
});

function bannerAktualisieren() {
  const t = timerLaden();
  const banner = $("laeuft-banner");
  banner.hidden = !t;
  if (!t) return;
  banner.innerHTML = `<span class="puls"></span>${kategorie(t.kategorie).name} ${t.start ? "läuft" : "pausiert"}
    <span class="zeit">${uhrzeit(timerVergangen(t))}</span>`;
}
$("laeuft-banner").addEventListener("click", () => zeige("timer"));

// ---------- 7. Timer ----------

const RING_UMFANG = 2 * Math.PI * 96;
$("ring-vorne").style.strokeDasharray = RING_UMFANG;

function timerStarten(kategorieId) {
  const laufend = timerLaden();
  if (laufend && laufend.kategorie !== kategorieId) {
    toast(`Es läuft schon: ${kategorie(laufend.kategorie).name}`);
  } else if (!laufend) {
    timerSpeichern({ kategorie: kategorieId, start: Date.now(), bisher: 0, notiz: "", datum: heute() });
  }
  zeige("timer");
}

function zeichneTimer() {
  const t = timerLaden();
  if (!t) return zeige("home");
  const k = kategorie(t.kategorie);
  $("timer-titel").textContent = k.name;
  $("timer-symbol").innerHTML = symbol(k.id);
  $("timer-notiz").value = t.notiz;
  $("timer-notiz-label").textContent = k.id === "sonstiges" ? "Was genau?" : "Notiz (optional)";
  $("timer-notiz").placeholder = k.id === "sonstiges" ? "z. B. Hausaufgaben begleiten" : "z. B. Abendessen für alle gekocht";
  timerAnzeige();
}

// Wird jede halbe Sekunde aufgerufen
function timerAnzeige() {
  const t = timerLaden();
  if (!t) return;
  const ms = timerVergangen(t);
  $("timer-zeit").textContent = uhrzeit(ms);
  $("timer-status").textContent = t.start ? "läuft …" : "pausiert";
  // Der Ring füllt sich einmal pro Stunde
  const anteil = (ms % 3600000) / 3600000;
  $("ring-vorne").style.strokeDashoffset = RING_UMFANG * (1 - anteil);
  $("pause-knopf").innerHTML = t.start
    ? `<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>`
    : `<svg viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>`;
  $("pause-knopf").setAttribute("aria-label", t.start ? "Pause" : "Weiter");
}

setInterval(() => {
  if (aktuell === "timer") timerAnzeige();
  if (aktuell === "home") bannerAktualisieren();
}, 500);

$("pause-knopf").addEventListener("click", () => {
  const t = timerLaden();
  if (t.start) { t.bisher += Date.now() - t.start; t.start = null; }
  else { t.start = Date.now(); }
  timerSpeichern(t);
  timerAnzeige();
});

$("timer-notiz").addEventListener("input", () => {
  const t = timerLaden();
  if (t) { t.notiz = $("timer-notiz").value; timerSpeichern(t); }
});

$("timer-fertig").addEventListener("click", () => {
  const t = timerLaden();
  const minuten = Math.round(timerVergangen(t) / 60000);
  if (minuten < 1) return toast("Miss mindestens 1 Minute");
  eintragHinzufuegen(t.kategorie, minuten, t.datum || heute(), t.notiz.trim());
  timerSpeichern(null);
  toast(`${kategorie(t.kategorie).name}: ${hm(minuten)} gespeichert`);
  zeige("home");
});

$("timer-verwerfen").addEventListener("click", () => {
  if (confirm("Messung verwerfen? Die Zeit wird nicht gespeichert.")) {
    timerSpeichern(null);
    zeige("home");
  }
});

// ---------- 8. Aufgaben ----------

let aufgabenZeitraum = "tag";
const aufgeklappt = new Set();
pillenGruppe("aufgaben-zeitraum", wert => { aufgabenZeitraum = wert; zeichneAufgaben(); });

function zeichneAufgaben() {
  const eintraege = imZeitraum(eintraegeLaden(), zeitraum(aufgabenZeitraum));
  const gruppen = proKategorie(eintraege);
  $("aufgaben-leer").hidden = gruppen.length > 0;

  $("aufgaben-liste").innerHTML = gruppen.map(g => {
    const offen = aufgeklappt.has(g.id);
    const einzelne = eintraege.filter(e => e.kategorie === g.id)
      .sort((a, b) => b.datum.localeCompare(a.datum) || b.id - a.id);
    return `
      <li>
        <button class="aufgabe-kopf" data-auf="${g.id}" aria-expanded="${offen}">
          <span class="mini-symbol" style="--hell:${g.hell}">${symbol(g.id)}</span>
          <span class="aufgabe-name">${g.name}</span>
          <span class="aufgabe-zeit">${hm(g.minuten)}</span>
          <svg class="pfeil" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
        <ul class="eintraege" ${offen ? "" : "hidden"}>
          ${einzelne.map(e => `
            <li>
              <span class="info">
                ${ausIso(e.datum).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })} · ${hm(e.minuten)}
                ${e.notiz ? `<small>${sicher(e.notiz)}</small>` : ""}
              </span>
              <button class="loeschen" data-id="${e.id}" aria-label="Eintrag löschen">×</button>
            </li>`).join("")}
        </ul>
      </li>`;
  }).join("");
}

$("aufgaben-liste").addEventListener("click", ereignis => {
  const kopf = ereignis.target.closest(".aufgabe-kopf");
  if (kopf) {
    const id = kopf.dataset.auf;
    aufgeklappt.has(id) ? aufgeklappt.delete(id) : aufgeklappt.add(id);
    return zeichneAufgaben();
  }
  const loeschen = ereignis.target.closest(".loeschen");
  if (loeschen && confirm("Diesen Eintrag löschen?")) {
    eintraegeSpeichern(eintraegeLaden().filter(e => e.id !== Number(loeschen.dataset.id)));
    zeichneAufgaben();
    toast("Eintrag gelöscht");
  }
});

// ---------- 9. Statistik (Übersicht, Wert, Vergleich) ----------

const statistik = { teil: "uebersicht", zeitraum: "tag", versatz: 0, wertZeitraum: "tag", vergleich: "frauen" };

pillenGruppe("statistik-reiter", wert => { statistik.teil = wert; zeichneStatistik(); window.scrollTo(0, 0); });
pillenGruppe("statistik-zeitraum", wert => { statistik.zeitraum = wert; statistik.versatz = 0; zeichneStatistik(); });
pillenGruppe("wert-zeitraum", wert => { statistik.wertZeitraum = wert; zeichneStatistik(); });
pillenGruppe("vergleich-modus", wert => { statistik.vergleich = wert; zeichneStatistik(); });
$("datum-zurueck").addEventListener("click", () => { statistik.versatz--; zeichneStatistik(); });
$("datum-vor").addEventListener("click", () => { statistik.versatz++; zeichneStatistik(); });

function zeichneStatistik() {
  pillenSetzen("statistik-reiter", statistik.teil);
  ["uebersicht", "wert", "vergleich"].forEach(t => { $(`teil-${t}`).hidden = t !== statistik.teil; });
  const alle = eintraegeLaden();
  const landCode = landLaden();
  if (statistik.teil === "uebersicht") zeichneUebersicht(alle);
  if (statistik.teil === "wert") zeichneWert(alle, landCode);
  if (statistik.teil === "vergleich") zeichneVergleich(alle, landCode);
}

/*
  Donut-Diagramm: Jedes Stück ist ein Kreis mit dickem Rand.
  stroke-dasharray = "Länge des Stücks, Rest als Lücke"
  stroke-dashoffset = verschiebt das Stück hinter das vorherige.
*/
function zeichneUebersicht(alle) {
  const z = zeitraum(statistik.zeitraum, statistik.versatz);
  $("datum-text").textContent = z.text;
  $("datum-vor").disabled = statistik.versatz >= 0;

  const teile = proKategorie(imZeitraum(alle, z));
  const gesamt = summeMinuten(teile);
  const r = 78, umfang = 2 * Math.PI * r;

  let svg = `<circle cx="100" cy="100" r="${r}" fill="none" stroke="var(--linie)" stroke-width="44"/>`;
  let bisher = 0;
  for (const t of teile) {
    const laenge = (t.minuten / gesamt) * umfang;
    svg += `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${t.mittel}" stroke-width="44"
      stroke-dasharray="${laenge} ${umfang - laenge}" stroke-dashoffset="${-bisher}"/>`;
    bisher += laenge;
  }
  $("donut").innerHTML = svg;
  $("donut-gesamt").textContent = hm(gesamt);

  $("legende").innerHTML = teile.length ? teile.map(t => `
    <li>
      <i style="background:${t.mittel}"></i>
      <span>${t.name}</span>
      <span class="zeit">${hm(t.minuten)}</span>
      <span class="prozent">${Math.round(t.minuten / gesamt * 100)} %</span>
    </li>`).join("")
    : `<li class="leer" style="display:block">Für diesen Zeitraum gibt es noch keine Einträge.</li>`;
}

function zeichneWert(alle, landCode) {
  const land = LAENDER[landCode];
  const minuten = summeMinuten(imZeitraum(alle, zeitraum(statistik.wertZeitraum)));
  const wann = { tag: "hätte deine Arbeit heute", woche: "hätte deine Arbeit diese Woche",
    monat: "hätte deine Arbeit diesen Monat", gesamt: "hätte deine Arbeit bisher insgesamt" }[statistik.wertZeitraum];

  $("wert-einleitung").textContent = `Wenn unbezahlte Care-Arbeit bezahlt werden würde, ${wann} einen Wert von:`;
  $("wert-betrag").textContent = geld(minuten / 60 * land.satz, landCode);
  $("wert-grundlage").textContent =
    `${hm(minuten)} × ${geld(land.satz, landCode)} – Mindestlohn für Haushaltsarbeit in ${land.name} (${land.satzQuelle}).`;

  $("wert-laender").innerHTML = Object.entries(LAENDER).map(([code, l]) => `
    <li class="${code === landCode ? "aktuell" : ""}">
      <span class="flagge" aria-hidden="true">${l.flagge}</span>
      <span class="name">${l.name}<small>${geld(l.satz, code)} pro Stunde</small></span>
      <span class="betrag">${geld(minuten / 60 * l.satz, code)}</span>
    </li>`).join("");
}

function zeichneVergleich(alle, landCode) {
  pillenSetzen("vergleich-modus", statistik.vergleich);
  const modus = statistik.vergleich;

  // Eigener Durchschnitt: Minuten der letzten 7 Tage (inkl. heute) geteilt durch 7
  const vor6 = new Date(); vor6.setDate(vor6.getDate() - 6);
  const ichSchnitt = Math.round(summeMinuten(imZeitraum(alle, { von: iso(vor6), bis: heute() })) / 7);

  const werte = Object.values(LAENDER).flatMap(l => [l.frauen, l.maenner]);
  const max = Math.max(...werte, modus === "ich" ? ichSchnitt : 0) * 1.12;
  const hoehe = 206; // Zeichenfläche in Pixeln (230 - 24 für die Ländernamen)

  let html = Object.entries(LAENDER).map(([code, l]) => `
    <div class="balken-gruppe">
      <div class="balken ${modus === "maenner" ? "gedimmt" : ""}" style="height:${l.frauen / max * 100}%;background:var(--frauen)"><span>${hm(l.frauen, false)}</span></div>
      <div class="balken ${modus === "frauen" ? "gedimmt" : ""}" style="height:${l.maenner / max * 100}%;background:var(--maenner)"><span>${hm(l.maenner, false)}</span></div>
      <b style="${code === landCode ? "color:var(--rosa-dunkel)" : ""}">${l.name}</b>
    </div>`).join("");

  if (modus === "ich" && ichSchnitt > 0) {
    html += `<div class="ich-linie" style="bottom:${24 + hoehe * ichSchnitt / max}px"><span>Du: ${hm(ichSchnitt, false)}</span></div>`;
  }
  $("balken").innerHTML = html;

  $("legende-ich").hidden = modus !== "ich" || ichSchnitt === 0;
  $("ich-hinweis").hidden = modus !== "ich";
  $("ich-hinweis").textContent = ichSchnitt > 0
    ? `Dein Durchschnitt der letzten 7 Tage: ${hm(ichSchnitt)} pro Tag.`
    : "Erfasse ein paar Tage lang deine Arbeit – dann erscheint hier dein eigener Durchschnitt.";

  const quellen = [...new Set(Object.values(LAENDER).map(l => `${l.name}: ${l.zeitQuelle}`))];
  $("vergleich-quellen").textContent = "Quellen – " + quellen.join(" · ") +
    ". Die Erhebungen unterscheiden sich in Jahr und Altersgruppe, die Werte sind daher nur ungefähr vergleichbar.";
}

// ---------- 10. Mehr ----------

function zeichneMehr() {
  const landCode = landLaden();
  $("mehr-land").textContent = `${LAENDER[landCode].flagge} ${LAENDER[landCode].name} · ${geld(LAENDER[landCode].satz, landCode)} pro Stunde`;

  const birne = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/></svg>`;
  $("fakten-spur").innerHTML = FAKTEN.map(f => `
    <div class="fakt">${birne}<p>${f.text}<small>Quelle: ${f.quelle}</small></p></div>`).join("");
  $("fakten-punkte").innerHTML = FAKTEN.map((_, i) => `<i class="${i === 0 ? "aktiv" : ""}"></i>`).join("");

  $("mehr-fakten").innerHTML = MEHR_FAKTEN.map((f, i) => f.ziel
    ? `<button class="zeile-knopf" data-gehe="statistik" data-teil="${f.ziel}">
         <span class="mini-symbol" style="background:${f.farbe}">${f.symbol}</span>
         <span class="zeile-text">${f.titel}</span>
         <svg class="pfeil" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
       </button>`
    : `<button class="zeile-knopf" data-fakt="${i}" aria-expanded="false">
         <span class="mini-symbol" style="background:${f.farbe}">${f.symbol}</span>
         <span class="zeile-text">${f.titel}</span>
         <svg class="pfeil" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
       </button>
       <p class="aufklapp-text" hidden>${f.text}${f.quelle ? `<small>Quelle: ${f.quelle}</small>` : ""}</p>`
  ).join("");
}

// Karussell: Pfeile blättern, Punkte zeigen die Position
function faktBlaettern(richtung) {
  const spur = $("fakten-spur");
  spur.scrollBy({ left: richtung * spur.clientWidth, behavior: "smooth" });
}
$("fakt-zurueck").addEventListener("click", () => faktBlaettern(-1));
$("fakt-vor").addEventListener("click", () => faktBlaettern(1));
$("fakten-spur").addEventListener("scroll", () => {
  const spur = $("fakten-spur");
  const index = Math.round(spur.scrollLeft / spur.clientWidth);
  $("fakten-punkte").querySelectorAll("i").forEach((p, i) => p.classList.toggle("aktiv", i === index));
});

$("mehr-fakten").addEventListener("click", ereignis => {
  const knopf = ereignis.target.closest("[data-fakt]");
  if (!knopf) return;
  const offen = knopf.getAttribute("aria-expanded") === "true";
  knopf.setAttribute("aria-expanded", String(!offen));
  knopf.nextElementSibling.hidden = offen;
});

// Daten sichern
$("exportieren").addEventListener("click", async () => {
  const daten = JSON.stringify({ app: "stille-arbeit", version: 3, land: landLaden(), eintraege: eintraegeLaden() }, null, 2);
  const dateiname = `stille-arbeit-${heute()}.json`;
  const datei = new File([daten], dateiname, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [datei] })) {
    try { await navigator.share({ files: [datei], title: "Stille Arbeit – Sicherung" }); } catch { /* abgebrochen */ }
    return;
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(datei);
  link.download = dateiname;
  link.click();
  URL.revokeObjectURL(link.href);
});

$("import-datei").addEventListener("change", async ereignis => {
  const datei = ereignis.target.files[0];
  if (!datei) return;
  try {
    const inhalt = JSON.parse(await datei.text());
    const neue = (Array.isArray(inhalt) ? inhalt : inhalt.eintraege).map(migrieren)
      .filter(e => e && KATEGORIEN.some(k => k.id === e.kategorie) && e.minuten > 0);
    const vorhandene = eintraegeLaden();
    const ids = new Set(vorhandene.map(e => e.id));
    const hinzu = neue.filter(e => !ids.has(e.id));
    eintraegeSpeichern([...vorhandene, ...hinzu]);
    toast(`${hinzu.length} Einträge importiert`);
  } catch {
    toast("Die Datei konnte nicht gelesen werden");
  }
  ereignis.target.value = "";
});

$("alles-loeschen").addEventListener("click", () => {
  if (eintraegeLaden().length === 0) return toast("Es gibt keine Einträge");
  if (confirm("Wirklich ALLE Einträge löschen? Das kann nicht rückgängig gemacht werden.")) {
    eintraegeSpeichern([]);
    toast("Alle Einträge gelöscht");
  }
});

// ---------- 11. Zeit nachtragen (Fenster über dem "+") ----------

const sheet = { kategorie: null, minuten: 60 };

$("plus-knopf").addEventListener("click", () => sheetOeffnen());

function sheetOeffnen(kategorieId = null) {
  sheet.kategorie = kategorieId;
  sheet.minuten = 60;
  $("sheet-datum").value = heute();
  $("sheet-notiz").value = "";
  $("sheet-fehler").textContent = "";
  $("sheet-kategorien").innerHTML = KATEGORIEN.map(k => `
    <button type="button" data-kat="${k.id}" style="--hell:${k.hell}" aria-pressed="${k.id === kategorieId}">
      ${symbol(k.id)}${k.name === "Kinderbetreuung" ? "Kinder" : k.name}
    </button>`).join("");
  sheetAnzeige();
  $("sheet").hidden = false;
  $("sheet-hintergrund").hidden = false;
  document.body.style.overflow = "hidden";
}

function sheetSchliessen() {
  $("sheet").hidden = true;
  $("sheet-hintergrund").hidden = true;
  document.body.style.overflow = "";
}
$("sheet-schliessen").addEventListener("click", sheetSchliessen);
$("sheet-hintergrund").addEventListener("click", sheetSchliessen);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("sheet").hidden) sheetSchliessen(); });

function sheetAnzeige() {
  $("dauer-anzeige").textContent = hm(sheet.minuten);
  $("sheet-notiz-label").textContent = sheet.kategorie === "sonstiges" ? "Was genau?" : "Notiz (optional)";
}

$("sheet-kategorien").addEventListener("click", ereignis => {
  const knopf = ereignis.target.closest("[data-kat]");
  if (!knopf) return;
  sheet.kategorie = knopf.dataset.kat;
  $("sheet-kategorien").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === knopf)));
  $("sheet-fehler").textContent = "";
  sheetAnzeige();
});

// 15-Minuten-Schritte, zwischen 0:15 h und 16:00 h
$("minus").addEventListener("click", () => { sheet.minuten = Math.max(15, sheet.minuten - 15); sheetAnzeige(); });
$("plus").addEventListener("click", () => { sheet.minuten = Math.min(960, sheet.minuten + 15); sheetAnzeige(); });

$("sheet-speichern").addEventListener("click", () => {
  if (!sheet.kategorie) { $("sheet-fehler").textContent = "Wähle aus, was du gemacht hast."; return; }
  if (!$("sheet-datum").value) { $("sheet-fehler").textContent = "Wähle ein Datum aus."; return; }
  if ($("sheet-datum").value > heute()) { $("sheet-fehler").textContent = "Das Datum liegt in der Zukunft."; return; }
  eintragHinzufuegen(sheet.kategorie, sheet.minuten, $("sheet-datum").value, $("sheet-notiz").value.trim());
  sheetSchliessen();
  toast(`${kategorie(sheet.kategorie).name}: ${hm(sheet.minuten)} gespeichert`);
  zeichne();
});

// ---------- Toast ----------

let toastTimer;
function toast(text) {
  const el = $("toast");
  el.textContent = text;
  el.classList.add("sichtbar");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("sichtbar"), 2200);
}

// ---------- 12. Start der App ----------

if (!localStorage.getItem(SPEICHER.willkommen)) zeige("willkommen");
else if (timerLaden()) zeige("timer");      // Läuft noch eine Messung? Direkt dorthin.
else zeige("home");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
