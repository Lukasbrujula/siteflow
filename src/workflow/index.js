require("dotenv").config();
const { db } = require("../db");
const https = require("https");

const SITEWARE_HOST = "api.siteware.io";
const TRIAGE_TOKEN =
  process.env.SITEWARE_TRIAGE_TOKEN || process.env.SITEWARE_API_TOKEN;
const REPLY_TOKEN =
  process.env.SITEWARE_REPLY_TOKEN || process.env.SITEWARE_API_TOKEN;
const TRIAGE_AGENT_ID = process.env.SITEWARE_TRIAGE_AGENT_ID;
const REPLY_AGENT_ID = process.env.SITEWARE_REPLY_AGENT_ID;
const TRIAGE_MODE = (
  process.env.SITEWARE_TRIAGE_MODE || "passthrough"
).toLowerCase();
const TRIAGE_MODEL = process.env.SITEWARE_TRIAGE_MODEL || "gpt-4.1";

const TRIAGE_SYSTEM_PROMPT = `Du bist ein E-Mail-Triage-Assistent fuer ein deutsches B2B-Unternehmen. Deine einzige Aufgabe ist die maschinell verwertbare Klassifikation eingehender E-Mails. Du erstellst NIEMALS Antworten oder Zusammenfassungen.

Klassifikation (genau ein Wert):
- SPAM: Phishing, schaedliche Massenwerbung, kompromittierter Absender. Nur bei mehreren Indikatoren. Im Zweifel OTHER.
- AD: legitime Werbung, Newsletter, automatisierte Benachrichtigungen.
- URGENT: Beschwerde, Zahlungsproblem, Vertragskuendigung, juristische Andeutung, Sicherheitsvorfall, explizite Frist <48h.
- OTHER: alles andere mit echtem Antwortbedarf.

Sentiment (genau ein Wert): positive | neutral | negative | hostile.

escalation_triggered = true wenn EINS zutrifft: classification=URGENT, sentiment=hostile, Erwaehnung von Anwalt/Gericht/Klage/Verbraucherschutz/Datenschutzbehoerde/Presse, Personenschaden/Sicherheitsvorfall/Datenleck, oder explizite Frist <48 Stunden.

suggested_priority: critical bei escalation_triggered=true; high zeitkritisch ohne Trigger; normal Standard fuer OTHER; low fuer AD/unkritisch.

Output: AUSSCHLIESSLICH gueltiges JSON (kein Markdown, keine Code-Fences) mit exakt diesen Feldern:
{"classification":"SPAM"|"AD"|"URGENT"|"OTHER","confidence":0.0-1.0,"reasoning":"1-2 Saetze deutsch","sentiment":"positive"|"neutral"|"negative"|"hostile","escalation_triggered":true|false,"escalation_reason":"deutsch wenn true sonst leer","language_detected":"de"|"en"|"...","suggested_priority":"low"|"normal"|"high"|"critical"}

Enum-Werte englisch. reasoning und escalation_reason deutsch.`;

function httpsPost(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: SITEWARE_HOST,
        path: path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode,
              json: JSON.parse(buf),
              raw: buf,
            });
          } catch (e) {
            resolve({ status: res.statusCode, json: null, raw: buf });
          }
        });
      },
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function extractJson(s) {
  if (!s) return null;
  if (typeof s === "object") return s;
  let str = String(s)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(str);
  } catch (_) {}
  const m = str.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch (_) {}
  }
  return null;
}

async function callTriageAgent(email) {
  if (TRIAGE_MODE === "passthrough") return callTriagePassthrough(email);

  const result = await httpsPost(
    "/v1/api/completion/" + TRIAGE_AGENT_ID,
    {
      taskSettings: [
        { name: "senderaddress", value: email.from_address || "" },
        { name: "subject", value: email.subject || "" },
        { name: "headers", value: email.headers || "" },
        { name: "body", value: (email.body || "").substring(0, 5000) },
        { name: "attachments", value: email.attachments || "" },
      ],
      stream: false,
    },
    TRIAGE_TOKEN,
  );
  if (result.status !== 200)
    throw new Error(
      "Triage " + result.status + ": " + (result.raw || "").slice(0, 300),
    );
  const parsed = extractJson(result.json && result.json.answer);
  if (!parsed)
    throw new Error("Triage unparseable: " + String(result.raw).slice(0, 300));
  return parsed;
}

async function callTriagePassthrough(email) {
  const userInput = [
    "Absenderadresse: " + (email.from_address || ""),
    "Betreff: " + (email.subject || ""),
    "Header: " + (email.headers || ""),
    "Anhaenge: " + (email.attachments || ""),
    "",
    "Body:",
    (email.body || "").substring(0, 5000),
  ].join("\n");

  const result = await httpsPost(
    "/v1/api/proxy/openai/v1/responses",
    {
      model: TRIAGE_MODEL,
      instructions: TRIAGE_SYSTEM_PROMPT,
      input: userInput,
    },
    TRIAGE_TOKEN,
  );
  if (result.status !== 200)
    throw new Error(
      "Triage passthrough " +
        result.status +
        ": " +
        (result.raw || "").slice(0, 300),
    );
  const text = ((result.json && result.json.output) || [])
    .flatMap((item) => item.content || [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text)
    .join("");
  const parsed = extractJson(text);
  if (!parsed)
    throw new Error("Triage passthrough unparseable: " + text.slice(0, 300));
  return parsed;
}

async function callReplyAgent(email, triage) {
  const tenantRow = db
    .prepare("SELECT tone_profile FROM tenants WHERE id = ?")
    .get(email.tenant_id);
  let emailsignature = "",
    knowledgebase = "";
  try {
    const tp =
      tenantRow && tenantRow.tone_profile
        ? JSON.parse(tenantRow.tone_profile)
        : {};
    emailsignature = tp.email_signature || "";
    knowledgebase = tp.knowledgebase || tp.knowledge_base || "";
  } catch (e) {}

  const incomingemail =
    "From: " +
    (email.from_address || "") +
    "\nSubject: " +
    (email.subject || "") +
    "\n\n" +
    (email.body || "").substring(0, 5000);

  const result = await httpsPost(
    "/v1/api/completion/" + REPLY_AGENT_ID,
    {
      taskSettings: [
        { name: "originalsubject", value: email.subject || "" },
        { name: "incomingemail", value: incomingemail },
        {
          name: "knowledgebase",
          value:
            knowledgebase ||
            "Keine Wissensbasis konfiguriert. Antworte hoeflich, frage hoeflich nach Details, und nutze Platzhalter [BITTE ERGAENZEN: ...] fuer alle konkreten Fakten.",
        },
        { name: "employeesignature", value: emailsignature },
        {
          name: "triageclassification",
          value: triage.classification || "OTHER",
        },
      ],
      stream: false,
    },
    REPLY_TOKEN,
  );
  if (result.status !== 200)
    throw new Error(
      "Reply " + result.status + ": " + (result.raw || "").slice(0, 300),
    );
  const parsed = extractJson(result.json && result.json.answer);
  if (!parsed)
    throw new Error("Reply unparseable: " + String(result.raw).slice(0, 300));
  return parsed;
}

async function processEmail(email) {
  console.log("[workflow] Processing: " + email.subject);
  db.prepare("UPDATE emails SET status = ? WHERE id = ?").run(
    "processing",
    email.id,
  );
  try {
    const triage = await callTriageAgent(email);
    console.log(
      "[workflow] Triage:",
      triage.classification,
      "conf=" + triage.confidence,
    );
    const classification = triage.classification || "OTHER";
    const sentiment = triage.sentiment || null;
    const urgency = triage.suggested_priority || null;

    const escalated =
      triage.escalation_triggered === true ||
      triage.escalation_triggered === "true"
        ? 1
        : 0;
    const escalationReason = escalated
      ? triage.escalation_reason || null
      : null;
    const reasoning = triage.reasoning || null;

    if (classification === "SPAM" || classification === "AD") {
      db.prepare(
        "UPDATE emails SET status = ?, classification = ?, sentiment = ?, urgency = ?, confidence = ?, escalation_triggered = ?, escalation_reason = ?, reasoning = ? WHERE id = ?",
      ).run(
        "archived",
        classification,
        sentiment,
        urgency,
        triage.confidence ?? null,
        escalated,
        escalationReason,
        reasoning,
        email.id,
      );
      console.log("[workflow] Archived as " + classification);
      return;
    }

    const draft = await callReplyAgent(email, triage);
    let draftReply = draft.body_plain || draft.body_html || "";
    const draftSubject = draft.subject || email.subject || "";
    // TODO: Root cause is in the Siteware Reply agent's system prompt — it emits
    // [SIGNATUR EINFÜGEN] literally instead of substituting the employeesignature
    // taskSetting we pass. Until that prompt is fixed upstream, substitute client-side.
    const tenantRowForSig = db
      .prepare("SELECT tone_profile FROM tenants WHERE id = ?")
      .get(email.tenant_id);
    let signature = "";
    try {
      const tp =
        tenantRowForSig && tenantRowForSig.tone_profile
          ? JSON.parse(tenantRowForSig.tone_profile)
          : {};
      signature = tp.email_signature || "";
    } catch (e) {}
    if (signature) {
      const before = draftReply;
      draftReply = draftReply.replace(
        /\[SIGNATUR EINF(Ü|UE)GEN\]/gi,
        signature,
      );
      if (before !== draftReply) {
        console.log("[workflow] Signature placeholder replaced");
      }
    }
    console.log("[workflow] Draft generated, length=" + draftReply.length);

    db.prepare(
      "UPDATE emails SET status = ?, classification = ?, sentiment = ?, urgency = ?, confidence = ?, draft_reply = ?, subject = COALESCE(?, subject), escalation_triggered = ?, escalation_reason = ?, reasoning = ? WHERE id = ?",
    ).run(
      "draft",
      classification,
      sentiment,
      urgency,
      triage.confidence ?? null,
      draftReply,
      draftSubject,
      escalated,
      escalationReason,
      reasoning,
      email.id,
    );
    console.log("[workflow] Done: " + email.subject);
  } catch (err) {
    console.error(
      "[workflow] Error processing email " + email.id + ":",
      err.message,
    );
    db.prepare("UPDATE emails SET status = ? WHERE id = ?").run(
      "error",
      email.id,
    );
  }
}

async function runWorkflowCycle() {
  const pending = db
    .prepare("SELECT * FROM emails WHERE status = ? LIMIT 5")
    .all("pending");
  if (pending.length > 0) {
    console.log("[workflow] Found " + pending.length + " pending emails");
    for (const email of pending) await processEmail(email);
  }
}

const INTERVAL = 30000;
console.log(
  "[workflow] Starting (triage mode: " +
    TRIAGE_MODE +
    "), checking every " +
    INTERVAL +
    "ms",
);
runWorkflowCycle();
setInterval(runWorkflowCycle, INTERVAL);
