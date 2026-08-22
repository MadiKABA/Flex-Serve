import Link from 'next/link';
import { Briefcase, FileText, Image as ImageIcon } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/session';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SHORTCUTS = [
    {
        label: 'Gérer les pages',
        description: 'Sections et contenu de chaque page publique',
        href: '/admin/pages',
        icon: FileText,
    },
    {
        label: 'Médiathèque',
        description: 'Toutes les photos du site',
        href: '/admin/media',
        icon: ImageIcon,
    },
    {
        label: 'Services',
        description: 'Prestations affichées publiquement',
        href: '/admin/services',
        icon: Briefcase,
    },
];

export default async function AdminDashboardPage() {
    const sessionClient = await createSupabaseServerClient();
    const {
        data: { user },
    } = await sessionClient.auth.getUser();

    const [pages, media, services] = await Promise.all([
        supabase.from('pages').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('media_items').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_visible', true),
    ]);

    const stats = [
        { label: 'Pages publiées', value: pages.count ?? 0, icon: FileText, href: '/admin/pages' },
        { label: 'Photos', value: media.count ?? 0, icon: ImageIcon, href: '/admin/media' },
        { label: 'Services actifs', value: services.count ?? 0, icon: Briefcase, href: '/admin/services' },
    ];

    return (
        <div className="space-y-10">
            <div>
                <p className="text-sm text-muted-foreground">Bienvenue,</p>
                <h1 className="text-2xl font-semibold text-[#2E4A6F]">{user?.email}</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <Card className="transition-colors hover:border-[#2E4A6F]/40">
                            <CardContent className="flex items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E4A6F]/10 text-[#2E4A6F]">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-[#2E4A6F]">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div>
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Raccourcis
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {SHORTCUTS.map((shortcut) => (
                        <Link key={shortcut.label} href={shortcut.href}>
                            <Card className="h-full transition-colors hover:border-[#2E4A6F]/40">
                                <CardHeader>
                                    <shortcut.icon className="mb-2 h-5 w-5 text-[#2E4A6F]" />
                                    <CardTitle className="text-base">{shortcut.label}</CardTitle>
                                    <CardDescription>{shortcut.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
