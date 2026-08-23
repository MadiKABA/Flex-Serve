import type { PortfolioCategory } from '@/lib/types/content';

/**
 * Logique de dossier Cloudinary — SOURCE UNIQUE, partagée entre le script de
 * migration ponctuel (scripts/migrate-images.ts, import relatif car exécuté
 * hors résolution de path Next/ts-node) et l'admin (route de signature +
 * pages d'édition). Ne jamais dupliquer ce mapping ailleurs.
 */

/** Les 4 pages portfolio correspondent 1:1 à une valeur de l'enum media_items.category. */
const PORTFOLIO_CATEGORY_BY_PAGE_SLUG: Record<string, PortfolioCategory> = {
    'portfolio-mariage': 'mariage',
    'portfolio-portrait': 'portrait',
    'portfolio-evenementiel': 'evenementiel',
    'portfolio-pub': 'pub',
};

const PORTFOLIO_CATEGORIES: readonly PortfolioCategory[] = ['mariage', 'portrait', 'evenementiel', 'pub'];

/** null pour les pages qui ne correspondent à aucune catégorie portfolio (accueil, about, ...). */
export function getPortfolioCategoryForPageSlug(dbSlug: string): PortfolioCategory | null {
    return PORTFOLIO_CATEGORY_BY_PAGE_SLUG[dbSlug] ?? null;
}

/** Les 4 services par défaut partagent leur slug avec une catégorie portfolio (mariage, portrait, ...). */
export function getPortfolioCategoryForServiceSlug(serviceSlug: string): PortfolioCategory | null {
    return (PORTFOLIO_CATEGORIES as readonly string[]).includes(serviceSlug)
        ? (serviceSlug as PortfolioCategory)
        : null;
}

/** flexserve/<category> si une catégorie portfolio s'applique, flexserve/<fallback> sinon. */
export function cloudinaryFolder(category: PortfolioCategory | null, fallback: string): string {
    return `flexserve/${category ?? fallback}`;
}

/** Dossier Cloudinary pour une page standard (sections) : catégorie portfolio si applicable, sinon "site". */
export function getPageUploadFolder(dbSlug: string): string {
    return cloudinaryFolder(getPortfolioCategoryForPageSlug(dbSlug), 'site');
}

/** Dossier Cloudinary pour un service : catégorie portfolio si le slug correspond, sinon "services". */
export function getServiceUploadFolder(serviceSlug: string): string {
    return cloudinaryFolder(getPortfolioCategoryForServiceSlug(serviceSlug), 'services');
}
