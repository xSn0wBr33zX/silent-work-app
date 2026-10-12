# CARE+ – Unsichtbare Arbeit sichtbar machen

Web-App (PWA) zum Erfassen unbezahlter Care-Arbeit. Alle Daten bleiben lokal auf dem Handy.

## Seiten

| Seite | Inhalt |
|---|---|
| Willkommen | Nur beim ersten Start, danach Land wählen |
| Home | 8 Kacheln – Antippen startet die Zeitmessung |
| Timer | Läuft weiter, auch wenn die App geschlossen wird |
| Aufgaben | Heute / Woche / Monat, aufklappbar mit Einzeleinträgen |
| Statistik | Übersicht (Donut), Wert (in Landeswährung), Vergleich (Frauen/Männer/Ich) |
| Mehr | Fakten, Land, Datensicherung |
| „+“ unten | Zeit nachträglich eintragen |

## Dateien

| Datei | Wofür |
|---|---|
| `index.html` | Aufbau aller Seiten |
| `style.css` | Aussehen |
| `app.js` | Logik – ganz oben stehen alle Zahlen (Länder, Kategorien, Fakten) |
| `manifest.json` | Name, Icon, Farben |
| `sw.js` | Offline-Funktion |
| `icons/` | App-Icons |

## Zahlen anpassen

Alle Werte stehen oben in `app.js` im Objekt `LAENDER`. Nach jeder Änderung in `sw.js`
die Versionsnummer erhöhen (`care-plus-v3` → `care-plus-v4`).

**Stundensatz (Mindestlohn für Haushaltsarbeit):**

| Land | Satz | Grundlage |
|---|---|---|
| Schweiz | 19,95 CHF | NAV Hauswirtschaft (Bund), ungelernt, 2026 (gilt nicht in Genf) |
| Italien | 7,01 € | CCNL Lavoro domestico, Stufe B, 2026 |
| Österreich | 12,23 € | Mindestlohntarif für im Haushalt Beschäftigte, stundenweise, 2026 |
| Schweden | 171,46 kr | Kollektivvertrag Reinigung (Fastighets/Almega) |

**Unbezahlte Arbeit pro Tag (Vergleich):**

| Land | Frauen | Männer | Quelle |
|---|---|---|---|
| Schweiz | 4:06 h | 2:44 h | BFS 2020 (28,7 bzw. 19,1 Std./Woche ÷ 7) |
| Italien | 5:06 h | 2:11 h | OECD Time Use (Männer aus +134 % berechnet) |
| Österreich | 3:58 h | 2:26 h | Statistik Austria 2021/22 (ab 10 Jahren) |
| Schweden | 3:40 h | 2:51 h | OECD Time Use |

## Veröffentlichen & installieren

1. Alle Dateien ins GitHub-Repo hochladen (Ordner `icons/` mit).
2. Settings → Pages → Branch `main`, Ordner `/ (root)`.
3. Auf dem iPhone in **Safari** öffnen → Teilen → **Zum Home-Bildschirm**.

Lokal testen: `python3 -m http.server 8000` und `http://localhost:8000` öffnen.
