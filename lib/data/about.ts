import { supabase } from '@/lib/supabase/client';
import type { AboutPartner, AboutStat } from '@/lib/types/content';

/** Lecture publique (client anon, respecte RLS) des 4 stats chiffrées, triées par position. */
export async function getAboutStats(): Promise<AboutStat[]> {
    const { data } = await supabase.from('about_stats').select('*').order('position').returns<AboutStat[]>();
    return data ?? [];
}

/** Lecture publique (client anon, respecte RLS) des partenaires visibles, triés par position. */
export async function getAboutPartners(): Promise<AboutPartner[]> {
    const { data } = await supabase
        .from('about_partners')
        .select('*')
        .eq('is_visible', true)
        .order('position')
        .returns<AboutPartner[]>();
    return data ?? [];
}
