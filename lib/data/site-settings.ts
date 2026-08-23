import { supabase } from '@/lib/supabase/client';

export interface SiteSettings {
    contact_email: string;
    contact_phone: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
}

const DEFAULTS: SiteSettings = {
    contact_email: '',
    contact_phone: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
};

/**
 * Lecture publique (client anon, respecte RLS) de la table clé/valeur
 * site_settings. Source unique pour les coordonnées et liens sociaux,
 * utilisée par la page Contact, le Footer et le JSON-LD du layout.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
    const { data } = await supabase.from('site_settings').select('key, value');

    const settings: SiteSettings = { ...DEFAULTS };
    for (const row of data ?? []) {
        if (row.key in settings) {
            (settings as unknown as Record<string, string>)[row.key] = row.value ?? '';
        }
    }
    return settings;
}
