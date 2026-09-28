import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lagrer klikkdata fra brukertesting i Supabase-tabellen "klikk".

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nokkel = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let klient: SupabaseClient | null = null;
if (url && nokkel) {
  klient = createClient(url, nokkel, { auth: { persistSession: false } });
}

// Hvert besøk får en tilfeldig ID, så vi kan følge én person uten å vite hvem det er.
function oktId(): string {
  try {
    let id = sessionStorage.getItem("okt");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("okt", id);
    }
    return id;
  } catch {
    return "ukjent";
  }
}

export function loggKlikk(hendelse: string, detaljer?: Record<string, unknown>) {
  if (!klient) return;
  klient
    .from("klikk")
    .insert({ okt: oktId(), hendelse, detaljer: detaljer ?? null })
    .then(({ error }) => {
      if (error) console.warn("Klarte ikke å lagre klikk:", error.message);
    });
}
