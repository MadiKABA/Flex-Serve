import imageCompression from 'browser-image-compression';

/** Limite d'upload du compte Cloudinary — sert de garde-fou après compression. */
export const CLOUDINARY_MAX_UPLOAD_MB = 10;

const MAX_WIDTH_OR_HEIGHT = 1600;
const QUALITY = 0.8;
/** Cible de compression avec marge sous la limite réelle du compte. */
const TARGET_MAX_SIZE_MB = 8;

/**
 * Compresse une image côté navigateur avant upload Cloudinary : redimensionne
 * à 1600px de large max, qualité ~80%, conversion webp si le navigateur le
 * supporte. Utilisé par tous les écrans d'upload admin (pages, services, ...)
 * pour ne jamais envoyer un fichier brut à Cloudinary.
 *
 * En cas d'échec de la compression (format exotique, etc.), retourne le
 * fichier original tel quel — le garde-fou de taille en aval s'applique alors.
 */
export async function compressImage(file: File): Promise<File> {
    try {
        return await imageCompression(file, {
            maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
            initialQuality: QUALITY,
            maxSizeMB: TARGET_MAX_SIZE_MB,
            fileType: 'image/webp',
            useWebWorker: true,
        });
    } catch (err) {
        console.error(`[compress-image] échec de la compression de "${file.name}", fichier original conservé :`, err);
        return file;
    }
}

export function exceedsCloudinaryLimit(file: File): boolean {
    return file.size > CLOUDINARY_MAX_UPLOAD_MB * 1024 * 1024;
}
