import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const inputDir = path.resolve("originals");
const outputDir = path.resolve("optimized");

// créer le dossier si inexistant
async function ensureDir(dir: string) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

// crop centré 3:2
async function cropToThreeTwo(image: sharp.Sharp) {
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) return image;

    const targetRatio = 3 / 2;
    const currentRatio = metadata.width / metadata.height;

    let cropWidth: number;
    let cropHeight: number;

    if (currentRatio > targetRatio) {
        // image trop large → couper les côtés
        cropHeight = metadata.height;
        cropWidth = Math.round(cropHeight * targetRatio);
    } else {
        // image trop haute → couper haut/bas
        cropWidth = metadata.width;
        cropHeight = Math.round(cropWidth / targetRatio);
    }

    const left = Math.round((metadata.width - cropWidth) / 2);
    const top = Math.round((metadata.height - cropHeight) / 2);

    return image.extract({
        left,
        top,
        width: cropWidth,
        height: cropHeight,
    });
}

// traiter une image
async function processImage(file: string) {
    try {
        const inputPath = path.join(inputDir, file);
        const { name, ext } = path.parse(file);

        if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext.toLowerCase())) {
            console.log(`⏭ ignoré: ${file}`);
            return;
        }

        const image = sharp(inputPath);
        const cropped = await cropToThreeTwo(image);

        // ==== GRID / PORTFOLIO 1920px ====
        await cropped
            .clone()
            .resize({ width: 1920, withoutEnlargement: true })
            .avif({ quality: 55 })
            .toFile(path.join(outputDir, `${name}.avif`));

        await cropped
            .clone()
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, `${name}.webp`));

        // ==== THUMBNAIL 400px ====
        await cropped
            .clone()
            .resize({ width: 400, withoutEnlargement: true })
            .webp({ quality: 70 })
            .toFile(path.join(outputDir, `${name}-thumb.webp`));

        // ==== LIGHTBOX 2560px ====
        await cropped
            .clone()
            .resize({ width: 2560, withoutEnlargement: true })
            .avif({ quality: 55 })
            .toFile(path.join(outputDir, `${name}-large.avif`));

        console.log(`✅ ${file} optimisée`);
    } catch (error) {
        console.error(`❌ erreur avec ${file}`, error);
    }
}

// lancement
async function main() {
    await ensureDir(outputDir);

    const files = await fs.readdir(inputDir);
    for (const file of files) {
        await processImage(file);
    }

    console.log("\n🎉 Toutes les images sont optimisées et recadrées en 3:2 !");
}

main();