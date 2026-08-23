'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { assertAdmin, type ActionResult } from '@/lib/supabase/assert-admin';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';
import { getPublicPath } from '@/lib/utils/page-routes';
import { isSafeUrl, isValidLength } from '@/lib/utils/validate-input';
import type { GalleryLayout, PortfolioCategory } from '@/lib/types/content';

function revalidatePublicPage(dbSlug: string) {
    const publicPath = getPublicPath(dbSlug);
    if (publicPath) revalidatePath(publicPath);
    revalidatePath(`/admin/pages/${dbSlug}`);
    revalidatePath('/admin/pages');
}

export async function togglePagePublished(
    pageId: string,
    dbSlug: string,
    isPublished: boolean
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin.from('pages').update({ is_published: isPublished }).eq('id', pageId);
    if (error) return { success: false, error: `Échec de la mise à jour : ${error.message}` };

    revalidatePublicPage(dbSlug);
    return { success: true };
}

export async function saveSectionText(
    sectionId: string,
    dbSlug: string,
    data: {
        title: string;
        subtitle: string;
        body: string;
        cta_label: string;
        cta_url: string;
        cta_label_2: string;
        cta_url_2: string;
    }
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    if (
        !isValidLength(data.title, 200) ||
        !isValidLength(data.subtitle, 300) ||
        !isValidLength(data.body, 5000) ||
        !isValidLength(data.cta_label, 100) ||
        !isValidLength(data.cta_label_2, 100)
    ) {
        return { success: false, error: 'Un des champs texte dépasse la longueur autorisée.' };
    }
    if (!isSafeUrl(data.cta_url) || !isSafeUrl(data.cta_url_2)) {
        return { success: false, error: 'URL de bouton invalide (schéma non autorisé).' };
    }

    const { error } = await supabaseAdmin
        .from('sections')
        .update({
            title: data.title || null,
            subtitle: data.subtitle || null,
            body: data.body || null,
            cta_label: data.cta_label || null,
            cta_url: data.cta_url || null,
            cta_label_2: data.cta_label_2 || null,
            cta_url_2: data.cta_url_2 || null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', sectionId);

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidatePublicPage(dbSlug);
    return { success: true };
}

export async function saveSectionLayout(
    sectionId: string,
    dbSlug: string,
    layout: GalleryLayout
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin.from('sections').update({ layout }).eq('id', sectionId);
    if (error) return { success: false, error: `Échec de la mise à jour du layout : ${error.message}` };

    revalidatePublicPage(dbSlug);
    return { success: true };
}

export async function toggleSectionVisibility(
    sectionId: string,
    dbSlug: string,
    isVisible: boolean
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin.from('sections').update({ is_visible: isVisible }).eq('id', sectionId);
    if (error) return { success: false, error: `Échec de la mise à jour : ${error.message}` };

    revalidatePublicPage(dbSlug);
    return { success: true };
}

/** Ajout d'une photo dans une galerie à taille libre (position = dernière + 1). */
export async function confirmMediaUpload(input: {
    sectionId: string;
    dbSlug: string;
    category: PortfolioCategory | null;
    publicId: string;
    url: string;
}): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: last, error: lastError } = await supabaseAdmin
        .from('media_items')
        .select('position')
        .eq('section_id', input.sectionId)
        .order('position', { ascending: false })
        .limit(1);

    if (lastError) return { success: false, error: `Échec de lecture : ${lastError.message}` };

    const nextPosition = last && last.length > 0 ? last[0].position + 1 : 0;

    const { error } = await supabaseAdmin.from('media_items').insert({
        section_id: input.sectionId,
        cloudinary_public_id: input.publicId,
        cloudinary_url: input.url,
        category: input.category,
        position: nextPosition,
    });

    if (error) return { success: false, error: `Échec de l'enregistrement en base : ${error.message}` };

    revalidatePublicPage(input.dbSlug);
    return { success: true };
}

/**
 * Ajout d'une photo dans une section à emplacements fixes (hero accueil :
 * 3 images ; WeddingCTA : 2 images). Refuse toute image au-delà de
 * `maxImages` plutôt que de remplacer en silence. `maxImages` défaut à 3
 * pour rester rétrocompatible avec le hero accueil (seul appelant existant).
 */
export async function confirmHeroImage(input: {
    sectionId: string;
    dbSlug: string;
    position: number;
    publicId: string;
    url: string;
    maxImages?: number;
}): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const limit = input.maxImages ?? 3;

    const { count, error: countError } = await supabaseAdmin
        .from('media_items')
        .select('*', { count: 'exact', head: true })
        .eq('section_id', input.sectionId);

    if (countError) return { success: false, error: `Échec de lecture : ${countError.message}` };

    if ((count ?? 0) >= limit) {
        return {
            success: false,
            error: `Cette section accepte exactement ${limit} image${limit > 1 ? 's' : ''}. Supprimez-en une avant d'en ajouter une nouvelle.`,
        };
    }

    const { error } = await supabaseAdmin.from('media_items').insert({
        section_id: input.sectionId,
        cloudinary_public_id: input.publicId,
        cloudinary_url: input.url,
        position: input.position,
    });

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidatePublicPage(input.dbSlug);
    return { success: true };
}

/**
 * Remplace l'image de fond d'un hero (background_media_id) : upload +
 * insert media_items, bascule sections.background_media_id vers la
 * nouvelle ligne, puis supprime l'ancienne image (Cloudinary puis ligne)
 * une fois le remplacement confirmé en base.
 */
export async function updateHeroBackground(input: {
    sectionId: string;
    dbSlug: string;
    publicId: string;
    url: string;
    previousMediaId: string | null;
    previousPublicId: string | null;
}): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: inserted, error: insertError } = await supabaseAdmin
        .from('media_items')
        .insert({
            section_id: input.sectionId,
            cloudinary_public_id: input.publicId,
            cloudinary_url: input.url,
            position: 0,
        })
        .select('id')
        .single();

    if (insertError || !inserted) {
        return { success: false, error: `Échec de l'enregistrement : ${insertError?.message ?? 'inconnue'}` };
    }

    const { error: updateError } = await supabaseAdmin
        .from('sections')
        .update({ background_media_id: inserted.id, updated_at: new Date().toISOString() })
        .eq('id', input.sectionId);

    if (updateError) {
        return { success: false, error: `Échec de la mise à jour de la section : ${updateError.message}` };
    }

    if (input.previousMediaId) {
        if (input.previousPublicId) {
            await deleteCloudinaryAsset(input.previousPublicId);
        }
        await supabaseAdmin.from('media_items').delete().eq('id', input.previousMediaId);
    }

    revalidatePublicPage(input.dbSlug);
    return { success: true };
}

/** Supprime d'abord sur Cloudinary ; la ligne media_items n'est retirée que si ça réussit. */
export async function deleteMediaItem(mediaId: string, publicId: string, dbSlug: string): Promise<ActionResult> {
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

    revalidatePublicPage(dbSlug);
    return { success: true };
}

export async function updateMediaMeta(
    mediaId: string,
    dbSlug: string,
    data: { alt_text: string; title: string }
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { error } = await supabaseAdmin
        .from('media_items')
        .update({ alt_text: data.alt_text || null, title: data.title || null })
        .eq('id', mediaId);

    if (error) return { success: false, error: `Échec de l'enregistrement : ${error.message}` };

    revalidatePublicPage(dbSlug);
    return { success: true };
}

/** Réordonnancement V1 (flèches) : échange la position avec le voisin immédiat. */
export async function moveMediaItem(
    mediaId: string,
    direction: 'up' | 'down',
    dbSlug: string
): Promise<ActionResult> {
    const guard = await assertAdmin();
    if (!guard.success) return guard;

    const { data: item, error: itemError } = await supabaseAdmin
        .from('media_items')
        .select('id, section_id')
        .eq('id', mediaId)
        .single();

    if (itemError || !item) return { success: false, error: 'Photo introuvable.' };

    const { data: siblings, error: siblingsError } = await supabaseAdmin
        .from('media_items')
        .select('id, position')
        .eq('section_id', item.section_id)
        .order('position', { ascending: true });

    if (siblingsError || !siblings) {
        return { success: false, error: `Échec de lecture : ${siblingsError?.message ?? 'inconnue'}` };
    }

    const index = siblings.findIndex((s) => s.id === mediaId);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
        return { success: true };
    }

    const current = siblings[index];
    const target = siblings[swapIndex];

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
        supabaseAdmin.from('media_items').update({ position: target.position }).eq('id', current.id),
        supabaseAdmin.from('media_items').update({ position: current.position }).eq('id', target.id),
    ]);

    if (e1 || e2) return { success: false, error: `Échec du réordonnancement : ${e1?.message ?? e2?.message}` };

    revalidatePublicPage(dbSlug);
    return { success: true };
}
