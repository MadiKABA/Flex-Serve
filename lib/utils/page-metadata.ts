import type { Metadata } from 'next';
import type { Page } from '@/lib/types/content';

/**
 * Construit le <title>/<meta description>/canonical d'une page publique à
 * partir de la ligne "pages" correspondante. La description privilégie
 * pages.meta_description (éditable dans l'admin) ; le title reste un texte
 * dédié par page (le titre en base est un label admin court, pas un title
 * SEO), passé en fallback avec la description.
 */
export function buildPageMetadata(
    page: Pick<Page, 'meta_description'>,
    path: string,
    fallback: { title: string; description: string }
): Metadata {
    return {
        title: fallback.title,
        description: page.meta_description?.trim() || fallback.description,
        alternates: { canonical: path },
    };
}
