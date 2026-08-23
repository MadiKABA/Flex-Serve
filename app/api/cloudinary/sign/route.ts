import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { createSupabaseServerClient } from "@/lib/supabase/session";

export const runtime = "nodejs";

const ALLOWED_FOLDER_PREFIX = "flexserve/";

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

    if (!folder || !folder.startsWith(ALLOWED_FOLDER_PREFIX)) {
        return NextResponse.json(
            { error: `"folder" est requis et doit commencer par "${ALLOWED_FOLDER_PREFIX}"` },
            { status: 400 }
        );
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Upload signé sans upload_preset : on signe exactement les paramètres
    // envoyés (timestamp + folder), comme le fait scripts/migrate-images.ts
    // côté serveur avec le SDK. Aucun preset n'existe sur le compte Cloudinary
    // ("flexserve_admin" n'a jamais été créé côté dashboard) — Cloudinary
    // n'en a pas besoin pour un upload signé.
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
        timestamp,
        signature,
        folder,
        // Pas des secrets : cloud_name et api_key sont destinés à être publics
        // (nécessaires pour l'appel d'upload direct Cloudinary depuis le navigateur).
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
    });
}
