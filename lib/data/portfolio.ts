import { supabase } from '@/lib/supabase/client';
import type { MediaItem, Page, Section } from '@/lib/types/content';

export interface PortfolioPageData {
    page: Page;
    sections: Section[];
    mediaBySection: Map<string, MediaItem[]>;
    heroBackground: { url: string; alt: string | null } | null;
}

/**
 * Lecture publique (client anon, respecte RLS) d'une page + ses sections
 * visibles + les media_items de chaque section. L'image de fond du hero
 * est résolue via section.background_media_id.
 */
export async function getPortfolioPageData(slug: string): Promise<PortfolioPageData | null> {
    const { data: page } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle<Page>();
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

    const heroSection = visibleSections.find((s) => s.type === 'hero');
    let heroBackground: { url: string; alt: string | null } | null = null;
    if (heroSection?.background_media_id) {
        const { data: bgMedia } = await supabase
            .from('media_items')
            .select('cloudinary_url, alt_text')
            .eq('id', heroSection.background_media_id)
            .maybeSingle();
        if (bgMedia) heroBackground = { url: bgMedia.cloudinary_url, alt: bgMedia.alt_text };
    }

    return { page, sections: visibleSections, mediaBySection, heroBackground };
}
