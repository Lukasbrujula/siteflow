require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const https = require("https");
const { initDb, db } = require("../db");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/emails", require("./routes/emails"));

app.use(express.static(path.join(__dirname, "../../public")));

app.get("/api/health", async (req, res) => {
  const checks = {};

  // DB check
  try {
    const row = db
      .prepare("SELECT MAX(created_at) as last_email FROM emails")
      .get();
    checks.db = "ok";
    checks.poller =
      row && row.last_email
        ? new Date(row.last_email * 1000).toISOString()
        : null;
  } catch (err) {
    checks.db = "error";
    checks.poller = null;
  }

  // Error count
  try {
    const row = db
      .prepare("SELECT COUNT(*) as c FROM emails WHERE status = 'error'")
      .get();
    checks.error_count = row ? row.c : 0;
  } catch (err) {
    checks.error_count = null;
  }

  // Siteware token check
  const token =
    process.env.SITEWARE_TRIAGE_TOKEN || process.env.SITEWARE_API_TOKEN;
  if (!token) {
    checks.siteware_token = "not_configured";
  } else {
    checks.siteware_token = await new Promise((resolve) => {
      const timer = setTimeout(() => {
        req_sw.destroy();
        resolve("timeout");
      }, 3000);

      const req_sw = https.request(
        {
          hostname: "api.siteware.io",
          path: "/v1/api/agents",
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        },
        (resp) => {
          clearTimeout(timer);
          resp.resume();
          resolve(resp.statusCode === 200 ? "valid" : "invalid");
        },
      );
      req_sw.on("error", () => {
        clearTimeout(timer);
        resolve("invalid");
      });
      req_sw.end();
    });
  }

  const status =
    checks.db === "error"
      ? "down"
      : checks.siteware_token === "valid" ||
          checks.siteware_token === "not_configured"
        ? "ok"
        : "degraded";
  res
    .status(status === "down" ? 500 : 200)
    .json({ status, checks, time: new Date().toISOString() });
});

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log("[server] Running on port " + PORT);
  });
}

start().catch((err) => {
  console.error("[server] Failed to start:", err);
  process.exit(1);
});

module.exports = app;
