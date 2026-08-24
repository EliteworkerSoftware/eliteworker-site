import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class {};
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase.from("eliteworker_leads").delete().eq("email", "repro-test@example.com").select("id");
console.log(error ? "ERROR: " + error.message : `Deleted ${data.length} test lead(s)`);
