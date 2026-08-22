import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import PublishToggle from '@/components/admin/pages/PublishToggle';

interface PageRow {
    id: string;
    slug: string;
    title: string;
    type: 'standard' | 'custom';
    is_published: boolean;
    sections: { count: number }[];
}

export default async function AdminPagesListPage() {
    const { data: pages, error } = await supabaseAdmin
        .from('pages')
        .select('id, slug, title, type, is_published, sections(count)')
        .order('title')
        .returns<PageRow[]>();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#2E4A6F]">Pages</h1>
                <p className="text-sm text-muted-foreground">
                    Gère le contenu et la publication de chaque page publique.
                </p>
            </div>

            {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    Erreur de chargement : {error.message}
                </p>
            )}

            {!error && (
                <div className="overflow-hidden rounded-xl border border-border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-sm">
                            <thead className="border-b border-border bg-[#F5F2E8]/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Titre</th>
                                    <th className="px-5 py-3 font-medium">Slug</th>
                                    <th className="px-5 py-3 font-medium">Type</th>
                                    <th className="px-5 py-3 font-medium">Sections</th>
                                    <th className="px-5 py-3 font-medium">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages?.map((page) => (
                                    <tr key={page.id} className="border-b border-border last:border-b-0 hover:bg-[#2E4A6F]/[0.03]">
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/admin/pages/${page.slug}`}
                                                className="font-medium text-[#2E4A6F] hover:underline"
                                            >
                                                {page.title}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{page.slug}</td>
                                        <td className="px-5 py-4">
                                            <Badge variant="outline" className="capitalize">
                                                {page.type}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground">{page.sections?.[0]?.count ?? 0}</td>
                                        <td className="px-5 py-4">
                                            <PublishToggle
                                                pageId={page.id}
                                                dbSlug={page.slug}
                                                initialPublished={page.is_published}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
