import 'server-only';
import { createSupabaseServerClient } from './session';

export type ActionResult = { success: true } | { success: false; error: string };

/** Garde d'accès partagée par toutes les Server Actions d'écriture admin. */
export async function assertAdmin(): Promise<ActionResult> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Session expirée. Merci de te reconnecter.' };
    }

    const { data: adminRow } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (!adminRow) {
        return { success: false, error: 'Accès non autorisé.' };
    }

    return { success: true };
}
