'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { assertAdmin, type ActionResult } from '@/lib/supabase/assert-admin';
import { isValidLength } from '@/lib/utils/validate-input';

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

    if (stats.some((s) => !isValidLength(s.label, 50) || !isValidLength(s.value, 50))) {
        return { success: false, error: 'Label ou valeur trop long (50 caractères max).' };
    }

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

    if (!isValidLength(data.name, 100)) {
        return { success: false, error: 'Nom trop long (100 caractères max).' };
    }

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
