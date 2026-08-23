import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createSupabaseServerClient } from "@/lib/supabase/session";

export const runtime = "nodejs";

// Un seul niveau sous flexserve/, caractères sûrs uniquement : bloque ".." et
// tout slash supplémentaire (pas d'évasion vers un autre dossier du compte
// Cloudinary partagé, ex. crm-mondialehome).
const ALLOWED_FOLDER_REGEX = /^flexserve\/[a-z0-9_-]+$/;

const ALLOWED_UPLOAD_FORMATS = "jpg,jpeg,png,webp,avif";

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérifie l'appartenance à admin_users.
    // Schéma attendu : admin_users(user_id uuid references auth.users(id))
    const { data: adminRow, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminError || !adminRow) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // "folder" accepté en query (?folder=) ou en body JSON ({ folder })
    let folder: string | null = null;
    try {
        const body = await req.json();
        folder = typeof body?.folder === "string" ? body.folder : null;
    } catch {
        // pas de body JSON exploitable, on retombe sur la query string
    }
    if (!folder) {
        folder = req.nextUrl.searchParams.get("folder");
    }

    if (!folder || !ALLOWED_FOLDER_REGEX.test(folder)) {
        return NextResponse.json(
            { error: '"folder" est requis et doit correspondre exactement à "flexserve/<segment>" (un seul niveau, [a-z0-9_-]).' },
            { status: 400 }
        );
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Upload signé sans upload_preset : on signe exactement les paramètres
    // envoyés (timestamp + folder + allowed_formats), comme le fait
    // scripts/migrate-images.ts côté serveur avec le SDK. Aucun preset
    // n'existe sur le compte Cloudinary ("flexserve_admin" n'a jamais été
    // créé côté dashboard) — Cloudinary n'en a pas besoin pour un upload
    // signé. allowed_formats fait rejeter par Cloudinary lui-même tout
    // fichier hors liste (SVG notamment, qui peut embarquer du JS).
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder, allowed_formats: ALLOWED_UPLOAD_FORMATS },
        process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
        timestamp,
        signature,
        folder,
        allowedFormats: ALLOWED_UPLOAD_FORMATS,
        // Pas des secrets : cloud_name et api_key sont destinés à être publics
        // (nécessaires pour l'appel d'upload direct Cloudinary depuis le navigateur).
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
    });
}
