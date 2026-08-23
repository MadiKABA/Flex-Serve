'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { assertAdmin, type ActionResult } from '@/lib/supabase/assert-admin';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';
import { isNonEmptyString, isSafeUrl, isValidLength } from '@/lib/utils/validate-input';
import type { PortfolioCategory } from '@/lib/types/content';

function revalidateServicePaths(slug?: string) {
    revalidatePath('/services');
    revalidatePath('/admin/services');
    if (slug) revalidatePath(`/admin/services/${slug}`);
}

/** Les 4 services par défaut partagent leur slug avec une catégorie portfolio. */
const PORTFOLIO_CATEGORIES: readonly PortfolioCategory[] = ['mariage', 'portrait', 'evenementiel', 'pub'];
function categoryForServiceSlug(slug: string): PortfolioCategory | null {
    return (PORTFOLIO_CATEGORIES as readonly string[]).includes(slug) ? (slug as PortfolioCategory) : null;
}

export async function updateService(
    serviceId: string,
    slug: string,
    data: {
        name: string;
        tag: string;
        description: string;
        href: string;
        cta_portfolio_label: string;
        cta_reservation_label: string;
        cta_reservation_url: string;
    }
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    if (!isNonEmptyString(data.name, 200)) {
        return { success: false, error: 'Le nom est requis (200 caractères max).' };
    }
    if (!isValidLength(data.tag, 50) || !isValidLength(data.description, 2000)) {
        return { success: false, error: 'Tag ou description trop longs.' };
    }
    if (!isSafeUrl(data.href) || !isSafeUrl(data.cta_reservation_url)) {
        return { success: false, error: 'URL invalide (schéma non autorisé).' };
    }
    if (!isValidLength(data.cta_portfolio_label, 100) || !isValidLength(data.cta_reservation_label, 100)) {
        return { success: false, error: 'Libellé de bouton trop long.' };
    }

    const { error } = await supabaseAdmin
        .from('services')
        .update({
            name: data.name,
            tag: data.tag || null,
            description: data.description || null,
            href: data.href,
            cta_portfolio_label: data.cta_portfolio_label,
            cta_reservation_label: data.cta_reservation_label,
            cta_reservation_url: data.cta_reservation_url,
            updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId);

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidateServicePaths(slug);
    return { success: true };
}

export async function toggleServiceVisibility(serviceId: string, isVisible: boolean): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin.from('services').update({ is_visible: isVisible }).eq('id', serviceId);
    if (error) return { success: false, error: `Échec de la mise à jour : ${error.message}` };

    revalidateServicePaths();
    return { success: true };
}

/** Réordonnancement (flèches) : échange la position avec le voisin immédiat parmi tous les services. */
export async function moveServicePosition(serviceId: string, direction: 'up' | 'down'): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: siblings, error: siblingsError } = await supabaseAdmin
        .from('services')
        .select('id, position')
        .order('position', { ascending: true });

    if (siblingsError || !siblings) {
        return { success: false, error: `Échec de lecture : ${siblingsError?.message ?? 'inconnue'}` };
    }

    const index = siblings.findIndex((s) => s.id === serviceId);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
        return { success: true };
    }

    const current = siblings[index];
    const target = siblings[swapIndex];

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
        supabaseAdmin.from('services').update({ position: target.position }).eq('id', current.id),
        supabaseAdmin.from('services').update({ position: current.position }).eq('id', target.id),
    ]);

    if (e1 || e2) return { success: false, error: `Échec du réordonnancement : ${e1?.message ?? e2?.message}` };

    revalidateServicePaths();
    return { success: true };
}

/**
 * Ajout d'une des 2 images d'un service (positions fixes 0/1, comme le hero
 * accueil). Refuse d'écraser un emplacement déjà occupé plutôt que de le
 * remplacer en silence.
 */
export async function confirmServiceMediaUpload(input: {
    serviceId: string;
    serviceSlug: string;
    position: 0 | 1;
    publicId: string;
    url: string;
}): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { count, error: countError } = await supabaseAdmin
        .from('media_items')
        .select('*', { count: 'exact', head: true })
        .eq('service_id', input.serviceId)
        .eq('position', input.position);

    if (countError) return { success: false, error: `Échec de lecture : ${countError.message}` };

    if ((count ?? 0) > 0) {
        return { success: false, error: 'Cet emplacement est déjà occupé. Supprimez-le avant de le remplacer.' };
    }

    const { error } = await supabaseAdmin.from('media_items').insert({
        service_id: input.serviceId,
        cloudinary_public_id: input.publicId,
        cloudinary_url: input.url,
        category: categoryForServiceSlug(input.serviceSlug),
        position: input.position,
    });

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidateServicePaths(input.serviceSlug);
    return { success: true };
}

/** Supprime d'abord sur Cloudinary ; la ligne media_items n'est retirée que si ça réussit. */
export async function deleteServiceMediaItem(
    mediaId: string,
    publicId: string,
    serviceSlug: string
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const deleted = await deleteCloudinaryAsset(publicId);
    if (!deleted) {
        return { success: false, error: 'La suppression sur Cloudinary a échoué — la photo a été conservée.' };
    }

    const { error } = await supabaseAdmin.from('media_items').delete().eq('id', mediaId);
    if (error) {
        return {
            success: false,
            error: `Photo supprimée sur Cloudinary mais échec de suppression en base : ${error.message}`,
        };
    }

    revalidateServicePaths(serviceSlug);
    return { success: true };
}

export async function updateServiceMediaMeta(
    mediaId: string,
    serviceSlug: string,
    data: { alt_text: string; title: string }
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin
        .from('media_items')
        .update({ alt_text: data.alt_text || null, title: data.title || null })
        .eq('id', mediaId);

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidateServicePaths(serviceSlug);
    return { success: true };
}
