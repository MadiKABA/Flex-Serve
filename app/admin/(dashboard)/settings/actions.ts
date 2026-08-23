'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createSupabaseServerClient } from '@/lib/supabase/session';
import type { SiteSettings } from '@/lib/data/site-settings';

type ActionResult = { success: true } | { success: false; error: string };

async function assertAdmin(): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Session expirée. Merci de te reconnecter.' };
    }

    const { data: adminRow } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (!adminRow) {
        return { success: false, error: 'Accès non autorisé.' };
    }

    return { success: true };
}

/**
 * Upsert des 6 coordonnées (clé/valeur) lues sur la page Contact, le
 * Footer et le JSON-LD du layout. revalidatePath('/', 'layout') invalide
 * tout le site d'un coup puisque le Footer/JSON-LD sont sur toutes les pages.
 */
export async function updateSiteSettings(data: SiteSettings): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const now = new Date().toISOString();
    const rows = (Object.keys(data) as (keyof SiteSettings)[]).map((key) => ({
        key,
        value: data[key] ?? '',
        updated_at: now,
    }));

    const { error } = await supabaseAdmin.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidatePath('/', 'layout');
    return { success: true };
}
