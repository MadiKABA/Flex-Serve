'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { assertAdmin, type ActionResult } from '@/lib/supabase/assert-admin';
import { isSafeUrl, isValidEmailOrEmpty, isValidLength } from '@/lib/utils/validate-input';
import type { SiteSettings } from '@/lib/data/site-settings';

/**
 * Upsert des 6 coordonnées (clé/valeur) lues sur la page Contact, le
 * Footer et le JSON-LD du layout. revalidatePath('/', 'layout') invalide
 * tout le site d'un coup puisque le Footer/JSON-LD sont sur toutes les pages.
 */
export async function updateSiteSettings(data: SiteSettings): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    if (!isValidEmailOrEmpty(data.contact_email)) {
        return { success: false, error: 'Adresse email invalide.' };
    }
    if (!isSafeUrl(data.facebook_url) || !isSafeUrl(data.instagram_url) || !isSafeUrl(data.tiktok_url)) {
        return { success: false, error: 'URL de réseau social invalide (schéma non autorisé).' };
    }
    if (!isValidLength(data.contact_phone, 50) || !isValidLength(data.address, 300)) {
        return { success: false, error: 'Téléphone ou adresse trop long.' };
    }

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
