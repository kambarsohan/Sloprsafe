import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn("Supabase configuration is missing. Copy .env.example to .env.local before running the app.");
}

export const supabase = createClient(
  supabaseUrl || "https://qdhzhluhjxtuklddzhle.supabase.co",
  supabasePublishableKey || "sb_publishable_sOZonJgMNSqTP4e7px_Y0Q_IwDyzZKM",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
