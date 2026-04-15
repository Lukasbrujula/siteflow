require("dotenv").config();
const { db } = require("../db");
const https = require("https");

const SITEWARE_API = "https://api.siteware.io";
const TRIAGE_AGENT_ID = process.env.SITEWARE_TRIAGE_AGENT_ID;
const REPLY_AGENT_ID = process.env.SITEWARE_REPLY_AGENT_ID;
const API_TOKEN = process.env.SITEWARE_API_TOKEN;

function httpsPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: "api.siteware.io",
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN,
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body });
        }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function callTriageAgent(email) {
  const result = await httpsPost("/v1/api/completion/" + TRIAGE_AGENT_ID, {
    taskSettings: [
      { name: "fromaddress", value: email.from_address || "" },
      { name: "subject", value: email.subject || "" },
      { name: "body", value: (email.body || "").substring(0, 3000) },
      { name: "headers", value: "" },
      { name: "attachments", value: "" },
    ],
    stream: false,
  });
  try {
    const parsed =
      typeof result.answer === "string"
        ? JSON.parse(result.answer)
        : result.answer;
    return parsed;
  } catch (e) {
    const match = (result.answer || "").match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  }
}

async function callReplyAgent(email, triage) {
  const tenantRow = db
    .prepare("SELECT tone_profile FROM tenants WHERE id = ?")
    .get(email.tenant_id);
  let emailsignature = "";
  try {
    const toneProfile = tenantRow?.tone_profile
      ? JSON.parse(tenantRow.tone_profile)
      : {};
    emailsignature = toneProfile.email_signature || "";
  } catch (e) {}

  const originalemail =
    "From: " +
    (email.from_address || "") +
    "\nSubject: " +
    (email.subject || "") +
    "\n\n" +
    (email.body || "").substring(0, 3000);

  const result = await httpsPost("/v1/api/completion/" + REPLY_AGENT_ID, {
    taskSettings: [
      { name: "originalsubject", value: email.subject || "" },
      { name: "originalemail", value: originalemail },
      { name: "knowledgebase", value: "" },
      { name: "emailsignature", value: emailsignature },
      { name: "classification", value: triage.classification || "" },
    ],
    stream: false,
  });
  return result.answer || "";
}

async function processEmail(email) {
  console.log("[workflow] Processing: " + email.subject);

  db.prepare("UPDATE emails SET status = ? WHERE id = ?").run(
    "processing",
    email.id,
  );

  try {
    const triage = await callTriageAgent(email);
    console.log("[workflow] Triage result:", triage.classification);

    const classification = triage.classification || "OTHER";
    const sentiment = triage.sentiment
      ? JSON.stringify(triage.sentiment)
      : null;
    const urgency = triage.sentiment?.urgency
      ? String(triage.sentiment.urgency)
      : null;

    if (classification === "SPAM" || classification === "AD") {
      db.prepare(
        "UPDATE emails SET status = ?, classification = ?, sentiment = ?, urgency = ? WHERE id = ?",
      ).run("archived", classification, sentiment, urgency, email.id);
      console.log("[workflow] Archived as " + classification);
      return;
    }

    const draft = await callReplyAgent(email, triage);
    console.log("[workflow] Draft generated, length: " + draft.length);

    db.prepare(
      "UPDATE emails SET status = ?, classification = ?, sentiment = ?, urgency = ?, draft_reply = ? WHERE id = ?",
    ).run("draft", classification, sentiment, urgency, draft, email.id);

    console.log("[workflow] Done: " + email.subject);
  } catch (err) {
    console.error("[workflow] Error processing email:", err.message);
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
    for (const email of pending) {
      await processEmail(email);
    }
  }
}

const INTERVAL = 30000;
console.log("[workflow] Starting, checking every " + INTERVAL + "ms");
runWorkflowCycle();
setInterval(runWorkflowCycle, INTERVAL);
