import type { PortfolioCategory } from '@/lib/types/content';
import { getPageUploadFolder, getPortfolioCategoryForPageSlug } from '@/lib/utils/cloudinary-paths';

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

export function getPublicPath(dbSlug: string): string | null {
    return PUBLIC_PATH_BY_SLUG[dbSlug] ?? null;
}

/** null pour les pages qui ne correspondent à aucune catégorie portfolio (accueil, about, ...). */
export function getPortfolioCategory(dbSlug: string): PortfolioCategory | null {
    return getPortfolioCategoryForPageSlug(dbSlug);
}

/** Dossier Cloudinary cible pour l'upload — logique partagée avec scripts/migrate-images.ts. */
export function getUploadFolder(dbSlug: string): string {
    return getPageUploadFolder(dbSlug);
}
