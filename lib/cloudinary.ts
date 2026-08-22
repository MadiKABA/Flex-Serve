import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok" && result.result !== "not found") {
            console.error(`[cloudinary] échec de suppression pour "${publicId}":`, result.result);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`[cloudinary] erreur lors de la suppression de "${publicId}":`, error);
        return false;
    }
}
