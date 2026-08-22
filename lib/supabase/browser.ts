import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase navigateur, basé sur @supabase/ssr : la session est
 * stockée dans des cookies (et non en localStorage) afin que le middleware
 * et les Server Components puissent la lire. Réservé aux flux d'auth
 * (connexion, mot de passe oublié/réinitialisation) — pour les lectures
 * publiques hors auth, utiliser lib/supabase/client.ts.
 */
export const supabaseBrowser = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
