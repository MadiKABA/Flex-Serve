import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/session';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Filet de sécurité : proxy.ts protège déjà ces routes, mais on ne
    // rend jamais le shell admin sans utilisateur authentifié.
    if (!user) {
        redirect('/admin/login');
    }

    return <AdminShell userEmail={user.email ?? ''}>{children}</AdminShell>;
}
