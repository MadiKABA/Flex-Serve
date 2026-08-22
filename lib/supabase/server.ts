// ⚠️ Client Supabase "service role" — bypass TOUTES les policies RLS.
// Ne JAMAIS importer ce fichier dans un composant ou module marqué 'use client'.
// Réservé aux Server Actions et Route Handlers, pour les opérations d'écriture
// admin (create/update/delete) sur pages, sections, media_items, services,
// site_settings, navigation_items.
import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
