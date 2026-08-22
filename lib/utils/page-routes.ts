import type { PortfolioCategory } from '@/lib/types/content';

/**
 * Mapping entre le slug stocké dans la table "pages" et la route
 * publique correspondante, utilisé pour revalidatePath() après chaque
 * écriture admin.
 */
const PUBLIC_PATH_BY_SLUG: Record<string, string> = {
    accueil: '/',
    about: '/about',
    services: '/services',
    contact: '/contact',
    reservation: '/reservation',
    'portfolio-mariage': '/portfolio/mariage',
    'portfolio-portrait': '/portfolio/portrait',
    'portfolio-evenementiel': '/portfolio/evenementiel',
    'portfolio-pub': '/portfolio/pub',
};

/** Les 4 pages portfolio correspondent 1:1 à une valeur de l'enum media_items.category. */
const PORTFOLIO_CATEGORY_BY_SLUG: Record<string, PortfolioCategory> = {
    'portfolio-mariage': 'mariage',
    'portfolio-portrait': 'portrait',
    'portfolio-evenementiel': 'evenementiel',
    'portfolio-pub': 'pub',
};

export function getPublicPath(dbSlug: string): string | null {
    return PUBLIC_PATH_BY_SLUG[dbSlug] ?? null;
}

/** null pour les pages qui ne correspondent à aucune catégorie portfolio (accueil, about, ...). */
export function getPortfolioCategory(dbSlug: string): PortfolioCategory | null {
    return PORTFOLIO_CATEGORY_BY_SLUG[dbSlug] ?? null;
}

/** Dossier Cloudinary cible pour l'upload : flexserve/{catégorie} ou flexserve/{slug} à défaut. */
export function getUploadFolder(dbSlug: string): string {
    return `flexserve/${getPortfolioCategory(dbSlug) ?? dbSlug}`;
}
