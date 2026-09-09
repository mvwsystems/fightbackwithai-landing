// netlify/functions/intake.mjs — Netlify Function (v2 API)
// POST /.netlify/functions/intake
//
// Flow: form → validate → Claude Fable 5.1 runs the Productize Brain (/intake phase)
//       → email raw intake + first-pass analysis + JSON attachment to hello@6signal.co via Resend
//
// Env vars (Netlify → Site configuration → Environment variables):
//   ANTHROPIC_API_KEY   required
//   RESEND_API_KEY      required
//   INTAKE_FROM         required — verified Resend sender, e.g. intake@fightbackwithai.com
//   INTAKE_TO           optional, default hello@6signal.co
//   ANTHROPIC_MODEL     optional, default claude-fable-5-1
//
// The prompt file prompts/productize-brain.md must be listed in netlify.toml under
// [functions] included_files so it ships with the function bundle.

import fs from "node:fs";
import path from "node:path";

const TO = process.env.INTAKE_TO || "hello@6signal.co";
const FROM = process.env.INTAKE_FROM || "intake@fightbackwithai.com";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-fable-5-1";

function brainPrompt() {
  const candidates = [
    path.join(process.cwd(), "prompts", "productize-brain.md"),
    path.join(process.env.LAMBDA_TASK_ROOT || "", "prompts", "productize-brain.md"),
    path.resolve("prompts/productize-brain.md"),
  ];
  for (const p of candidates) if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  throw new Error("productize-brain.md not found — check included_files in netlify.toml");
}

const esc = (s = "") => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const asText = d => Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n");

async function analyze(intake) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: brainPrompt(),
      messages: [{
        role: "user",
        content: "/intake\n\nNew intake submission below. Run Phase 1 (Intake Read) only and return the Intake Brief.\n\n" + asText(intake),
      }],
    }),
  });
  if (!res.ok) throw new Error("Anthropic " + res.status + " " + (await res.text()));
  const data = await res.json();
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

async function sendEmail({ intake, analysis, analysisError }) {
  const subject = `Intake: ${intake.name || "Unknown"}${intake.business ? " — " + intake.business : ""}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:720px">
      <h2 style="margin:0 0 8px">${esc(subject)}</h2>
      <p style="color:#555;margin:0 0 20px">${esc(intake.email)} · ${esc(intake.phone || "")} · ${esc(intake.website || "")}</p>
      <h3>First-pass analysis (Productize Brain, Phase 1)</h3>
      <pre style="white-space:pre-wrap;background:#f4f2ee;padding:16px">${analysis ? esc(analysis) : "Analysis failed: " + esc(analysisError)}</pre>
      <h3>Raw intake</h3>
      <pre style="white-space:pre-wrap;background:#f4f2ee;padding:16px">${esc(asText(intake))}</pre>
      <p style="color:#777;font-size:13px">JSON attached. Paste it, plus the call transcript later, into your Productize Brain session.</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `FBWA Intake <${FROM}>`,
      to: [TO],
      reply_to: intake.email,
      subject,
      html,
      attachments: [{
        filename: `intake-${(intake.name || "unknown").replace(/\W+/g, "-").toLowerCase()}.json`,
        content: Buffer.from(JSON.stringify(intake, null, 2)).toString("base64"),
      }],
    }),
  });
  if (!res.ok) throw new Error("Resend " + res.status + " " + (await res.text()));
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let intake;
  try { intake = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }

  if (!intake.name || !intake.email || !intake.what_you_do) return json({ error: "Missing required fields" }, 400);
  if (intake.company_fax) return json({ ok: true }); // honeypot

  let analysis = null, analysisError = null;
  try { analysis = await analyze(intake); } catch (e) { analysisError = e.message; }

  try {
    await sendEmail({ intake, analysis, analysisError });
  } catch (e) {
    console.error(e);
    return json({ error: "Email failed" }, 500);
  }
  return json({ ok: true });
};

export const config = { path: "/api/intake" };
