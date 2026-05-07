# Runbook: VPS + Kundeneinrichtung (Stefan)

**Zweck:** Dieser Leitfaden führt dich Schritt für Schritt durch die Einrichtung eines neuen Kunden — vom neuen VPS bis zur ersten E-Mail im Dashboard. Du brauchst keine technischen Kenntnisse; alle Befehle sind zum Kopieren und Einfügen vorbereitet.

**Wichtig:** Benutze den Einrichtungsassistenten im Dashboard **nicht** — er funktioniert in der aktuellen Version nicht vollständig und wird in v1.1 fertiggestellt. Dieser Leitfaden ist der einzige unterstützte Weg.

**Geschätzter Zeitaufwand:** 45–90 Minuten bei der ersten Einrichtung, 30–45 Minuten danach.

---

## Wie du dieses Runbook benutzt

Dieses Runbook setzt voraus, dass du Claude (oder einen anderen KI-Assistenten) während der Ausführung benutzt. Die technischen Details sind für die KI gedacht; du folgst den Abschnitten und fragst Claude, wenn etwas unklar ist. Wenn ein Schritt unklar ist, kopiere den ganzen Abschnitt in Claude und frage, was zu tun ist. Du musst kein Entwickler sein.

---

## 1. Was du vorher brauchst

### 1.1 Vom Kunden

Fordere diese Informationen **vor dem Termin** an — du kannst nicht fortfahren, wenn sie fehlen.

**Für jeden Posteingang, der überwacht werden soll:**

| Was | Beispiel | Hinweis |
|-----|---------|---------|
| E-Mail-Adresse des Posteingangs | `info@musterfirma.de` | Die Adresse, die SiteFlow beobachtet |
| App-Passwort | `abcd efgh ijkl mnop` | **Nicht** das normale E-Mail-Passwort — Infos je nach Anbieter unten |
| Name des E-Mail-Anbieters | Gmail, IONOS, GMX, M365 | Bestimmt den Server-Typ |

Ein Kunde mit drei Posteingängen (`info@`, `kontakt@`, persönlich) braucht drei Zeilen in der obigen Tabelle.

**Für das Tonprofil:**

- **E-Mail-Signatur:** Der Textblock, den der Kunde unter jede E-Mail setzt. Bitte den Kunden, ihn dir zu kopieren oder vorzulesen — z. B. „Mit freundlichen Grüßen / Max Mustermann / Musterfirma GmbH / Tel: +49 ..."
- **Firmenbeschreibung:** 2–3 Sätze darüber, was das Unternehmen macht, wen es bedient und welchen Ton es in E-Mails verwendet. Falls der Kunde keine vorbereitet hat, die Seite „Über uns" auf der Website verwenden.

**Domain:**

Die Domain, unter der das Dashboard erreichbar sein soll (z. B. `email.musterfirma.de`). Das muss eine Subdomain sein — nicht die Hauptdomain des Kunden.

### 1.2 Vom SugarPool-Team

Das SugarPool-Team erstellt die Siteware-Organisation und alle drei Agenten für den Kunden. Du bekommst:

| Was | Variable in .env |
|-----|-----------------|
| Siteware API-Token | `SITEWARE_TRIAGE_TOKEN` / `SITEWARE_REPLY_TOKEN` (gleicher Wert für beide) |
| Triage-Agent-ID | `SITEWARE_TRIAGE_AGENT_ID` |
| Reply-Agent-ID | `SITEWARE_REPLY_AGENT_ID` |
| Ton-Analyse-Agent-ID | `SITEWARE_TONE_AGENT_ID` |

Der Ton-Analyse-Agent wird in Version 1 noch nicht aktiv genutzt — du brauchst die ID trotzdem, da das Installationsprogramm danach fragt.

### 1.3 Tools

- Hostinger-Konto des Kunden (Browser-Terminal)
- Diese Anleitung (offen in einem anderen Tab oder Fenster)
- Einen Texteditor, um Kundenwerte vorab einzusetzen, bevor du Befehle ausführst

---

## 2. VPS einrichten (einmalig pro Kunde)

### 2.0 DNS einrichten — BEVOR du den VPS startest

**Der Kunde erledigt diesen Schritt.** SiteFlow braucht eine Domain (z. B. `email.musterfirma.de`), die auf die IP-Adresse des VPS zeigt. Caddy — der eingebaute Webserver — holt automatisch ein HTTPS-Zertifikat, aber nur wenn der DNS-Eintrag bereits propagiert ist, bevor du `install.sh` ausführst.

**Anweisung an den Kunden:**

> Bitte richte in deinem DNS-Verwaltungsbereich einen A-Record ein:
> - Name: `email` (oder die gewünschte Subdomain)
> - Typ: A
> - Wert: die IP-Adresse des neuen VPS (siehst du im Hostinger-Dashboard nach VPS-Erstellung)
> - TTL: 300 (oder das Minimum deines Anbieters)

Warte auf die Bestätigung des Kunden. Prüfe dann im Browser-Terminal, ob der Eintrag propagiert ist:

```bash
dig +short email.musterfirma.de
```

Ersetze `email.musterfirma.de` durch die echte Domain. Das Ergebnis muss die IP-Adresse des VPS sein. Wenn das Ergebnis leer ist oder eine andere IP zeigt — warte und versuche es erneut. Fahre **nicht** fort, bis dieser Befehl die richtige IP ausgibt.

Typische Wartezeit: 5–30 Minuten. Bei manchen Anbietern bis zu 2 Stunden.

### 2.1 VPS im Hostinger-Konto des Kunden erstellen

Im Hostinger-Dashboard des Kunden:

1. **VPS** → **Neuen VPS bestellen**
2. Betriebssystem: **Ubuntu 24.04** (genau diese Version)
3. Mindestgröße: 2 GB RAM, 2 vCPU, 40 GB SSD
4. Standort: **Deutschland** oder **EU** (DSGVO-Anforderung — kein US-Server)
5. Root-Passwort notieren oder in Passwortmanager speichern

Notiere die **IP-Adresse** des neuen VPS — sie wird in Schritt 2.0 für den DNS-Eintrag benötigt.

### 2.2 Mit dem VPS verbinden

Im Hostinger-Dashboard: VPS auswählen → **Browser-Terminal** öffnen (oder **Terminal** / **Console**, je nach Hostinger-Version).

Melde dich als `root` an. Du bist in der richtigen Shell, wenn die Eingabeaufforderung mit `root@` beginnt.

Falls Hostinger direktes SSH anbietet:

```bash
ssh root@<VPS-IP>
```

**Bekannte Falle:** macOS-Autokorrektur wandelt normale Anführungszeichen in typografische um, wenn du Passwörter kopierst. Nutze das Browser-Terminal direkt, oder deaktiviere „Smarte Anführungszeichen" in den macOS-Systemeinstellungen, bevor du Passwörter einfügst.

### 2.3 install.sh herunterladen und ausführen

**Wichtige Vorbereitung:** Stelle sicher, dass `/opt/siteflow` nicht existiert. Falls es existiert (z. B. von einer abgebrochenen früheren Installation), überspringt das Installationsprogramm alle Eingabeaufforderungen und denkt, es sei ein Update.

Prüfen:

```bash
ls /opt/siteflow 2>/dev/null && echo "EXISTIERT — muss entfernt werden" || echo "OK — nicht vorhanden"
```

Falls `EXISTIERT — muss entfernt werden` erscheint:

```bash
rm -rf /opt/siteflow
```

Dann `install.sh` herunterladen und starten:

```bash
cd /root
curl -fsSL https://raw.githubusercontent.com/Lukasbrujula/siteflow/main/install.sh -o install.sh
bash install.sh
```

Das Programm fragt dich der Reihe nach:

| Frage | Was du eingibst |
|-------|----------------|
| `Company domain` | Die Domain des Kunden, z. B. `email.musterfirma.de` |
| `Admin email address` | Die E-Mail-Adresse, mit der sich der Kunde einloggt |
| `Company inbox email` | Die erste Posteingangs-E-Mail-Adresse (bei Gmail: nativ; andere Anbieter: lies Abschnitt 3.1.2 zuerst) |
| `Gmail app password` | Das App-Passwort (bei Gmail: 16 Zeichen, keine Leerzeichen; bei anderen Anbietern: das jeweilige App-Passwort) |
| `Siteware API token` | Den Token vom SugarPool-Team |
| `Triage agent ID` | Die Triage-Agent-ID vom SugarPool-Team |
| `Reply agent ID` | Die Reply-Agent-ID vom SugarPool-Team |
| `Siteware Tone Analysis Agent ID` | Die Ton-Analyse-ID vom SugarPool-Team |

Bei einem **Gmail-fremden Anbieter** wird die IMAP-Überprüfung fehlschlagen und eine Warnung zeigen. Das ist normal — drücke bei den Wiederholungsaufforderungen einfach Enter, und die Installation läuft weiter. Korrigiere danach die Servereinstellungen gemäß Abschnitt 3.1.2.

Die Installation dauert 3–8 Minuten. Am Ende erscheint:

```
================================
 Installation complete!

 Dashboard:  https://email.musterfirma.de
 Admin:      admin@musterfirma.de
 Config:     /opt/siteflow/.env
================================
```

Falls stattdessen `Health: NOT OK` erscheint, lies Abschnitt 8.1.

### 2.4 Installation prüfen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

```bash
pm2 list
```

Erwartet: **vier Prozesse**, alle mit Status `online`:

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

Prüfe außerdem, ob die `inboxes`-Tabelle existiert (Pflicht für die nächsten Schritte):

```bash
cd /opt/siteflow
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.log(db.prepare("SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"inboxes\"").get());'
```

Erwartet: `{ name: 'inboxes' }`. Falls `undefined` erscheint, wurde eine ältere Version installiert — wende dich an Lukas.

---

## 3. Mandant und Posteingang anlegen

Der Einrichtungsassistent im Dashboard ist in der aktuellen Version **nicht** nutzbar (siehe Abschnitt 5). Mandant, Posteingang und Tonprofil werden manuell in der Datenbank angelegt. Alle Befehle unten sind zum Kopieren und Einfügen vorbereitet — du ersetzt nur die Werte in spitzen Klammern `<...>`.

**Alle Befehle werden im Verzeichnis `/opt/siteflow` ausgeführt.** Stell sicher, dass du dort bist:

```bash
cd /opt/siteflow
```

### 3.1 IMAP/SMTP-Einstellungen je Anbieter

#### 3.1.1 Gmail (nativ — install.sh übernimmt alles)

Falls der Kunde Gmail nutzt, hat install.sh IMAP und SMTP bereits korrekt gesetzt. Überspringe diesen Abschnitt und fahre mit 3.2 fort.

Voraussetzungen für Gmail:
- Google App-Passwort, **nicht** das normale Gmail-Passwort
- App-Passwort erstellen: Google-Konto des Kunden → **Sicherheit** → **2-Faktor-Authentifizierung** → **App-Passwörter**
- IMAP in Gmail aktivieren: **Einstellungen** → **Alle Einstellungen** → **Weiterleitung und POP/IMAP** → IMAP aktivieren

Serverdaten (automatisch durch install.sh gesetzt):
- IMAP: `imap.gmail.com:993 TLS`
- SMTP: `smtp.gmail.com:587 STARTTLS`

#### 3.1.2 Andere Anbieter (IONOS, GMX, Web.de, Microsoft 365)

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Falls der Kunde **nicht** Gmail nutzt: install.sh hat die IMAP-Überprüfung mit einer Fehlermeldung übersprungen und trotzdem installiert. Das ist normal. Führe jetzt folgende Schritte durch.

**Schritt 1 — Richtigen IMAP-Server in `.env` setzen.**

Wähle deinen Anbieter:

**IONOS:**
```bash
sed -i 's|^IMAP_HOST=.*|IMAP_HOST=imap.ionos.de|' /opt/siteflow/.env
sed -i 's|^SMTP_HOST=.*|SMTP_HOST=smtp.ionos.de|' /opt/siteflow/.env
sed -i 's|^SMTP_PORT=.*|SMTP_PORT=587|' /opt/siteflow/.env
```

**GMX:**
```bash
sed -i 's|^IMAP_HOST=.*|IMAP_HOST=imap.gmx.net|' /opt/siteflow/.env
sed -i 's|^SMTP_HOST=.*|SMTP_HOST=mail.gmx.net|' /opt/siteflow/.env
sed -i 's|^SMTP_PORT=.*|SMTP_PORT=587|' /opt/siteflow/.env
```

**Web.de:**
```bash
sed -i 's|^IMAP_HOST=.*|IMAP_HOST=imap.web.de|' /opt/siteflow/.env
sed -i 's|^SMTP_HOST=.*|SMTP_HOST=smtp.web.de|' /opt/siteflow/.env
sed -i 's|^SMTP_PORT=.*|SMTP_PORT=587|' /opt/siteflow/.env
```

**Microsoft 365:**
```bash
sed -i 's|^IMAP_HOST=.*|IMAP_HOST=outlook.office365.com|' /opt/siteflow/.env
sed -i 's|^SMTP_HOST=.*|SMTP_HOST=smtp.office365.com|' /opt/siteflow/.env
sed -i 's|^SMTP_PORT=.*|SMTP_PORT=587|' /opt/siteflow/.env
```

**Schritt 2 — Überprüfen, dass die Änderung gespeichert wurde:**

```bash
grep -E '^(IMAP_HOST|SMTP_HOST|SMTP_PORT)' /opt/siteflow/.env
```

**Schritt 3 — Dienste neu starten, damit die neuen Einstellungen gelten:**

```bash
pm2 restart all --update-env
```

**Serverdaten für die Datenbankeinträge in den Schritten 3.3 und 3.4:**

| Anbieter | IMAP-Host | IMAP-Port | SMTP-Host | SMTP-Port |
|---------|-----------|-----------|-----------|-----------|
| Gmail | `imap.gmail.com` | 993 | `smtp.gmail.com` | 587 |
| IONOS | `imap.ionos.de` | 993 | `smtp.ionos.de` | 587 |
| GMX | `imap.gmx.net` | 993 | `mail.gmx.net` | 587 |
| Web.de | `imap.web.de` | 993 | `smtp.web.de` | 587 |
| Microsoft 365 | `outlook.office365.com` | 993 | `smtp.office365.com` | 587 |

> **mittwald und ähnliche Hosting-Anbieter:** Manche deutschen Hosting-Anbieter blockieren IMAP-Verbindungen aus Rechenzentrum-IPs (z. B. von Hostinger). Falls die Verbindung trotz richtiger Zugangsdaten scheitert, muss der Kunde seinen E-Mail-Anbieter kontaktieren und darum bitten, die Hostinger-Datacenter-IPs freizuschalten. Mehr dazu in Abschnitt 8.3.

### 3.2 Passwörter verschlüsseln

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

SiteFlow speichert Passwörter verschlüsselt in der Datenbank. Du musst die Klartextpasswörter vor dem Eintragen verschlüsseln. Das Skript läuft direkt auf dem Server und verwendet den bei der Installation automatisch generierten `ENCRYPTION_KEY`.

Für **jedes** Passwort, das du in die Datenbank schreiben willst:

```bash
cd /opt/siteflow
node -e '
require("dotenv").config();
const {encrypt}=require("./src/api/crypto");
console.log(encrypt("<PASSWORT>"));
'
```

Ersetze `<PASSWORT>` durch das echte Passwort. Das Ergebnis sieht ungefähr so aus:

```
a1b2c3d4e5f6a7b8c9d0e1f2:deadbeef1234567890123456789012345678901234:abcdef...
```

Kopiere den gesamten Ausgabetext — du brauchst ihn in den nächsten Schritten. Falls IMAP- und SMTP-Passwort identisch sind (bei Gmail immer der Fall), reicht ein verschlüsselter Wert für beide.

### 3.3 Mandant-Zeile aktualisieren

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Das Installationsprogramm hat bereits eine Zeile für den Admin-Nutzer angelegt. Jetzt trägst du die IMAP/SMTP-Zugangsdaten und das Tonprofil ein.

**Bereite alle Werte vorab in einem Texteditor vor:**

| Platzhalter | Was hingehört |
|-------------|--------------|
| `<ADMIN_EMAIL>` | Die Admin-E-Mail-Adresse (gleich wie beim install.sh-Prompt) |
| `<IMAP_HOST>` | Aus der Tabelle in 3.1 |
| `<IMAP_USER>` | E-Mail-Adresse des ersten Posteingangs |
| `<IMAP_PASSWORD_ENC>` | Verschlüsseltes Passwort aus 3.2 |
| `<SMTP_HOST>` | Aus der Tabelle in 3.1 |
| `<SMTP_USER>` | Gleich wie IMAP_USER |
| `<SMTP_PASSWORD_ENC>` | Gleich wie IMAP_PASSWORD_ENC (falls selbes Passwort) |
| `<SIGNATUR>` | E-Mail-Signatur des Kunden (Zeilenumbrüche als `\n` schreiben) |
| `<FIRMENBESCHREIBUNG>` | 2–3 Sätze über das Unternehmen |

Dann ausführen:

```bash
cd /opt/siteflow
node -e '
require("dotenv").config();
const {db,initDb}=require("./src/db");
initDb();
const r=db.prepare(`
  UPDATE tenants SET
    imap_host=?,
    imap_port=993,
    imap_user=?,
    imap_password_enc=?,
    smtp_host=?,
    smtp_port=587,
    smtp_user=?,
    smtp_password_enc=?,
    tone_profile=?
  WHERE email=?
`).run(
  "<IMAP_HOST>",
  "<IMAP_USER>",
  "<IMAP_PASSWORD_ENC>",
  "<SMTP_HOST>",
  "<SMTP_USER>",
  "<SMTP_PASSWORD_ENC>",
  JSON.stringify({
    email_signature:"<SIGNATUR>",
    knowledgebase:"<FIRMENBESCHREIBUNG>",
    formality_level:"neutral",
    common_phrasing:[],
    language_mix:"de"
  }),
  "<ADMIN_EMAIL>"
);
console.log("Aktualisierte Zeilen:", r.changes);
'
```

Erwartet: `Aktualisierte Zeilen: 1`. Wenn `0` erscheint, wurde die Admin-E-Mail nicht gefunden — prüfe ob `<ADMIN_EMAIL>` exakt mit der bei install.sh eingegebenen Adresse übereinstimmt (Groß-/Kleinschreibung beachten).

> **Warum steht `imap_host` auch in der `tenants`-Zeile, obwohl es die `inboxes`-Tabelle gibt?** Das ist gewollt. SiteFlow v1 schreibt die Zugangsdaten an beide Stellen, um bei Bedarf schnell auf die vorherige Version zurückwechseln zu können, ohne Daten zu verlieren. Entferne diese Felder nicht — auch wenn sie redundant erscheinen.

### 3.4 Posteingang-Zeile(n) anlegen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Lege **für jeden** Posteingang des Kunden eine separate Zeile an. Ein Kunde mit drei Posteingängen braucht drei Durchläufe dieses Skripts.

```bash
cd /opt/siteflow
node -e '
require("dotenv").config();
const {db}=require("./src/db");
const {encrypt}=require("./src/api/crypto");
const {randomUUID}=require("crypto");
const tenant=db.prepare("SELECT id FROM tenants WHERE email=?").get("<ADMIN_EMAIL>");
if(!tenant){console.error("Mandant nicht gefunden — Admin-E-Mail prüfen"); process.exit(1);}
db.prepare(`
  INSERT INTO inboxes
    (id, tenant_id, email, label,
     imap_host, imap_port, imap_user, imap_password_enc,
     smtp_host, smtp_port, smtp_user, smtp_password_enc,
     is_active)
  VALUES (?,?,?,?, ?,?,?,?, ?,?,?,?, 1)
`).run(
  randomUUID(),
  tenant.id,
  "<POSTEINGANG_EMAIL>",
  "<POSTEINGANG_LABEL>",
  "<IMAP_HOST>",
  993,
  "<IMAP_USER>",
  "<IMAP_PASSWORD_ENC>",
  "<SMTP_HOST>",
  587,
  "<SMTP_USER>",
  "<SMTP_PASSWORD_ENC>"
);
console.log("Posteingang angelegt.");
'
```

| Platzhalter | Beispiel | Erläuterung |
|-------------|---------|-------------|
| `<ADMIN_EMAIL>` | `max@musterfirma.de` | Login-E-Mail aus install.sh |
| `<POSTEINGANG_EMAIL>` | `info@musterfirma.de` | Die überwachte Adresse |
| `<POSTEINGANG_LABEL>` | `info` | Kurzname für das Dashboard-Filter-Menü (normalerweise der Teil vor dem `@`) |
| `<IMAP_HOST>` | `imap.gmail.com` | Aus Tabelle in 3.1 |
| `<IMAP_USER>` | `info@musterfirma.de` | Meist gleich wie POSTEINGANG_EMAIL |
| `<IMAP_PASSWORD_ENC>` | `a1b2:c3d4:e5f6...` | Verschlüsseltes Passwort aus 3.2 |
| `<SMTP_HOST>` | `smtp.gmail.com` | Aus Tabelle in 3.1 |
| `<SMTP_USER>` | `info@musterfirma.de` | Meist gleich wie IMAP_USER |
| `<SMTP_PASSWORD_ENC>` | `a1b2:c3d4:e5f6...` | Oft gleich wie IMAP_PASSWORD_ENC |

Für jeden weiteren Posteingang: Skript erneut ausführen, Werte für den nächsten Posteingang einsetzen.

### 3.5 Tonprofil — Werte ermitteln

Das Tonprofil wurde in Schritt 3.3 als Teil des `UPDATE tenants`-Befehls eingetragen. Dieser Abschnitt erklärt, wie du die richtigen Werte bekommst.

**E-Mail-Signatur (`email_signature`):**

Bitte den Kunden, den Signaturtext zu kopieren, der unter jede E-Mail gesetzt wird. Typisches Beispiel:

```
Mit freundlichen Grüßen

Max Mustermann
Musterfirma GmbH
Geschäftsführer

Tel: +49 89 123456789
E-Mail: max@musterfirma.de
Musterstraße 1 · 80331 München
```

Beim Eintragen ins Skript: Zeilenumbrüche als `\n` schreiben:

```
"Mit freundlichen Grüßen\n\nMax Mustermann\nMusterfirma GmbH\nGeschäftsführer\n\nTel: +49 89 123456789"
```

**Firmenbeschreibung (`knowledgebase`):**

2–3 Sätze über das Unternehmen. Falls der Kunde keine vorbereitet hat, die „Über uns"-Seite der Website nutzen. Beispiel:

```
Musterfirma GmbH ist ein Münchner B2B-Softwareanbieter für mittelständische Handwerksbetriebe. Wir bieten ERP-Lösungen, Schulungen und laufenden Support an. Unsere Kunden sprechen Deutsch; wir kommunizieren formell.
```

### 3.6 Einträge prüfen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

```bash
cd /opt/siteflow
node -e '
const db=require("better-sqlite3")("data/siteflow.db");
const t=db.prepare("SELECT email,imap_host,imap_user,tone_profile FROM tenants WHERE email=?").get("<ADMIN_EMAIL>");
console.log("Mandant:", t.email);
console.log("IMAP-Host:", t.imap_host);
console.log("IMAP-User:", t.imap_user);
console.log("Tonprofil gesetzt:", Boolean(t.tone_profile));
const inboxes=db.prepare("SELECT email,label,imap_host,is_active FROM inboxes WHERE tenant_id=(SELECT id FROM tenants WHERE email=?)").all("<ADMIN_EMAIL>");
console.table(inboxes);
'
```

Erwartet:
- `IMAP-Host:` zeigt den richtigen Server
- `Tonprofil gesetzt: true`
- Die Tabelle zeigt alle angelegten Posteingänge mit `is_active: 1`

Prüfe außerdem, ob die Signatur korrekt gespeichert wurde — besonders die Zeilenumbrüche:

```bash
cd /opt/siteflow
node -e '
const db=require("better-sqlite3")("data/siteflow.db");
const t=db.prepare("SELECT tone_profile FROM tenants WHERE email=?").get("<ADMIN_EMAIL>");
const tp=JSON.parse(t.tone_profile);
console.log("--- Signatur ---");
console.log(tp.email_signature);
console.log("--- Ende ---");
'
```

Erwartet: Die Signatur erscheint so, wie der Kunde sie dir gegeben hat — mit echten Zeilenumbrüchen, nicht als `\n`. Falls die Signatur falsch aussieht oder Zeilenumbrüche fehlen, kopiere diesen Abschnitt in Claude und zeige ihr die Ausgabe.

Danach alle Dienste neu starten:

```bash
pm2 restart all --update-env
```

Warte 60 Sekunden, dann:

```bash
pm2 logs poller --lines 20 --nostream
```

Erwartet: Für jeden aktiven Posteingang eine Zeile wie `[poller] inbox <id>: Found N new messages` oder `[poller] inbox <id>: No new messages`. Falls stattdessen `Invalid credentials` erscheint, lies Abschnitt 8.2.

---

## 4. Siteware-Konfiguration prüfen

install.sh hat den Token und die Agent-IDs bereits in `.env` eingetragen, wenn du sie bei den Prompts eingegeben hast. Dieser Abschnitt zeigt, wie du prüfst, ob alles korrekt ist — und wie du es korrigierst, falls nicht.

### 4.1 Eingetragene Werte prüfen

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

```bash
grep -E '^SITEWARE' /opt/siteflow/.env
```

Erwartet:

```
SITEWARE_API_TOKEN=<token>
SITEWARE_TRIAGE_TOKEN=<gleicher-token>
SITEWARE_REPLY_TOKEN=<gleicher-token>
SITEWARE_TRIAGE_AGENT_ID=<triage-id>
SITEWARE_REPLY_AGENT_ID=<reply-id>
SITEWARE_TONE_AGENT_ID=<tone-id>
SITEWARE_TRIAGE_MODE=passthrough
SITEWARE_TRIAGE_MODEL=gpt-4.1
```

Falls ein Feld leer oder falsch ist:

```bash
sed -i 's|^SITEWARE_TRIAGE_TOKEN=.*|SITEWARE_TRIAGE_TOKEN=<neuer-token>|' /opt/siteflow/.env
sed -i 's|^SITEWARE_REPLY_TOKEN=.*|SITEWARE_REPLY_TOKEN=<neuer-token>|' /opt/siteflow/.env
sed -i 's|^SITEWARE_TRIAGE_AGENT_ID=.*|SITEWARE_TRIAGE_AGENT_ID=<triage-id>|' /opt/siteflow/.env
sed -i 's|^SITEWARE_REPLY_AGENT_ID=.*|SITEWARE_REPLY_AGENT_ID=<reply-id>|' /opt/siteflow/.env
pm2 restart all --update-env
```

### 4.2 Token testen

```bash
TOKEN=$(grep ^SITEWARE_TRIAGE_TOKEN /opt/siteflow/.env | cut -d= -f2)
curl -sS -o /dev/null -w "HTTP %{http_code}\n" https://api.siteware.io/v1/api/agents -H "Authorization: Bearer $TOKEN"
```

Erwartet: `HTTP 200`. Bei `HTTP 403` lies Abschnitt 8.4.

### 4.3 Wichtige Falle: „Alle Assistenten erlaubt" funktioniert nicht zuverlässig

Wenn das SugarPool-Team einen API-Schlüssel in Siteware erstellt, gibt es eine Checkbox „Alle Assistenten erlaubt". Diese funktioniert **nicht** zuverlässig. Das SugarPool-Team muss die drei Agenten (Triage, Reply, Ton-Analyse) **einzeln** in der Zulassungsliste anklicken.

Falls du ein `HTTP 403` siehst, obwohl der Token korrekt eingetragen wurde: Bitte das SugarPool-Team, den Schlüssel zu öffnen (**Einstellungen → API-Zugriffsschlüssel**) und zu prüfen, ob alle drei Agenten explizit einzeln aktiviert sind.

---

## 5. Warum der Einrichtungsassistent nicht verwendet wird

Das Dashboard enthält einen sechsstufigen Einrichtungsassistenten. Er ist in der aktuellen Version **nicht funktionsfähig** und wird in v1.1 fertiggestellt.

Der Assistent speichert das Tonprofil in einem Format, das die Verarbeitungslogik nicht lesen kann — Entwürfe würden mit `[SIGNATUR EINFÜGEN]` buchstäblich im Text an Kunden gesendet werden. Deshalb ist der manuelle Weg in diesem Dokument der einzige unterstützte Weg bis v1.1.

Falls ein Kunde fragt: Die individuelle Einrichtung durch SugarPool ist ein Qualitätsmerkmal des Angebots, kein Mangel. Der Assistent kommt mit dem nächsten Update.

Für technischen Kontext (nicht für Kunden gedacht): `docs/audits/ONBOARDING_STATE_AUDIT_2026-05-06.md`.

---

## 6. Vollständige Funktionsprüfung

Führe diese Schritte durch, nachdem alle obigen Abschnitte abgeschlossen sind.

### 6.1 Test-E-Mail senden

Sende eine Test-E-Mail **an jeden** eingerichteten Posteingang. Vorlage:

```
An:      <posteingang@musterfirma.de>
Betreff: SiteFlow Test 2026-MM-TT A — [eindeutiger Text]
Text:    Guten Tag, könnten Sie mir bitte eine Kopie der Rechnung Nr. 12345 zusenden?
```

Verwende jeden Tag einen anderen Betreff, damit du die Test-E-Mails in den Logs wiederfindest. Schreibe auf Deutsch, damit die KI die E-Mail als `OTHER` klassifiziert und einen Antwortentwurf erstellt (nicht als Spam oder Werbung archiviert).

### 6.2 Poller-Zyklus abwarten

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Der Poller prüft alle 3 Minuten. Warte 4 Minuten, dann:

```bash
cd /opt/siteflow
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT status,classification,subject FROM emails ORDER BY received_at DESC LIMIT 5").all());'
```

Erwartet: Die Test-E-Mail erscheint mit `status: draft` oder `status: archived`.

### 6.3 Im Dashboard anmelden

Öffne `https://email.musterfirma.de` im Browser. Melde dich mit der Admin-E-Mail an — du bekommst einen Einmal-Code per E-Mail (OTP-Login, kein Passwort notwendig).

### 6.4 Dashboard prüfen

Nach dem Einloggen:

- [ ] Die Test-E-Mail erscheint im richtigen Tab (z. B. **Sonstige**)
- [ ] Der Antwortentwurf ist sichtbar und enthält die Kundensignatur (kein `[SIGNATUR EINFÜGEN]` im Text)
- [ ] Falls mehrere Posteingänge eingerichtet sind: Das Filter-Dropdown **Alle Postfächer** erscheint im Header
- [ ] Das Dropdown zeigt alle eingerichteten Posteingänge
- [ ] Nach Auswahl eines Posteingangs im Filter erscheinen nur E-Mails dieses Posteingangs

Hinweis: Der Filter erscheint nur bei **zwei oder mehr** aktiven Posteingängen. Bei nur einem ist er ausgeblendet — das ist kein Fehler.

### 6.5 Entwurf genehmigen

Klicke **Senden & Archivieren** bei der Test-E-Mail. Prüfe dann in der Mailbox des Absenders, ob die Antwort ankam — und zwar **vom Posteingang, an den die Test-E-Mail geschickt wurde** (nicht von einer anderen Adresse).

---

## 7. Übergabe an den Kunden

### 7.1 Dashboard-Zugang senden

Sende dem Kunden:
- Dashboard-URL: `https://email.musterfirma.de`
- Login-E-Mail: die Admin-E-Mail-Adresse
- Hinweis: Login erfolgt per Einmal-Code per E-Mail, kein Passwort notwendig

### 7.2 Erster Login — was der Kunde sieht

Der Kunde landet direkt im Dashboard. Er sieht Tabs für die verschiedenen E-Mail-Kategorien:

| Tab | Was drin ist |
|-----|-------------|
| **Dringend** | Dringende Anfragen, KI-Entwurf bereit |
| **Sonstige** | Normale Anfragen, KI-Entwurf bereit |
| **Spam** | Als Spam erkannte E-Mails |
| **Werbung** | Werbemails |
| **Eskalation** | E-Mails, die manuelles Eingreifen brauchen |
| **Abmeldungen** | Abmelde-Anfragen |

Beim Genehmigen eines Entwurfs wird die E-Mail direkt aus dem Kundenpostfach gesendet. Der Kunde sieht in seiner eigenen Mailbox eine Kopie der gesendeten Antwort.

### 7.3 Bei Fragen des Kunden

Direkt technische Fragen an Lukas weiterleiten. Operative Probleme (z. B. Poller sendet keine E-Mails mehr) über das Runbook `runbook-poller-not-saving.md` diagnostizieren (Abschnitt 8.1).

---

## 8. Fehlerbehebung

### 8.1 Pipeline bewegt keine E-Mails

Symptom: Test-E-Mail wurde gesendet, erscheint aber nicht im Dashboard nach 10 Minuten.

→ Runbook `docs/runbooks/runbook-poller-not-saving.md` aufschlagen und von Schritt 1 beginnen. Alle Schritte sind dort ausführlich erklärt.

### 8.2 IMAP-Verbindung schlägt fehl: „Invalid credentials"

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

```bash
pm2 logs poller --lines 30 --nostream | grep -i "invalid\|error"
```

Falls du `Invalid credentials` siehst:

1. Prüfe, ob das App-Passwort korrekt ist (kein Leerzeichen, bei Gmail genau 16 Zeichen)
2. Prüfe, ob `IMAP_HOST` in `.env` zum Anbieter passt — `grep ^IMAP_HOST /opt/siteflow/.env`
3. Falls der Host falsch ist, korrigiere ihn per sed (Abschnitt 3.1.2) und starte neu
4. Falls der Host stimmt, aber die Zugangsdaten falsch sind: Schritt 3.2 erneut ausführen, verschlüsseltes Passwort neu erzeugen, und Schritt 3.4 wiederholen, um den Posteingang-Eintrag zu aktualisieren

### 8.3 IMAP-Verbindung schlägt fehl: IP-Blockierung (mittwald und ähnliche)

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Symptom: `Connection refused` oder `ETIMEDOUT` beim Verbindungsaufbau — aber die Zugangsdaten sind korrekt.

Ursache: Manche deutschen E-Mail-Anbieter (besonders mittwald) blockieren IMAP-Verbindungen aus Rechenzentrum-IPs. Hostinger-VPS-IPs sind davon betroffen.

VPS-IP-Adresse ermitteln:

```bash
curl -s ifconfig.me
```

Lösung: Der Kunde muss **selbst** beim Support seines E-Mail-Anbieters ein Ticket eröffnen und darum bitten, diese IP-Adresse freizuschalten. Falls der Anbieter das nicht ermöglicht, muss der Kunde zu einem kompatiblen Anbieter wechseln (Gmail funktioniert zuverlässig aus Hostinger-IPs).

Solange das Problem besteht, kann der betroffene Posteingang deaktiviert werden, damit er die anderen nicht stört:

```bash
cd /opt/siteflow
node -e '
const db=require("better-sqlite3")("data/siteflow.db");
const r=db.prepare("UPDATE inboxes SET is_active=0 WHERE email=?").run("<BLOCKIERTE_EMAIL>");
console.log("Deaktiviert:", r.changes);
'
pm2 restart poller --update-env
```

### 8.4 Siteware gibt 403 zurück

```bash
TOKEN=$(grep ^SITEWARE_TRIAGE_TOKEN /opt/siteflow/.env | cut -d= -f2)
curl -sS -o /dev/null -w "HTTP %{http_code}\n" https://api.siteware.io/v1/api/agents -H "Authorization: Bearer $TOKEN"
```

Falls `HTTP 403`: Das SugarPool-Team muss in Siteware unter **Einstellungen → API-Zugriffsschlüssel** prüfen, ob alle drei Agenten **einzeln** in der Zulassungsliste angehakt sind (Abschnitt 4.3). Danach Token in `.env` aktualisieren (Abschnitt 4.1) und `pm2 restart all --update-env`.

### 8.5 Dashboard lädt, aber Posteingang-Filter erscheint nicht

> **Wenn du dir bei diesem Abschnitt unsicher bist:** Kopiere den gesamten Abschnitt in Claude und schreibe: „Bitte führe mich Schritt für Schritt durch diesen Abschnitt. Hier sind meine Werte: [Werte einsetzen]. Sag mir genau, was ich in welcher Reihenfolge tun muss."

Der Inbox-Filter erscheint nur bei mindestens **zwei** aktiven Posteingängen. Prüfe:

```bash
cd /opt/siteflow
node -e 'const db=require("better-sqlite3")("data/siteflow.db"); console.table(db.prepare("SELECT email,label,is_active FROM inboxes").all());'
```

Falls nur eine Zeile erscheint oder alle auf `is_active: 0` stehen: Schritt 3.4 erneut durchführen.

---

## Referenz: Alle .env-Variablen

Vollständige Übersicht für Reparaturschritte und Nachschlagen:

| Variable | Beispielwert / Herkunft | Wer setzt sie |
|----------|------------------------|--------------|
| `PORT` | `3000` | Fest (install.sh) |
| `NODE_ENV` | `production` | Fest (install.sh) |
| `DOMAIN` | `email.musterfirma.de` | Prompt |
| `IMAP_HOST` | `imap.gmail.com` | Fest (install.sh) / manuell per sed bei anderen Anbietern |
| `IMAP_USER` | `info@musterfirma.de` | Prompt |
| `IMAP_PASSWORD` | `abcdefghijklmnop` | Prompt (Klartext in .env, nur für Poller-Prozess) |
| `SMTP_HOST` | `smtp.gmail.com` | Fest (install.sh) / manuell per sed |
| `SMTP_PORT` | `587` | Fest (install.sh) |
| `SMTP_USER` | `info@musterfirma.de` | = IMAP_USER (install.sh) |
| `SMTP_PASSWORD` | `abcdefghijklmnop` | = IMAP_PASSWORD (install.sh) |
| `ADMIN_EMAIL` | `max@musterfirma.de` | Prompt |
| `SITEWARE_API_TOKEN` | `<jwt>` | Prompt (SugarPool-Team) |
| `SITEWARE_TRIAGE_TOKEN` | `<gleicher-jwt>` | Prompt (SugarPool-Team) |
| `SITEWARE_REPLY_TOKEN` | `<gleicher-jwt>` | Prompt (SugarPool-Team) |
| `SITEWARE_TRIAGE_AGENT_ID` | `69df929c...` | Prompt (SugarPool-Team) |
| `SITEWARE_REPLY_AGENT_ID` | `69df943e...` | Prompt (SugarPool-Team) |
| `SITEWARE_TONE_AGENT_ID` | `<id>` | Prompt (SugarPool-Team, derzeit inaktiv in v1) |
| `SITEWARE_TRIAGE_MODE` | `passthrough` | Fest (install.sh) |
| `SITEWARE_TRIAGE_MODEL` | `gpt-4.1` | Fest (install.sh) |
| `ENCRYPTION_KEY` | `64-Hex-Wert` | Auto-generiert (install.sh) |
| `SESSION_SECRET` | `64-Hex-Wert` | Auto-generiert (install.sh) |
| `ALLOWED_ORIGINS` | `https://email.musterfirma.de` | Auto (install.sh, aus DOMAIN) |
| `POLL_INTERVAL_MS` | `180000` (3 Min.) | Fest (install.sh) |
| `SESSION_DURATION_DAYS` | `7` | Fest (install.sh) |
| `DATA_RETENTION_DAYS` | `90` | Fest (install.sh) |
