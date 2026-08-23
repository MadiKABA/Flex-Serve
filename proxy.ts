import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
        return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const redirectToLogin = (errorCode?: string) => {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.search = errorCode ? `?error=${errorCode}` : "";
        return NextResponse.redirect(url);
    };

    // getUser() (et non getSession()) : valide le token auprès de Supabase
    // plutôt que de se fier au contenu du cookie.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirectToLogin();
    }

    const { data: adminRow } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!adminRow) {
        return redirectToLogin("unauthorized");
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
