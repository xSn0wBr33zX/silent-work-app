/* =========================================================
   Stille Arbeit – die ganze Logik der App
   Alles läuft lokal im Browser. Gespeichert wird im localStorage.
   ========================================================= */

// ---------- 1. Einstellungen & Hilfsfunktionen ----------

const SPEICHER_EINTRAEGE = "stilleArbeit.eintraege";
const SPEICHER_SATZ = "stilleArbeit.standardSatz";
const STANDARD_SATZ = 9;

// Farben für das Kuchendiagramm (wie Buntstifte)
const FARBEN = ["#1E3A8A", "#2F9E6E", "#F2B705", "#D94B6A", "#6C5CE7", "#2BB0C8", "#F08A24", "#8A6B4E"];

// Zahlen deutsch formatieren: 1234.5 -> "1.234,50 €"
const euroFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const zahlFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });

function euro(betrag) { return euroFormat.format(betrag); }
function zahl(wert) { return zahlFormat.format(wert); }

// "1,5" oder "1.5" -> 1.5  (NaN, wenn keine Zahl)
function zahlLesen(text) {
  return parseFloat(String(text).trim().replace(",", "."));
}

// Schützt vor kaputtem HTML, wenn jemand z. B. "<b>" als Tätigkeit eintippt
function sicher(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function heuteAlsText() {
  // Format für <input type="date">: JJJJ-MM-TT
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const tt = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${tt}`;
}

function datumSchoen(isoDatum) {
  const [j, m, t] = isoDatum.split("-");
  return `${t}.${m}.${j}`;
}

// ---------- 2. Speichern & Laden ----------

function eintraegeLaden() {
  try {
    return JSON.parse(localStorage.getItem(SPEICHER_EINTRAEGE)) || [];
  } catch {
    return [];
  }
}

function eintraegeSpeichern(liste) {
  localStorage.setItem(SPEICHER_EINTRAEGE, JSON.stringify(liste));
}

function standardSatzLaden() {
  const wert = zahlLesen(localStorage.getItem(SPEICHER_SATZ));
  return isNaN(wert) ? STANDARD_SATZ : wert;
}

// ---------- 3. Berechnungen ----------

// Betrag eines Eintrags. Der Stundensatz wird PRO EINTRAG gespeichert,
// damit alte Einträge richtig bleiben, wenn du den Satz später änderst.
function betrag(eintrag) {
  return eintrag.stunden * eintrag.satz;
}

// Fasst alle Einträge nach Tätigkeit zusammen:
// [{ name: "Bad putzen", stunden: 3, euro: 27 }, ...]
function nachTaetigkeit(eintraege) {
  const gruppen = {};
  for (const e of eintraege) {
    const schluessel = e.taetigkeit.toLowerCase();
    if (!gruppen[schluessel]) {
      gruppen[schluessel] = { name: e.taetigkeit, stunden: 0, euro: 0 };
    }
    gruppen[schluessel].stunden += e.stunden;
    gruppen[schluessel].euro += betrag(e);
  }
  return Object.values(gruppen);
}

// ---------- 4. Navigation zwischen den Reitern ----------

function zeigeReiter(name) {
  document.querySelectorAll(".ansicht").forEach(s => { s.hidden = s.id !== name; });
  document.querySelectorAll(".tabs button").forEach(b => {
    b.classList.toggle("aktiv", b.dataset.tab === name);
  });
  window.scrollTo(0, 0);
  allesAnzeigen();
}

document.querySelectorAll(".tabs button").forEach(knopf => {
  knopf.addEventListener("click", () => zeigeReiter(knopf.dataset.tab));
});
document.querySelectorAll("[data-gehe-zu]").forEach(knopf => {
  knopf.addEventListener("click", () => zeigeReiter(knopf.dataset.geheZu));
});

// ---------- 5. Start-Seite ----------

function startAnzeigen(eintraege) {
  const gesamtStunden = eintraege.reduce((s, e) => s + e.stunden, 0);
  const gesamtEuro = eintraege.reduce((s, e) => s + betrag(e), 0);

  document.getElementById("start-datum").textContent =
    new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  document.getElementById("summe-euro").textContent = euro(gesamtEuro);
  document.getElementById("summe-info").textContent = eintraege.length === 0
    ? "Noch keine Stunden eingetragen"
    : `${zahl(gesamtStunden)} Stunden in ${eintraege.length} ${eintraege.length === 1 ? "Eintrag" : "Einträgen"}`;

  // Die 5 neuesten Einträge
  const neueste = [...eintraege].sort((a, b) => b.datum.localeCompare(a.datum) || b.id - a.id).slice(0, 5);
  document.getElementById("letzte-liste").innerHTML = neueste.map(e => eintragHtml(e, false)).join("");
  document.getElementById("start-leer").hidden = eintraege.length > 0;
}

function eintragHtml(e, mitLoeschen) {
  return `
    <li>
      <div class="eintrag-text">
        <div class="eintrag-name">${sicher(e.taetigkeit)}</div>
        <div class="eintrag-detail">${datumSchoen(e.datum)} · ${zahl(e.stunden)} Std. × ${euro(e.satz)}</div>
      </div>
      <span class="eintrag-betrag">${euro(betrag(e))}</span>
      ${mitLoeschen ? `<button class="loeschen" data-id="${e.id}" aria-label="Eintrag löschen">×</button>` : ""}
    </li>`;
}

// ---------- 6. Eintragen-Seite ----------

const formular = document.getElementById("eintrag-formular");
const feldTaetigkeit = document.getElementById("feld-taetigkeit");
const feldStunden = document.getElementById("feld-stunden");
const feldSatz = document.getElementById("feld-satz");
const feldDatum = document.getElementById("feld-datum");
const fehler = document.getElementById("fehler");

function formularVorbereiten() {
  if (!feldSatz.value) feldSatz.value = zahl(standardSatzLaden());
  if (!feldDatum.value) feldDatum.value = heuteAlsText();
  vorschauAktualisieren();
}

// Zeigt live an, wie viel Geld der Eintrag bringt
function vorschauAktualisieren() {
  const stunden = zahlLesen(feldStunden.value);
  const satz = zahlLesen(feldSatz.value);
  const wert = (isNaN(stunden) || isNaN(satz)) ? 0 : stunden * satz;
  document.getElementById("vorschau").textContent = "= " + euro(wert);
}
feldStunden.addEventListener("input", vorschauAktualisieren);
feldSatz.addEventListener("input", vorschauAktualisieren);

// Vorschläge aus früheren Tätigkeiten (Chips zum Antippen)
function vorschlaegeAnzeigen(eintraege) {
  const namen = nachTaetigkeit(eintraege)
    .sort((a, b) => b.stunden - a.stunden)
    .map(g => g.name);

  document.getElementById("taetigkeiten-vorschlaege").innerHTML =
    namen.map(n => `<option value="${sicher(n)}">`).join("");

  document.getElementById("chips").innerHTML =
    namen.slice(0, 6).map(n => `<button type="button" class="chip">${sicher(n)}</button>`).join("");
}
document.getElementById("chips").addEventListener("click", ereignis => {
  if (ereignis.target.classList.contains("chip")) {
    feldTaetigkeit.value = ereignis.target.textContent;
    feldStunden.focus();
  }
});

formular.addEventListener("submit", ereignis => {
  ereignis.preventDefault(); // verhindert, dass die Seite neu lädt

  const taetigkeit = feldTaetigkeit.value.trim();
  const stunden = zahlLesen(feldStunden.value);
  const satz = zahlLesen(feldSatz.value);
  const datum = feldDatum.value;

  // Eingaben prüfen
  if (!taetigkeit) return fehlerZeigen("Trag ein, was du gemacht hast.", feldTaetigkeit);
  if (isNaN(stunden) || stunden <= 0) return fehlerZeigen("Gib die Stunden als Zahl größer 0 ein, z. B. 1,5.", feldStunden);
  if (stunden > 24) return fehlerZeigen("Mehr als 24 Stunden an einem Tag gehen nicht.", feldStunden);
  if (isNaN(satz) || satz < 0) return fehlerZeigen("Gib den Stundensatz als Zahl ein, z. B. 9.", feldSatz);
  if (!datum) return fehlerZeigen("Wähle ein Datum aus.", feldDatum);
  fehler.textContent = "";

  const eintraege = eintraegeLaden();
  eintraege.push({ id: Date.now(), taetigkeit, stunden, satz, datum });
  eintraegeSpeichern(eintraege);

  // Den zuletzt benutzten Satz merken wir uns als neuen Standard
  localStorage.setItem(SPEICHER_SATZ, String(satz));

  // Formular leeren (Satz und Datum bleiben stehen)
  feldTaetigkeit.value = "";
  feldStunden.value = "";
  feldTaetigkeit.blur();
  feldStunden.blur();
  vorschauAktualisieren();
  allesAnzeigen();
  toast("Eintrag gespeichert");
});

function fehlerZeigen(text, feld) {
  fehler.textContent = text;
  feld.focus();
}

// ---------- 7. Statistik-Seite ----------

let diagrammModus = "stunden"; // oder "euro"

document.querySelectorAll(".umschalter button").forEach(knopf => {
  knopf.addEventListener("click", () => {
    diagrammModus = knopf.dataset.modus;
    document.querySelectorAll(".umschalter button").forEach(b => b.classList.toggle("aktiv", b === knopf));
    statistikAnzeigen(eintraegeLaden());
  });
});

function statistikAnzeigen(eintraege) {
  const gruppen = nachTaetigkeit(eintraege).sort((a, b) => b[diagrammModus] - a[diagrammModus]);
  const gesamt = gruppen.reduce((s, g) => s + g[diagrammModus], 0);

  diagrammZeichnen(gruppen, gesamt);

  document.getElementById("mitte-wert").textContent =
    diagrammModus === "euro" ? euro(gesamt) : zahl(gesamt);
  document.getElementById("mitte-label").textContent =
    diagrammModus === "euro" ? "verdient" : "Stunden";

  document.getElementById("legende").innerHTML = gruppen.map((g, i) => `
    <li>
      <span class="punkt" style="background:${FARBEN[i % FARBEN.length]}"></span>
      <span class="legende-name">${sicher(g.name)}</span>
      <span class="legende-wert">
        ${zahl(g.stunden)} Std. · ${euro(g.euro)}
        <span class="legende-prozent">${zahl(gesamt ? g[diagrammModus] / gesamt * 100 : 0)} %</span>
      </span>
    </li>`).join("");

  document.getElementById("statistik-leer").hidden = eintraege.length > 0;

  const sortiert = [...eintraege].sort((a, b) => b.datum.localeCompare(a.datum) || b.id - a.id);
  document.getElementById("alle-liste").innerHTML = sortiert.map(e => eintragHtml(e, true)).join("");
}

/*
  So funktioniert das Kuchendiagramm (eigentlich ein "Donut"):
  Jedes Stück ist ein Kreis mit dickem Rand (stroke). Mit stroke-dasharray
  sagen wir: "Zeichne nur X Pixel vom Rand, dann Lücke." Mit stroke-dashoffset
  schieben wir jedes Stück an die Stelle, wo das vorherige aufgehört hat.
*/
function diagrammZeichnen(gruppen, gesamt) {
  const svg = document.getElementById("diagramm");
  const radius = 80;
  const umfang = 2 * Math.PI * radius;

  // Grauer Hintergrundring (sichtbar, wenn noch nichts eingetragen ist)
  let html = `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="var(--linie)" stroke-width="32"/>`;

  let bisher = 0;
  gruppen.forEach((g, i) => {
    const laenge = gesamt ? (g[diagrammModus] / gesamt) * umfang : 0;
    html += `<circle cx="100" cy="100" r="${radius}" fill="none"
      stroke="${FARBEN[i % FARBEN.length]}" stroke-width="32"
      stroke-dasharray="${laenge} ${umfang - laenge}"
      stroke-dashoffset="${-bisher}"
      transform="rotate(-90 100 100)"/>`;
    bisher += laenge;
  });
  svg.innerHTML = html;
}

// Löschen einzelner Einträge
document.getElementById("alle-liste").addEventListener("click", ereignis => {
  const knopf = ereignis.target.closest(".loeschen");
  if (!knopf) return;
  const id = Number(knopf.dataset.id);
  const eintraege = eintraegeLaden();
  const eintrag = eintraege.find(e => e.id === id);
  if (eintrag && confirm(`„${eintrag.taetigkeit}“ vom ${datumSchoen(eintrag.datum)} löschen?`)) {
    eintraegeSpeichern(eintraege.filter(e => e.id !== id));
    allesAnzeigen();
    toast("Eintrag gelöscht");
  }
});

document.getElementById("alles-loeschen").addEventListener("click", () => {
  if (eintraegeLaden().length === 0) return toast("Es gibt keine Einträge");
  if (confirm("Wirklich ALLE Einträge löschen? Das kann nicht rückgängig gemacht werden.")) {
    eintraegeSpeichern([]);
    allesAnzeigen();
    toast("Alle Einträge gelöscht");
  }
});

// ---------- 8. Export & Import (Datensicherung) ----------

document.getElementById("exportieren").addEventListener("click", async () => {
  const daten = JSON.stringify({ app: "stille-arbeit", version: 1, eintraege: eintraegeLaden() }, null, 2);
  const dateiname = `stille-arbeit-${heuteAlsText()}.json`;
  const datei = new File([daten], dateiname, { type: "application/json" });

  // Auf dem iPhone: Teilen-Menü öffnen (in Dateien sichern, AirDrop, Mail ...)
  if (navigator.canShare && navigator.canShare({ files: [datei] })) {
    try {
      await navigator.share({ files: [datei], title: "Stille Arbeit – Sicherung" });
    } catch { /* Teilen abgebrochen, ist okay */ }
    return;
  }

  // Am Computer: normaler Download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(datei);
  link.download = dateiname;
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("import-datei").addEventListener("change", async ereignis => {
  const datei = ereignis.target.files[0];
  if (!datei) return;
  try {
    const inhalt = JSON.parse(await datei.text());
    const neue = Array.isArray(inhalt) ? inhalt : inhalt.eintraege;
    if (!Array.isArray(neue)) throw new Error("Falsches Format");

    // Nur gültige Einträge übernehmen und doppelte (gleiche id) überspringen
    const vorhandene = eintraegeLaden();
    const ids = new Set(vorhandene.map(e => e.id));
    const gueltige = neue.filter(e =>
      e && typeof e.taetigkeit === "string" && typeof e.stunden === "number" &&
      typeof e.satz === "number" && typeof e.datum === "string" && !ids.has(e.id));

    eintraegeSpeichern([...vorhandene, ...gueltige]);
    allesAnzeigen();
    toast(`${gueltige.length} Einträge importiert`);
  } catch {
    toast("Die Datei konnte nicht gelesen werden");
  }
  ereignis.target.value = ""; // damit dieselbe Datei nochmal gewählt werden kann
});

// ---------- 9. Toast (kurze Meldung unten) ----------

let toastTimer;
function toast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.classList.add("sichtbar");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("sichtbar"), 2000);
}

// ---------- 10. Alles aktualisieren & starten ----------

function allesAnzeigen() {
  const eintraege = eintraegeLaden();
  startAnzeigen(eintraege);
  vorschlaegeAnzeigen(eintraege);
  statistikAnzeigen(eintraege);
  formularVorbereiten();
}

allesAnzeigen();

// Service Worker registrieren: damit läuft die App auch ohne Internet
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
