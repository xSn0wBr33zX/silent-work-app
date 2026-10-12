# Stille Arbeit

Kleine Web-App (PWA) zum Eintragen von Arbeitsstunden mit Statistik.
Alle Daten bleiben lokal auf dem Handy.

## Dateien

| Datei | Wofür |
|---|---|
| `index.html` | Aufbau der Seiten (Start, Eintragen, Statistik) |
| `style.css` | Aussehen, Farben, Dark Mode |
| `app.js` | Logik: speichern, rechnen, Diagramm, Export/Import |
| `manifest.json` | Name, Icon, Farben: macht die Seite installierbar |
| `sw.js` | Service Worker: App startet auch ohne Internet |
| `icons/` | App-Icons |

## Lokal testen

Im Projektordner:

```
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000` öffnen.
(Einfach `index.html` doppelklicken reicht nicht, weil der Service Worker einen Server braucht.)

## Auf GitHub Pages veröffentlichen

1. Alle Dateien ins Repository hochladen (die Ordnerstruktur beibehalten).
2. Im Repo: **Settings → Pages → Source: "Deploy from a branch"**, Branch `main`, Ordner `/ (root)`, speichern.
3. Nach 1–2 Minuten ist die App erreichbar unter
   `https://<dein-github-name>.github.io/<repo-name>/`

## Auf dem iPhone installieren

1. Link in **Safari** öffnen.
2. Unten auf das **Teilen-Symbol** tippen (Quadrat mit Pfeil nach oben).
3. **„Zum Home-Bildschirm“** wählen → **Hinzufügen**.

## Updates verteilen

1. Änderung machen und hochladen.
2. In `sw.js` die Versionsnummer erhöhen: `stille-arbeit-v1` → `stille-arbeit-v2`.
3. Die App auf dem Handy einmal schließen und neu öffnen.
   Die Einträge bleiben dabei erhalten.
