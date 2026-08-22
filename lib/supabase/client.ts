import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase public (clé anon).
 * Soumis aux policies RLS — lecture seule des données publiques
 * (pages, sections, media_items, services) pour un visiteur non connecté.
 * Importable aussi bien dans des Server Components que des Client Components.
 */
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
