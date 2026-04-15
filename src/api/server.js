require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDb } = require("../db");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/emails", require("./routes/emails"));

app.use(express.static(path.join(__dirname, "../../public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
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
