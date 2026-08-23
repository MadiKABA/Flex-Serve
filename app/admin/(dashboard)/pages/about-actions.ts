'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createSupabaseServerClient } from '@/lib/supabase/session';

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

function revalidateAbout() {
    revalidatePath('/about');
    revalidatePath('/admin/pages/about');
}

/** Édition groupée des 4 stats (label + value) — toujours exactement 4 lignes, pas d'ajout/suppression ici. */
export async function updateAboutStats(
    stats: { id: string; label: string; value: string }[]
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const now = new Date().toISOString();
    const results = await Promise.all(
        stats.map((s) =>
            supabaseAdmin.from('about_stats').update({ label: s.label, value: s.value, updated_at: now }).eq('id', s.id)
        )
    );

    const failed = results.find((r) => r.error);
    if (failed?.error) return { success: false, error: `Échec de l'enregistrement : ${failed.error.message}` };

    revalidateAbout();
    return { success: true };
}

/** Réordonnancement (flèches) : échange la position avec le voisin immédiat. */
export async function moveAboutStatPosition(statId: string, direction: 'up' | 'down'): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: siblings, error: siblingsError } = await supabaseAdmin
        .from('about_stats')
        .select('id, position')
        .order('position', { ascending: true });

    if (siblingsError || !siblings) {
        return { success: false, error: `Échec de lecture : ${siblingsError?.message ?? 'inconnue'}` };
    }

    const index = siblings.findIndex((s) => s.id === statId);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
        return { success: true };
    }

    const current = siblings[index];
    const target = siblings[swapIndex];

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
        supabaseAdmin.from('about_stats').update({ position: target.position }).eq('id', current.id),
        supabaseAdmin.from('about_stats').update({ position: current.position }).eq('id', target.id),
    ]);

    if (e1 || e2) return { success: false, error: `Échec du réordonnancement : ${e1?.message ?? e2?.message}` };

    revalidateAbout();
    return { success: true };
}

/** Ajout d'un partenaire (position = dernière + 1, nom vide à compléter dans l'admin). */
export async function addPartner(): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: last, error: lastError } = await supabaseAdmin
        .from('about_partners')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

    if (lastError) return { success: false, error: `Échec de lecture : ${lastError.message}` };

    const nextPosition = last && last.length > 0 ? last[0].position + 1 : 0;

    const { error } = await supabaseAdmin.from('about_partners').insert({ name: '', position: nextPosition });
    if (error) return { success: false, error: `Échec de l'ajout : ${error.message}` };

    revalidateAbout();
    return { success: true };
}

export async function updatePartner(
    partnerId: string,
    data: { name: string; is_visible: boolean }
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin
        .from('about_partners')
        .update({ name: data.name, is_visible: data.is_visible, updated_at: new Date().toISOString() })
        .eq('id', partnerId);

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidateAbout();
    return { success: true };
}

export async function deletePartner(partnerId: string): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin.from('about_partners').delete().eq('id', partnerId);
    if (error) return { success: false, error: `Échec de la suppression : ${error.message}` };

    revalidateAbout();
    return { success: true };
}

/** Réordonnancement (flèches) : échange la position avec le voisin immédiat. */
export async function movePartnerPosition(partnerId: string, direction: 'up' | 'down'): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: siblings, error: siblingsError } = await supabaseAdmin
        .from('about_partners')
        .select('id, position')
        .order('position', { ascending: true });

    if (siblingsError || !siblings) {
        return { success: false, error: `Échec de lecture : ${siblingsError?.message ?? 'inconnue'}` };
    }

    const index = siblings.findIndex((s) => s.id === partnerId);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
        return { success: true };
    }

    const current = siblings[index];
    const target = siblings[swapIndex];

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
        supabaseAdmin.from('about_partners').update({ position: target.position }).eq('id', current.id),
        supabaseAdmin.from('about_partners').update({ position: current.position }).eq('id', target.id),
    ]);

    if (e1 || e2) return { success: false, error: `Échec du réordonnancement : ${e1?.message ?? e2?.message}` };

    revalidateAbout();
    return { success: true };
}
