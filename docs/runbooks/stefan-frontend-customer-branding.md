# Runbook: Frontend-Branding pro Kunde (Stefan)

**Zweck:** Dieser Leitfaden führt dich durch die Anpassung des Dashboards an das Branding eines neuen Kunden — Unternehmensname, Primärfarbe, Seitentitel, optionales Favicon. Am Ende hat der Kunde sein eigenes Dashboard mit seinem Namen und seinen Farben.

**Voraussetzung:** Das Runbook „VPS + Kundeneinrichtung" (RB-01) muss vollständig abgeschlossen sein. Der VPS des Kunden läuft bereits, und der Kunde kann sich einloggen. Komm hierher zurück, wenn das erledigt ist.

**Geschätzter Zeitaufwand:** 2–3 Stunden beim ersten Kunden, ~45 Minuten ab dem dritten.

---

## Wenn das hier dein erster Kunde ist

Lies das gesamte Runbook **einmal komplett durch**, bevor du anfängst. Mach dir Notizen. Beim ersten Durchlauf wirst du in Abschnitt 1 etwas Zeit für die einmalige Einrichtung einplanen müssen — das passiert nur einmal.

Bei jedem Schritt: lies, was steht — paste den Befehl — prüfe das Ergebnis — dann erst weiter. Nicht zwei Schritte auf einmal.

Ab dem zweiten Kunden überspringst du Abschnitt 1 komplett. Ab dem dritten sitzt der Ablauf, und du brauchst keine 45 Minuten mehr.

---

## Wie du dieses Runbook benutzt

Dieses Runbook setzt voraus, dass du Claude (oder einen anderen KI-Assistenten) während der Ausführung benutzt. Die technischen Details sind für die KI gedacht; du folgst den Abschnitten und fragst Claude, wenn etwas unklar ist. **Kopiere bei Unklarheiten den ganzen Abschnitt in Claude.** Du musst kein Entwickler sein.

---

## 1. Einmalige Einrichtung (nur beim ersten Mal, nicht pro Kunde)

Dieser Abschnitt richtet deinen Arbeitsrechner ein. Du machst das einmal — danach springst du bei jedem neuen Kunden direkt zu Abschnitt 2.

### 1.1 GitHub-Zugang beantragen

Du brauchst Schreibzugang zu zwei GitHub-Repositories, bevor du anfangen kannst. Bitte Lukas, dich als Mitarbeiter hinzuzufügen:

- `Lukasbrujula/siteware-frontend`
- `Lukasbrujula/siteflow`

Wenn Lukas das erledigt hat, bekommst du eine Einladungs-E-Mail von GitHub. Nimm sie an. Danach weiter mit 1.2.

### 1.2 Node.js installieren

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Ich bin auf [macOS / Windows]. Bitte führe mich Schritt für Schritt durch die Node.js-Installation. Sag mir genau, was ich tun muss."

Node.js ist das Programm, das später den Build-Befehl ausführt. Du brauchst Version 20 oder neuer.

**Prüfen, ob Node.js schon installiert ist:**

Öffne ein Terminal (macOS: `Terminal` in Spotlight suchen; Windows: `cmd` oder `PowerShell` im Startmenü) und tippe:

```bash
node --version
```

Wenn die Ausgabe `v20.x.x` oder höher zeigt — fertig, weiter mit 1.3.

Falls `command not found` oder eine Version unter 20 erscheint:

**macOS** — zwei Möglichkeiten:

Option A (empfohlen, wenn Homebrew installiert ist):
```bash
brew install node
```

Option B (ohne Homebrew): Lade den Installer von `https://nodejs.org` herunter. Wähle „LTS". Führe die `.pkg`-Datei aus und folge dem Assistenten.

**Windows:** Lade den Installer von `https://nodejs.org` herunter. Wähle „LTS". Führe die `.msi`-Datei aus und folge dem Assistenten. Aktiviere im Installer „Add to PATH".

Nach der Installation prüfen:

```bash
node --version
npm --version
```

Erwartet: beide Befehle zeigen eine Versionsnummer (kein Fehler).

### 1.3 Git installieren und konfigurieren

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Ich bin auf [macOS / Windows]. Bitte führe mich Schritt für Schritt durch. Hier sind meine Werte: Name = [dein Name], E-Mail = [deine E-Mail]. Sag mir genau, was zu tun ist."

Git ist das Programm, das Dateien zwischen deinem Rechner und GitHub synchronisiert.

Prüfen, ob Git schon installiert ist:

```bash
git --version
```

Falls `command not found`: **macOS** → `brew install git` oder macOS fragt automatisch beim ersten `git`-Befehl nach der Installation. **Windows** → Installer von `https://git-scm.com` herunterladen und ausführen.

Git mit deinen Daten konfigurieren (einmalig, egal ob schon installiert):

```bash
git config --global user.name "Stefan [Nachname]"
git config --global user.email "stefan@sugarpool.de"
```

Ersetze Name und E-Mail durch deine echten Werte.

Damit Git dein GitHub-Passwort nicht ständig neu abfragt, speichere deine Zugangsdaten:

```bash
git config --global credential.helper store
```

Beim nächsten `git push` wirst du einmalig nach Benutzername und Passwort gefragt. Danach sind sie gespeichert. **Wichtig:** Als Passwort gibst du kein GitHub-Passwort ein, sondern ein „Personal Access Token" (PAT). Bitte Lukas, dir eines zu erstellen, falls du noch keines hast.

### 1.4 Arbeitsordner anlegen und Repos klonen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Ich bin auf [macOS / Windows]."

Lege einen zentralen Arbeitsordner an. Alle SiteFlow-Dateien kommen dorthin — übersichtlicher als verstreute Ordner auf dem Desktop.

```bash
mkdir -p ~/SiteFlow-Kunden
cd ~/SiteFlow-Kunden
```

Jetzt die zwei Repositories klonen (einmalig herunterladen):

```bash
# Frontend-Quellcode
git clone https://github.com/Lukasbrujula/siteware-frontend.git

# Backend-Repository (wird später für den Kopier-Schritt gebraucht)
git clone https://github.com/Lukasbrujula/siteflow.git
```

Prüfen, ob beide Ordner da sind:

```bash
ls ~/SiteFlow-Kunden/
```

Erwartet: zwei Ordner — `siteware-frontend` und `siteflow`.

### 1.5 Frontend-Abhängigkeiten installieren

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Zeig mir genau, was ich sehen sollte."

Dieser Schritt lädt alle Programme herunter, die `npm run build` braucht. Dauert 2–4 Minuten.

```bash
cd ~/SiteFlow-Kunden/siteware-frontend
npm install
```

Erwartet: viele Zeilen Output, am Ende so etwas wie `added 123 packages`. Falls du `WARN`-Zeilen siehst — kein Problem, das ist normal. Falls du `ERR!` siehst — kopiere die letzten 10 Zeilen in Claude.

Die einmalige Einrichtung ist damit abgeschlossen. Ab jetzt starte bei Schritt 2.

---

## 2. Was du vom Kunden brauchst

Fordere diese Informationen **vor dem Termin** an.

| Was | Beispiel | Wozu |
|-----|---------|------|
| Unternehmensname (genaue Schreibweise) | `Musterfirma GmbH` | Erscheint im Header und auf der Login-Seite |
| Primärfarbe (Hex-Code oder RGB) | `#2D6A4F` oder `rgb(45,106,79)` | Farbe aller Schaltflächen und Akzente |
| Favicon-Datei (optional) | `logo.ico` oder `logo.png` | Icon im Browser-Tab |

**Zur Primärfarbe:** Falls der Kunde keine genaue Angabe machen kann, frage nach der Farbe der Website oder des Logos. Mach einen Screenshot und schreibe in Claude: „Welche Hex-Farbe hat die Primärfarbe in diesem Bild?" und lade das Bild hoch.

**Zum Favicon:** Das ist das kleine Icon, das im Browser-Tab links neben dem Seitentitel erscheint. Falls der Kunde keine Datei hat — skip Abschnitt 3.6, der Kunde sieht dann ein leeres Icon im Tab, das ist kein Fehler.

---

## 3. Die 5 Dateien anpassen

Du änderst 5 Dateien. Alle liegen im Ordner `~/SiteFlow-Kunden/siteware-frontend/`. Führe alle Änderungen **vor** dem Build aus — keinen Build zwischendurch starten.

**Vorbereitung — Werte vorab eintragen:**

Öffne einen Texteditor und notiere diese Werte, bevor du anfängst:

| Platzhalter | Mein Wert für diesen Kunden |
|-------------|----------------------------|
| `[KUNDENNAME]` | z. B. `Musterfirma GmbH` |
| `[FARBE-HSL]` | wird in Abschnitt 3.5 ermittelt |

Tipp: Öffne die Dateien in VS Code (kostenlos auf `https://code.visualstudio.com`). Mit `Cmd+G` (macOS) oder `Ctrl+G` (Windows) springst du direkt zu einer Zeilennummer.

---

### 3.1 Seitentitel — `index.html`

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Mein Kundenname ist: [NAME]. Sag mir genau, was zu tun ist."

**Datei:** `~/SiteFlow-Kunden/siteware-frontend/index.html`
**Zeile:** 6

Öffne die Datei in einem Texteditor. Zeile 6 sieht so aus:

```html
    <title>Siteware Email Dashboard</title>
```

Ersetze sie durch:

```html
    <title>[KUNDENNAME] E-Mail Dashboard</title>
```

**Beispiel:**
```html
    <title>Musterfirma GmbH E-Mail Dashboard</title>
```

**Was du danach im Browser siehst:** Im Browser-Tab steht nicht mehr „Siteware Email Dashboard", sondern der Name des Kunden.

Speichern. Weiter mit 3.2.

---

### 3.2 Header-Name — `DashboardHeader.tsx`

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Mein Kundenname ist: [NAME]. Sag mir genau, was zu tun ist."

**Datei:** `~/SiteFlow-Kunden/siteware-frontend/src/components/layout/DashboardHeader.tsx`
**Zeile:** 47

Öffne die Datei. Zeile 47 sieht so aus:

```
              siteware
```

Ersetze `siteware` durch den Kundennamen:

```
              [KUNDENNAME]
```

**Beispiel:**
```
              Musterfirma GmbH
```

**Hinweis zur Schreibweise:** Die Datei enthält in Zeile 42 die CSS-Klasse `lowercase` — das bedeutet, das Dashboard zeigt den Namen immer in Kleinbuchstaben an, egal wie du ihn hier schreibst. Falls der Kunde ausdrücklich eine bestimmte Schreibweise (z. B. Großbuchstaben) möchte, schreibe Lukas kurz. Das ist eine kleine Code-Änderung, die in 2 Minuten erledigt ist.

Zeile 49 enthält `E-Mail Automation` (Unterzeile unter dem Namen). Das kannst du so lassen — es macht keinen Unterschied für den Kunden.

Speichern. Weiter mit 3.3.

---

### 3.3 Login-Seite-Name — `LoginView.tsx`

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Mein Kundenname ist: [NAME]. Sag mir genau, was zu tun ist."

**Datei:** `~/SiteFlow-Kunden/siteware-frontend/src/views/LoginView.tsx`
**Zeile:** 96

Öffne die Datei. Zeile 96 sieht so aus:

```
            siteware
```

Ersetze `siteware` durch den Kundennamen:

```
            [KUNDENNAME]
```

**Beispiel:**
```
            Musterfirma GmbH
```

Dieselbe `lowercase`-Anmerkung wie in 3.2 gilt hier ebenfalls.

Zeile 99 enthält `E-Mail Automation` — kannst du so lassen.

Speichern. Weiter mit 3.4.

---

### 3.4 Interner Namenskonstante — `constants.ts`

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Mein Kundenname ist: [NAME]. Sag mir genau, was zu tun ist."

**Datei:** `~/SiteFlow-Kunden/siteware-frontend/src/lib/constants.ts`
**Zeile:** 1

Öffne die Datei. Sie enthält genau eine Zeile:

```typescript
export const APP_NAME = "siteware" as const;
```

Ersetze `"siteware"` durch den Kundennamen in Anführungszeichen:

```typescript
export const APP_NAME = "[KUNDENNAME]" as const;
```

**Beispiel:**
```typescript
export const APP_NAME = "Musterfirma GmbH" as const;
```

Speichern. Weiter mit 3.5.

---

### 3.5 Primärfarbe — `index.css`

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Die Farbe des Kunden ist: [FARBE]. Sag mir genau, welche Werte ich in Zeile 11 und Zeile 23 einsetzen muss."

**Datei:** `~/SiteFlow-Kunden/siteware-frontend/src/index.css`
**Zeilen:** 11 und 23

Die Farbe muss im HSL-Format angegeben werden. Falls du nur einen Hex-Code hast (z. B. `#2D6A4F`), frage Claude:

> „Konvertiere `#2D6A4F` ins HSL-Format. Gib mir genau diese zwei CSS-Zeilen für die SiteFlow-Konfiguration — identischer Wert für beide: `--color-primary: hsl(...);` und `--color-ring: hsl(...);`"

Claude gibt dir dann die fertigen Zeilen zum Einsetzen.

Öffne die Datei. Zeile 11 sieht so aus:

```css
  --color-primary: hsl(293 80% 48%);
```

Zeile 23 sieht so aus:

```css
  --color-ring: hsl(293 80% 48%);
```

Ersetze **beide Zeilen** mit den Werten aus der Claude-Antwort. Beide müssen denselben HSL-Wert haben.

**Beispiel (Grün `#2D6A4F`):**
```css
  --color-primary: hsl(153 41% 30%);
```
```css
  --color-ring: hsl(153 41% 30%);
```

Speichern. Weiter mit 3.6 (oder zu Abschnitt 4 wenn kein Favicon).

---

### 3.6 Favicon hinzufügen (optional)

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Ich habe eine Favicon-Datei namens [DATEINAME]. Sag mir genau, was zu tun ist."

Falls der Kunde kein Favicon möchte oder keine Datei geliefert hat: überspringe diesen Abschnitt.

**Was du brauchst:** Eine Datei im Format `.ico`, `.png` oder `.svg`. Optimale Größe: 32×32 Pixel oder 64×64 Pixel. Falls der Kunde ein PNG-Logo hat, kannst du Claude fragen: „Wie konvertiere ich ein PNG in eine .ico-Datei auf macOS / Windows?"

**Schritt 1 — Favicon-Datei in das Repo kopieren:**

Benenne die Datei um zu `favicon.ico` (für `.ico`-Dateien) oder `favicon.png` (für PNG). Kopiere sie in den Ordner:

```
~/SiteFlow-Kunden/siteware-frontend/
```

(direkt ins Hauptverzeichnis des Repos, nicht in einen Unterordner)

**Schritt 2 — `index.html` ergänzen:**

Öffne `~/SiteFlow-Kunden/siteware-frontend/index.html`. Nach Zeile 4 (`<meta name="viewport" ...>`) eine neue Zeile einfügen:

Für `.ico`-Datei:
```html
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
```

Für `.png`-Datei:
```html
    <link rel="icon" href="/favicon.png" type="image/png" />
```

Die Datei sieht danach so aus:

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <title>[KUNDENNAME] E-Mail Dashboard</title>
  </head>
  ...
```

Speichern. Weiter mit Abschnitt 4.

---

## 4. Build ausführen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch den Build-Schritt. Zeig mir, was ich sehen sollte."

Der Build kompiliert alle deine Änderungen in eine fertige Website-Datei. Dauert 1–2 Minuten.

```bash
cd ~/SiteFlow-Kunden/siteware-frontend
npm run build
```

**Was du siehst, wenn es geklappt hat:**

```
✓ 352 modules transformed.
dist/index.html          0.46 kB │ gzip:  0.30 kB
dist/assets/index-XXX.js  312.45 kB │ gzip: 94.23 kB
dist/assets/index-XXX.css   8.12 kB │ gzip:  2.41 kB
✓ built in 3.21s
```

Die genauen Zahlen und Hash-Werte (`XXX`) werden bei dir anders aussehen — das ist normal. Entscheidend ist `✓ built in`. Falls stattdessen Fehler erscheinen, lies Abschnitt 9.1.

Prüfen, ob der `dist/`-Ordner entstanden ist:

```bash
ls ~/SiteFlow-Kunden/siteware-frontend/dist/
```

Erwartet: `assets/` Ordner und `index.html`.

---

## 5. Bundle ins Backend-Repo kopieren

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Das fertige Bundle (`dist/`) muss in das Backend-Repository kopiert werden, das der VPS beim Deployment herunterlädt.

**Schritt 1 — Sicherstellen, dass das siteflow-Repo aktuell ist:**

```bash
cd ~/SiteFlow-Kunden/siteflow
git pull origin main
```

Erwartet: `Already up to date.` oder Meldungen über heruntergeladene Änderungen.

**Schritt 2 — Altes Bundle löschen:**

```bash
rm -rf ~/SiteFlow-Kunden/siteflow/public/assets
rm -f ~/SiteFlow-Kunden/siteflow/public/index.html
```

Prüfen, dass der Ordner jetzt leer ist:

```bash
ls ~/SiteFlow-Kunden/siteflow/public/
```

Erwartet: leere Ausgabe oder nur der `public/`-Ordner selbst.

**Schritt 3 — Neues Bundle kopieren:**

```bash
cp -r ~/SiteFlow-Kunden/siteware-frontend/dist/. ~/SiteFlow-Kunden/siteflow/public/
```

Prüfen:

```bash
ls ~/SiteFlow-Kunden/siteflow/public/
```

Erwartet: `assets/` und `index.html`.

**Schritt 4 — Committen und pushen:**

Ersetze `[KUNDENNAME]` durch den echten Namen des Kunden.

```bash
cd ~/SiteFlow-Kunden/siteflow
git add public/
git commit -m "feat: Branding [KUNDENNAME]"
git push origin main
```

Erwartet: Am Ende `main -> main` in der Ausgabe.

Falls `git push` nach Benutzername und Passwort fragt: Benutzername ist dein GitHub-Benutzername, Passwort ist dein GitHub Personal Access Token (nicht dein GitHub-Passwort). Falls du kein PAT hast, frage Lukas. Nach der ersten erfolgreichen Eingabe werden die Daten gespeichert.

---

## 6. Auf dem Kunden-VPS deployen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch. Hier ist die Ausgabe, die ich sehe: [Ausgabe einfügen]. Was soll ich tun?"

Jetzt holst du die Änderungen auf den VPS des Kunden.

Öffne das **Hostinger-Browser-Terminal** des Kunden-VPS (wie in RB-01 Abschnitt 2.2). Melde dich als `root` an.

```bash
cd /opt/siteflow
bash update.sh
```

Das Skript macht automatisch: neuesten Code herunterladen → Abhängigkeiten prüfen → alle Dienste neu starten.

**Was du am Ende siehst:**

```
================================
 Update complete!
================================
```

Falls `Health: NOT OK` erscheint: lies Abschnitt 9.3.

Prüfen, dass alle Dienste laufen:

```bash
pm2 list
```

Erwartet: vier Prozesse, alle `online`:

```
┌────┬──────────┬─────────┐
│ id │ name     │ status  │
├────┼──────────┼─────────┤
│ 0  │ app      │ online  │
│ 1  │ poller   │ online  │
│ 2  │ workflow │ online  │
│ 3  │ jobs     │ online  │
└────┴──────────┴─────────┘
```

---

## 7. Verifizierung im Browser

Öffne die Dashboard-URL des Kunden (z. B. `https://email.musterfirma.de`) in einem Browser. Falls du noch in der gleichen Sitzung bist wie bei einem früheren Test: Shift+Reload (macOS: `Cmd+Shift+R`, Windows: `Ctrl+Shift+R`) oder Inkognito-Tab verwenden, damit der Cache keine alten Daten zeigt.

### 7.1 Branding prüfen

- [ ] Browser-Tab zeigt `[KUNDENNAME] E-Mail Dashboard`
- [ ] Login-Seite zeigt den Kundennamen unter dem Titelbereich
- [ ] Schaltfläche „Code anfordern" hat die Kundenfarbe (nicht das Standard-Lila)
- [ ] Nach dem Einloggen: Header oben links zeigt den Kundennamen
- [ ] Alle Schaltflächen und aktive Zustände haben die Kundenfarbe
- [ ] (Falls Favicon gesetzt) Browser-Tab zeigt das Favicon-Icon links neben dem Titel

### 7.2 Funktionstest

Führe den Funktionstest aus RB-01 Abschnitt 6 erneut durch — eine Test-E-Mail senden, warten, prüfen, ob sie im Dashboard erscheint. Das stellt sicher, dass das neue Bundle keine Funktion kaputt gemacht hat.

---

## 8. Übergabe an den Kunden

### 8.1 Dashboard-Zugang senden

Sende dem Kunden:
- Dashboard-URL: `https://email.musterfirma.de`
- Login-E-Mail: die Admin-E-Mail-Adresse
- Hinweis: Login erfolgt per Einmal-Code per E-Mail, kein Passwort notwendig

Vorlage:

```
Betreff: Ihr SiteFlow-Dashboard ist bereit

Guten Tag [ANSPRECHPARTNER],

Ihr E-Mail-Automation-Dashboard ist eingerichtet und erreichbar unter:

Dashboard: https://email.[kundendomain.de]
Login: [admin-email@kundendomain.de]

Der Login funktioniert ohne Passwort. Sie geben Ihre E-Mail-Adresse ein
und erhalten einen 6-stelligen Code per E-Mail. Diesen Code geben Sie
dann ein, und Sie sind eingeloggt.

Bei Fragen melden Sie sich gerne.

Mit freundlichen Grüßen
[Ihr Name]
```

### 8.2 Erster Login — was der Kunde sieht

Beim ersten Einloggen sieht der Kunde sofort die sechs Tabs. Erklärung für den Kunden:

| Tab | Was er enthält |
|-----|---------------|
| **Dringend** | Dringende E-Mails — KI-Entwurf bereit zum Genehmigen |
| **Sonstige** | Normale Anfragen — KI-Entwurf bereit zum Genehmigen |
| **Spam** | Erkannte Spam-E-Mails |
| **Werbung** | Werbemails und Newsletter |
| **Eskalation** | E-Mails, die manuelles Eingreifen brauchen |
| **Abmeldungen** | Abmelde-Anfragen |

Beim Genehmigen eines Entwurfs: Kunde klickt „Senden & Archivieren". Die E-Mail geht direkt aus dem Unternehmenspostfach raus — der Kunde sieht eine Kopie in seiner eigenen Mailbox.

---

## 9. Fehlerbehebung

### 9.1 `npm run build` schlägt fehl

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere die gesamte Ausgabe von `npm run build` in Claude und schreibe: „Ich baue das SiteFlow-Frontend-Bundle. Hier ist der Fehler. Was habe ich falsch gemacht, und wie behebe ich es?"

Symptom: Statt `✓ built in Xs` erscheint roter Text mit `error` oder `ERR`.

Häufigste Ursache: Ein Tippfehler in einer der 5 Dateien. Gehe zurück zu Abschnitt 3 und prüfe jede Datei nochmal. Besonders: fehlende oder zusätzliche Anführungszeichen, fehlendes Semikolon, falsche Schreibweise von `as const`.

Falls Claude den Fehler nicht lösen kann: Screenshots machen und Lukas direkt schreiben (Abschnitt 9.5).

### 9.2 Branding erscheint im Browser nicht

Symptom: Du hast deployt, aber das Dashboard zeigt noch den alten Namen oder die alte Farbe.

**Schritt 1 — Browser-Cache leeren:**

Inkognito-Fenster öffnen (macOS: `Cmd+Shift+N`, Windows: `Ctrl+Shift+N`) und die Dashboard-URL aufrufen. Erscheint das neue Branding? Falls ja — normaler Browser-Cache, kein Problem.

Falls auch im Inkognito-Fenster das alte Branding erscheint:

**Schritt 2 — Prüfen, ob der Push erfolgreich war:**

```bash
cd ~/SiteFlow-Kunden/siteflow
git log --oneline -3
```

Der neueste Commit sollte dein Branding-Commit sein (z. B. `feat: Branding Musterfirma GmbH`). Falls nicht — Abschnitt 5 Schritt 4 wiederholen.

**Schritt 3 — Prüfen, ob das Deployment auf dem VPS ankam:**

Im Hostinger-Terminal:

```bash
cd /opt/siteflow
git log --oneline -1
```

Erwartet: dein Branding-Commit erscheint. Falls nicht — `bash update.sh` erneut ausführen.

### 9.3 `bash update.sh` schlägt fehl

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier ist die Ausgabe von bash update.sh: [Ausgabe einfügen]. Sag mir genau, was ich tun soll."

Symptom: `update.sh` endet nicht mit `Update complete!`.

Prüfe den Fehler zuerst:

```bash
cd /opt/siteflow
git status
```

Falls `error: Your local changes would be overwritten by merge`:

```bash
git stash
bash update.sh
```

Falls `Authentication failed` beim `git pull`:

```bash
git remote -v
```

Zeige die Ausgabe in Claude und frage: „Was bedeutet dieser git-Fehler, und wie behebe ich ihn auf einem Ubuntu-Server?"

### 9.4 `pm2 list` zeigt einen Prozess als `errored`

Symptom: Nach `update.sh` ist ein Prozess nicht `online`.

```bash
pm2 logs app --lines 30 --nostream
```

Kopiere die letzten 20 Zeilen in Claude und schreibe: „Ein pm2-Prozess zeigt `errored` nach einem Frontend-Update auf einem SiteFlow-Server. Hier sind die Logs. Was ist das Problem?"

### 9.5 Wenn du wirklich feststeckst

Wenn du an einem Schritt mehr als 30 Minuten festhängst und Claude nicht weiterhilft: **mach Screenshots und schreib Lukas direkt.** Das ist nicht „aufgeben" — das ist effizientes Arbeiten.

Was du mitschicken solltest:
- Screenshot der Fehlermeldung
- Welcher Abschnitt des Runbooks (z. B. „Abschnitt 5, Schritt 4")
- Was du bereits versucht hast

---

## Schnell-Referenz: Alle Dateien auf einen Blick

Zum Nachschlagen wenn du den Ablauf schon kennst:

| Datei | Zeile | Was ändern |
|-------|-------|-----------|
| `index.html` | 6 | `<title>Siteware...` → `<title>[KUNDENNAME]...` |
| `src/components/layout/DashboardHeader.tsx` | 47 | `siteware` → `[KUNDENNAME]` |
| `src/views/LoginView.tsx` | 96 | `siteware` → `[KUNDENNAME]` |
| `src/lib/constants.ts` | 1 | `"siteware"` → `"[KUNDENNAME]"` |
| `src/index.css` | 11, 23 | `hsl(293 80% 48%)` → Kundenfarbe in HSL |
| `index.html` | `<head>` | (optional) `<link rel="icon" ...>` einfügen |

Build: `cd ~/SiteFlow-Kunden/siteware-frontend && npm run build`

Kopieren:
```bash
rm -rf ~/SiteFlow-Kunden/siteflow/public/assets ~/SiteFlow-Kunden/siteflow/public/index.html
cp -r ~/SiteFlow-Kunden/siteware-frontend/dist/. ~/SiteFlow-Kunden/siteflow/public/
```

Push: `cd ~/SiteFlow-Kunden/siteflow && git add public/ && git commit -m "feat: Branding [KUNDENNAME]" && git push`

Deploy (Hostinger-Terminal): `cd /opt/siteflow && bash update.sh`
