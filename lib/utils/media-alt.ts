import type { PortfolioCategory } from '@/lib/types/content';

const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
    mariage: 'Mariage',
    portrait: 'Portrait',
    evenementiel: 'Événementiel',
    pub: 'Publicité',
};

/**
 * Fallback alt text unique, utilisé partout où media_items.alt_text est vide
 * — remplace les fallbacks incohérents ('gallery image', '', 'Photo du
 * portfolio FlexServeStudio' répété sur chaque image d'une galerie) par un
 * seul format, dérivé de la catégorie quand elle est connue.
 */
export function fallbackAlt(category?: PortfolioCategory | string | null): string {
    const label = category && category in CATEGORY_LABELS ? CATEGORY_LABELS[category as PortfolioCategory] : null;
    return label ? `${label} — FlexServeStudio` : 'FlexServeStudio';
}
