import { cache } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { MediaItem, Page, Section } from '@/lib/types/content';

export interface PageData {
    page: Page;
    sections: Section[];
    mediaBySection: Map<string, MediaItem[]>;
    backgroundBySection: Map<string, { url: string; alt: string | null }>;
}

/**
 * Lecture publique (client anon, respecte RLS) d'une page standard + ses
 * sections visibles, ordonnées par position, avec leurs media_items et
 * l'image de fond de chaque section (résolue via background_media_id).
 *
 * Enveloppée dans React cache() : generateMetadata() et le composant de
 * page appellent tous deux getPageData(slug) pour le même rendu — sans ça,
 * ce serait deux allers-retours Supabase identiques par requête.
 */
export const getPageData = cache(async (slug: string): Promise<PageData | null> => {
    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle<Page>();
    if (!page) return null;

    const { data: sections } = await supabase
        .from('sections')
        .select('*')
        .eq('page_id', page.id)
        .order('position')
        .returns<Section[]>();

    const visibleSections = (sections ?? []).filter((s) => s.is_visible);
    const sectionIds = visibleSections.map((s) => s.id);

    const mediaBySection = new Map<string, MediaItem[]>();
    if (sectionIds.length > 0) {
        const { data: media } = await supabase
            .from('media_items')
            .select('*')
            .in('section_id', sectionIds)
            .order('position')
            .returns<MediaItem[]>();

        for (const item of media ?? []) {
            if (!item.section_id) continue;
            const list = mediaBySection.get(item.section_id) ?? [];
            list.push(item);
            mediaBySection.set(item.section_id, list);
        }
    }

    const backgroundBySection = new Map<string, { url: string; alt: string | null }>();
    const backgroundIds = visibleSections
        .map((s) => s.background_media_id)
        .filter((id): id is string => !!id);

    if (backgroundIds.length > 0) {
        const { data: bgMedia } = await supabase
            .from('media_items')
            .select('id, cloudinary_url, alt_text')
            .in('id', backgroundIds);

        const bgById = new Map((bgMedia ?? []).map((m) => [m.id, m]));
        for (const section of visibleSections) {
            if (!section.background_media_id) continue;
            const bg = bgById.get(section.background_media_id);
            if (bg) backgroundBySection.set(section.id, { url: bg.cloudinary_url, alt: bg.alt_text });
        }
    }

    return { page, sections: visibleSections, mediaBySection, backgroundBySection };
});
