/**
 * Validation minimale des entrées de Server Actions admin. Ne remplace pas
 * les contraintes DB, sert à rejeter les cas manifestement dangereux/invalides
 * avant écriture (une Server Action reste appelable par une requête forgée
 * hors du client généré, le typage TS seul n'offre aucune garantie runtime).
 */

/** Autorise vide (champ optionnel), chemin relatif, ancre, http(s), mailto, tel. Rejette "javascript:", "data:", etc. */
const SAFE_URL_PATTERN = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

export function isSafeUrl(value: string): boolean {
    const trimmed = value.trim();
    return trimmed === '' || SAFE_URL_PATTERN.test(trimmed);
}

export function isNonEmptyString(value: unknown, maxLength: number): value is string {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

export function isValidLength(value: unknown, maxLength: number): value is string {
    return typeof value === 'string' && value.length <= maxLength;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailOrEmpty(value: string): boolean {
    const trimmed = value.trim();
    return trimmed === '' || EMAIL_PATTERN.test(trimmed);
}
