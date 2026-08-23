// One-off/escape-hatch CLI for creating (or resetting) an admin account
// directly against Supabase — useful for the very first owner account,
// since the in-app "add admin" UI requires an existing owner to use it,
// and useful later if every owner account is ever lost.
//
// Usage: node scripts/create-admin.mjs <email> <password> <owner|viewer>

import { readFileSync } from "fs";
import { randomBytes, scryptSync } from "crypto";
import { createClient } from "@supabase/supabase-js";

// supabase-js unconditionally initializes a realtime client, which requires a
// global WebSocket constructor — present in Node 22+ but not Node 20. This
// script never uses realtime features, so a stub is enough to satisfy the check.
if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class {};
}

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const [email, password, role] = process.argv.slice(2);
  if (!email || !password || !["owner", "viewer"].includes(role)) {
    console.error("Usage: node scripts/create-admin.mjs <email> <password> <owner|viewer>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  loadEnvLocal();
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase
    .from("eliteworker_admin_users")
    .upsert(
      { email: email.toLowerCase().trim(), password_hash: hashPassword(password), role },
      { onConflict: "email" }
    );

  if (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }
  console.log(`✓ ${email} is now a${role === "owner" ? "n" : ""} ${role}.`);
}

main();
