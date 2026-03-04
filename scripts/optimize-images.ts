import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const inputDir = path.resolve("originals");
const outputDir = path.resolve("optimized");

async function ensureDir(dir: string) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function processImage(file: string) {
    try {
        const inputPath = path.join(inputDir, file);
        const { name, ext } = path.parse(file);

        // ignorer les fichiers non images
        if (![".jpg", ".jpeg", ".png"].includes(ext.toLowerCase())) {
            console.log(`⏭ ignoré: ${file}`);
            return;
        }

        const image = sharp(inputPath);

        // ===== FALLBACK WEBP =====
        await image
            .clone()
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, `${name}.webp`));

        console.log(`✅ ${file} optimisée`);
    } catch (error) {
        console.error(`❌ erreur avec ${file}`, error);
    }
}

async function main() {
    await ensureDir(outputDir);

    const files = await fs.readdir(inputDir);

    // traitement séquentiel (évite de saturer RAM/CPU)
    for (const file of files) {
        await processImage(file);
    }

    console.log("\n🎉 Toutes les images sont optimisées !");
}

main();