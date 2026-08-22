export interface CloudinaryUploadResult {
    publicId: string;
    url: string;
}

/**
 * Upload signé côté navigateur : récupère une signature fraîche auprès de
 * /api/cloudinary/sign (route protégée admin), puis envoie le fichier
 * directement à Cloudinary. Aucun secret ne transite côté client.
 */
export async function uploadToCloudinary(file: File, folder: string): Promise<CloudinaryUploadResult> {
    const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
    });

    if (!signRes.ok) {
        const body = await signRes.json().catch(() => null);
        throw new Error(body?.error ?? `Échec de la demande de signature (${signRes.status}).`);
    }

    const { timestamp, signature, cloudName, apiKey, uploadPreset } = await signRes.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const uploadBody = await uploadRes.json().catch(() => null);

    if (!uploadRes.ok || !uploadBody?.public_id) {
        throw new Error(uploadBody?.error?.message ?? "Échec de l'upload vers Cloudinary.");
    }

    return { publicId: uploadBody.public_id, url: uploadBody.secure_url };
}
