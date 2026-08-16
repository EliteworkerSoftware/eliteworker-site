import { createClient } from "@supabase/supabase-js";

// Reuses your existing Supabase project — just add a new table in it
// for this site's leads (see README for the SQL to run).
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}
