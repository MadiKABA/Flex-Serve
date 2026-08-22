/**
 * Migration ponctuelle des images codées en dur vers Cloudinary + Supabase.
 *
 * Usage :
 *   pnpm migrate:images -- --dry-run   (aperçu, aucune écriture)
 *   pnpm migrate:images                (upload + insertion réels)
 *
 * Le mapping ci-dessous est la SEULE source de vérité : pas de scan
 * générique de /public/images. Certaines galeries sont lues dynamiquement
 * depuis leur fichier source (état actuel sur disque), d'autres utilisent
 * des chemins fixes donnés explicitement.
 */

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

type PortfolioCategory = "mariage" | "portrait" | "evenementiel" | "pub";

interface ExtractedImage {
    src: string;
    alt: string | null;
}

interface SectionJob {
    pageSlug: string;
    position: number;
    category: PortfolioCategory | null;
    label: string;
    extract: () => ExtractedImage[];
}

interface ServiceJob {
    kind: "services-table";
    sourceFile: string;
}

// ---------------------------------------------------------------------------
// Extraction depuis le code source (état ACTUEL sur disque, pas un snapshot)
// ---------------------------------------------------------------------------

function readSource(relPath: string): string {
    return fs.readFileSync(path.join(ROOT, relPath), "utf-8");
}

function extractArrayBlock(source: string, varName: string, sourceFile: string): string {
    const re = new RegExp(`const\\s+${varName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`, "m");
    const match = source.match(re);
    if (!match) {
        throw new Error(`Tableau "${varName}" introuvable dans ${sourceFile}`);
    }
    return match[1];
}

/** Objets plats { id, src, title?, category?, label? } — la forme utilisée par toutes les galeries photo du site. */
function extractPhotoObjects(block: string): ExtractedImage[] {
    const objectRe = /\{([^{}]*)\}/g;
    const results: ExtractedImage[] = [];
    let m: RegExpExecArray | null;
    while ((m = objectRe.exec(block))) {
        const obj = m[1];
        const src = obj.match(/src:\s*['"]([^'"]+)['"]/)?.[1];
        if (!src) continue;
        const title = obj.match(/title:\s*['"]([^'"]*)['"]/)?.[1];
        const label = obj.match(/label:\s*['"]([^'"]*)['"]/)?.[1];
        const category = obj.match(/category:\s*['"]([^'"]*)['"]/)?.[1];
        // alt_text : title, sinon label, sinon la valeur "category" incidente du code source
        // (ex: "Détails" sur une photo mariage) — jamais la catégorie portfolio elle-même.
        const alt = title || label || category || null;
        results.push({ src, alt });
    }
    return results;
}

/** <Image src="..." alt="..." /> écrits en dur dans le JSX (ex: WeddingCTA). */
function extractJsxImages(source: string): ExtractedImage[] {
    const tags = source.match(/<Image\b[^]*?\/>/g) ?? [];
    return tags
        .map((tag) => ({
            src: tag.match(/src=["']([^"']+)["']/)?.[1] ?? "",
            alt: tag.match(/alt=["']([^"']*)["']/)?.[1] ?? null,
        }))
        .filter((t) => t.src);
}

function extractServicesImages(source: string): { href: string; images: string[] }[] {
    const block = extractArrayBlock(source, "services", "ServicesListSection.tsx");
    const objectRe = /\{([^{}]*)\}/g;
    const results: { href: string; images: string[] }[] = [];
    let m: RegExpExecArray | null;
    while ((m = objectRe.exec(block))) {
        const obj = m[1];
        const href = obj.match(/href:\s*['"]([^'"]+)['"]/)?.[1];
        const imagesRaw = obj.match(/images:\s*\[([^\]]+)\]/)?.[1];
        if (!href || !imagesRaw) continue;
        const images = [...imagesRaw.matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
        results.push({ href, images });
    }
    return results;
}

// ---------------------------------------------------------------------------
// Mapping — source de vérité unique
// ---------------------------------------------------------------------------

const SECTION_JOBS: SectionJob[] = [
    {
        pageSlug: "accueil",
        position: 0,
        category: null,
        label: "accueil / hero (3 images fixes)",
        extract: () => [
            { src: "/images/portrait/B1.webp", alt: "Portfolio 1" },
            { src: "/images/F2.webp", alt: "Portfolio 2" },
            { src: "/images/mariage/11.webp", alt: "Portfolio 3" },
        ],
    },
    {
        pageSlug: "accueil",
        position: 1,
        category: null,
        label: "accueil / EventsGallery",
        extract: () =>
            extractPhotoObjects(
                extractArrayBlock(readSource("components/home/eventPhotos.tsx"), "eventPhotos", "eventPhotos.tsx")
            ),
    },
    {
        pageSlug: "accueil",
        position: 2,
        category: null,
        label: "accueil / WeddingGallery (moments)",
        extract: () =>
            extractPhotoObjects(
                extractArrayBlock(readSource("components/home/WeddingGallery.tsx"), "moments", "WeddingGallery.tsx")
            ),
    },
    {
        pageSlug: "accueil",
        position: 3,
        category: null,
        label: "accueil / WeddingCTA",
        extract: () => extractJsxImages(readSource("components/home/WeddingCTA.tsx")),
    },
    {
        pageSlug: "about",
        position: 0,
        category: null,
        label: "about / hero",
        extract: () => [{ src: "/images/about/photographer-portrait.png", alt: "Le photographe au travail" }],
    },
    {
        pageSlug: "services",
        position: 0,
        category: null,
        label: "services / hero",
        extract: () => [{ src: "/images/service/services-hero.png", alt: "Photographie professionnelle" }],
    },
    {
        pageSlug: "portfolio-mariage",
        position: 0,
        category: "mariage",
        label: "portfolio-mariage / hero",
        extract: () => [{ src: "/images/wedding-hero-bg.png", alt: "Mariage d'exception" }],
    },
    {
        pageSlug: "portfolio-mariage",
        position: 1,
        category: "mariage",
        label: "portfolio-mariage / galerie (weddingMoments)",
        extract: () =>
            extractPhotoObjects(
                extractArrayBlock(
                    readSource("components/portfolio-wedding/ContentWeddingGallery.tsx"),
                    "weddingMoments",
                    "ContentWeddingGallery.tsx"
                )
            ),
    },
    {
        pageSlug: "portfolio-mariage",
        position: 2,
        category: "mariage",
        label: "portfolio-mariage / galerie (weddingGridPhotos)",
        extract: () =>
            extractPhotoObjects(
                extractArrayBlock(
                    readSource("components/portfolio-wedding/ContentWeddingGallery.tsx"),
                    "weddingGridPhotos",
                    "ContentWeddingGallery.tsx"
                )
            ),
    },
    {
        pageSlug: "portfolio-portrait",
        position: 0,
        category: "portrait",
        label: "portfolio-portrait / hero",
        extract: () => [{ src: "/images/hero-portrait-bg.png", alt: "Portrait artistique" }],
    },
    {
        pageSlug: "portfolio-portrait",
        position: 1,
        category: "portrait",
        label: "portfolio-portrait / galerie",
        extract: () =>
            extractPhotoObjects(
                extractArrayBlock(
                    readSource("components/portfolio-portrait/ContentPortraitGallery.tsx"),
                    "portraitPhotos",
                    "ContentPortraitGallery.tsx"
                )
            ),
    },
    {
        pageSlug: "portfolio-evenementiel",
        position: 0,
        category: "evenementiel",
        label: "portfolio-evenementiel / hero",
        extract: () => [{ src: "/images/event-hero-bg.jpg", alt: "Événementiel de prestige" }],
    },
    {
        pageSlug: "portfolio-evenementiel",
        position: 1,
        category: "evenementiel",
        label: "portfolio-evenementiel / galerie",
        extract: () =>
            extractPhotoObjects(
                extractArrayBlock(
                    readSource("components/portfolio-event/ContentEventGallery.tsx"),
                    "eventPhotos",
                    "ContentEventGallery.tsx"
                )
            ),
    },
];

const SERVICES_JOB: ServiceJob = { kind: "services-table", sourceFile: "components/services/ServicesListSection.tsx" };

// portfolio-pub est explicitement exclu (images absentes du disque, page dépubliée).
// components/home/portraitPhotos.tsx est explicitement exclu (composant mort, jamais rendu).

// ---------------------------------------------------------------------------
// Helpers upload / dédup / idempotence
// ---------------------------------------------------------------------------

function normalizeForDedup(src: string): string {
    return src.trim().toLowerCase().replace(/\s+/g, " ");
}

function slugify(filename: string): string {
    return filename
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function deterministicPublicId(folder: string, src: string): string {
    const basename = src.split("/").pop() ?? src;
    const hash = createHash("sha1").update(normalizeForDedup(src)).digest("hex").slice(0, 8);
    return `${folder}/${slugify(basename)}-${hash}`;
}

function categoryOrSiteFolder(category: PortfolioCategory | null, fallback: string): string {
    return `flexserve/${category ?? fallback}`;
}

async function findExistingCloudinaryAsset(publicId: string): Promise<string | null> {
    try {
        const res = await cloudinary.api.resource(publicId);
        return res.secure_url as string;
    } catch {
        return null;
    }
}

async function prepareImageBuffer(absPath: string): Promise<Buffer> {
    const stat = fs.statSync(absPath);
    const isWebp = absPath.toLowerCase().endsWith(".webp");
    if (isWebp && stat.size < 500 * 1024) {
        return fs.readFileSync(absPath);
    }
    return sharp(absPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
}

function uploadBuffer(buffer: Buffer, publicId: string): Promise<{ publicId: string; url: string }> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { public_id: publicId, resource_type: "image", overwrite: false },
            (error, result) => {
                if (error || !result) return reject(error ?? new Error("Upload sans résultat"));
                resolve({ publicId: result.public_id, url: result.secure_url });
            }
        );
        stream.end(buffer);
    });
}

async function mediaItemExists(
    sectionId: string | null,
    serviceId: string | null,
    position: number
): Promise<boolean> {
    let query = supabase.from("media_items").select("id", { count: "exact", head: true }).eq("position", position);
    query = sectionId ? query.eq("section_id", sectionId) : query.eq("service_id", serviceId!);
    const { count } = await query;
    return (count ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Plan : une ligne par (fichier physique -> cible section/service+position)
// ---------------------------------------------------------------------------

interface PlanItem {
    label: string;
    src: string;
    dedupKey: string;
    absPath: string;
    fileExists: boolean;
    folder: string;
    publicId: string;
    alt: string | null;
    category: PortfolioCategory | null;
    sectionId: string | null;
    serviceId: string | null;
    position: number;
}

interface Stats {
    uploaded: number;
    reusedCloudinary: number;
    reusedInRun: number;
    inserted: number;
    skippedExisting: number;
    errors: string[];
    blocked: string[];
}

async function resolveSectionId(pageSlug: string, position: number): Promise<string | null> {
    const { data: page } = await supabase.from("pages").select("id").eq("slug", pageSlug).maybeSingle();
    if (!page) return null;
    const { data: section } = await supabase
        .from("sections")
        .select("id")
        .eq("page_id", page.id)
        .eq("position", position)
        .maybeSingle();
    return section?.id ?? null;
}

async function buildPlan(stats: Stats): Promise<PlanItem[]> {
    const plan: PlanItem[] = [];

    for (const job of SECTION_JOBS) {
        const sectionId = await resolveSectionId(job.pageSlug, job.position);
        if (!sectionId) {
            const msg = `Section manquante : ${job.pageSlug} position ${job.position} (${job.label}) — vérifie le seed des sections avant de migrer cette partie.`;
            stats.blocked.push(msg);
            continue;
        }

        let images: ExtractedImage[];
        try {
            images = job.extract();
        } catch (err) {
            stats.errors.push(`${job.label} : échec d'extraction — ${(err as Error).message}`);
            continue;
        }

        images.forEach((img, index) => {
            const folder = categoryOrSiteFolder(job.category, "site");
            const absPath = path.join(ROOT, "public", img.src);
            plan.push({
                label: job.label,
                src: img.src,
                dedupKey: `${normalizeForDedup(img.src)}::${folder}`,
                absPath,
                fileExists: fs.existsSync(absPath),
                folder,
                publicId: deterministicPublicId(folder, img.src),
                alt: img.alt,
                category: job.category,
                sectionId,
                serviceId: null,
                position: index,
            });
        });
    }

    // Table "services" (service_id, pas section_id)
    const servicesSource = readSource(SERVICES_JOB.sourceFile);
    const servicesFromCode = extractServicesImages(servicesSource);
    const { data: dbServices } = await supabase.from("services").select("id, slug, name");

    for (const svc of servicesFromCode) {
        const slug = svc.href.split("/").filter(Boolean).pop() ?? "";
        const dbService = dbServices?.find((s) => s.slug === slug);
        if (!dbService) {
            stats.blocked.push(`Service introuvable en base pour href="${svc.href}" (slug déduit: "${slug}").`);
            continue;
        }
        const category = (["portrait", "mariage", "evenementiel", "pub"] as const).includes(slug as PortfolioCategory)
            ? (slug as PortfolioCategory)
            : null;
        const folder = categoryOrSiteFolder(category, "site");

        svc.images.forEach((src, index) => {
            const absPath = path.join(ROOT, "public", src);
            plan.push({
                label: `services / ${dbService.name}`,
                src,
                dedupKey: `${normalizeForDedup(src)}::${folder}`,
                absPath,
                fileExists: fs.existsSync(absPath),
                folder,
                publicId: deterministicPublicId(folder, src),
                alt: `${dbService.name} - Image ${index + 1}`,
                category,
                sectionId: null,
                serviceId: dbService.id,
                position: index,
            });
        });
    }

    return plan;
}

// ---------------------------------------------------------------------------
// Exécution
// ---------------------------------------------------------------------------

async function main() {
    const stats: Stats = { uploaded: 0, reusedCloudinary: 0, reusedInRun: 0, inserted: 0, skippedExisting: 0, errors: [], blocked: [] };

    console.log(DRY_RUN ? "=== DRY RUN — aucune écriture ===\n" : "=== EXÉCUTION RÉELLE ===\n");

    const plan = await buildPlan(stats);

    const missingFiles = plan.filter((p) => !p.fileExists);
    const validPlan = plan.filter((p) => p.fileExists);
    for (const m of missingFiles) {
        stats.errors.push(`Fichier absent du disque : ${m.src} (cible : ${m.label}, position ${m.position})`);
    }

    // Regroupe par fichier physique cible (dédup) pour n'uploader qu'une fois.
    const byDedupKey = new Map<string, PlanItem[]>();
    for (const item of validPlan) {
        const list = byDedupKey.get(item.dedupKey) ?? [];
        list.push(item);
        byDedupKey.set(item.dedupKey, list);
    }

    console.log(`Plan : ${validPlan.length} lignes media_items visées, ${byDedupKey.size} fichiers physiques uniques à uploader.\n`);

    const uploadedAssets = new Map<string, { publicId: string; url: string }>();

    for (const [dedupKey, items] of byDedupKey) {
        const first = items[0];

        const existingUrl = await findExistingCloudinaryAsset(first.publicId);
        let asset: { publicId: string; url: string };

        if (existingUrl) {
            asset = { publicId: first.publicId, url: existingUrl };
            stats.reusedCloudinary += 1;
            console.log(`[cloudinary] déjà présent  ${first.publicId}`);
        } else if (DRY_RUN) {
            asset = { publicId: first.publicId, url: "(dry-run — pas encore uploadé)" };
            console.log(`[cloudinary] à uploader   ${first.src} -> ${first.publicId}`);
        } else {
            try {
                const buffer = await prepareImageBuffer(first.absPath);
                asset = await uploadBuffer(buffer, first.publicId);
                stats.uploaded += 1;
                console.log(`[cloudinary] uploadé      ${first.publicId}`);
            } catch (err) {
                stats.errors.push(`Échec upload ${first.src} -> ${first.publicId} : ${(err as Error).message}`);
                continue;
            }
        }

        uploadedAssets.set(dedupKey, asset);
        if (items.length > 1) stats.reusedInRun += items.length - 1;

        for (const item of items) {
            const target = item.sectionId ? `section=${item.sectionId}` : `service=${item.serviceId}`;
            const already = DRY_RUN ? false : await mediaItemExists(item.sectionId, item.serviceId, item.position);

            if (already) {
                stats.skippedExisting += 1;
                console.log(`  [db] déjà en base       ${target} pos=${item.position} (${item.label})`);
                continue;
            }

            if (DRY_RUN) {
                console.log(
                    `  [db] à insérer          ${target} pos=${item.position} category=${item.category ?? "null"} alt="${item.alt ?? ""}" (${item.label})`
                );
                continue;
            }

            const { error } = await supabase.from("media_items").insert({
                section_id: item.sectionId,
                service_id: item.serviceId,
                cloudinary_public_id: asset.publicId,
                cloudinary_url: asset.url,
                category: item.category,
                alt_text: item.alt,
                position: item.position,
            });

            if (error) {
                stats.errors.push(`Échec insertion media_items pour ${item.src} (${target} pos=${item.position}) : ${error.message}`);
                continue;
            }

            stats.inserted += 1;
            console.log(`  [db] inséré             ${target} pos=${item.position} (${item.label})`);
        }
    }

    console.log("\n=== RÉSUMÉ ===");
    console.log(`Fichiers physiques uniques      : ${byDedupKey.size}`);
    console.log(`Uploads Cloudinary réels         : ${stats.uploaded}`);
    console.log(`Déjà présents sur Cloudinary      : ${stats.reusedCloudinary}`);
    console.log(`Réutilisations (doublons du run)  : ${stats.reusedInRun}`);
    console.log(`Lignes media_items insérées       : ${stats.inserted}`);
    console.log(`Lignes déjà en base (ignorées)    : ${stats.skippedExisting}`);
    console.log(`Blocages (section/service absent) : ${stats.blocked.length}`);
    console.log(`Erreurs                           : ${stats.errors.length}`);

    if (stats.blocked.length > 0) {
        console.log("\n--- Blocages ---");
        stats.blocked.forEach((b) => console.log(`  ⚠ ${b}`));
    }
    if (stats.errors.length > 0) {
        console.log("\n--- Erreurs ---");
        stats.errors.forEach((e) => console.log(`  ✗ ${e}`));
    }

    if (DRY_RUN) {
        console.log("\nDry-run terminé — relance sans --dry-run pour exécuter réellement.");
    }

    process.exit(stats.errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
    console.error("Échec fatal du script :", err);
    process.exit(1);
});
