import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SectionEditor from '@/components/admin/pages/SectionEditor';
import HeroThreeImages from '@/components/admin/pages/HeroThreeImages';
import { getPortfolioCategory, getUploadFolder } from '@/lib/utils/page-routes';
import type { MediaItem, Page, Section } from '@/lib/types/content';

const SECTION_TYPE_LABELS: Record<string, string> = {
    hero: 'Hero',
    text: 'Texte',
    gallery: 'Galerie',
    cta: 'Appel à action',
};

export default async function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data: page, error: pageError } = await supabaseAdmin
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle<Page>();

    if (pageError) {
        return <ErrorState message={pageError.message} />;
    }
    if (!page) {
        notFound();
    }

    const { data: sections, error: sectionsError } = await supabaseAdmin
        .from('sections')
        .select('*')
        .eq('page_id', page.id)
        .order('position')
        .returns<Section[]>();

    if (sectionsError) {
        return <ErrorState message={sectionsError.message} />;
    }

    const sectionList = sections ?? [];
    const sectionIds = sectionList.map((s) => s.id);
    const mediaBySection = new Map<string, MediaItem[]>();

    if (sectionIds.length > 0) {
        const { data: media, error: mediaError } = await supabaseAdmin
            .from('media_items')
            .select('*')
            .in('section_id', sectionIds)
            .order('position')
            .returns<MediaItem[]>();

        if (mediaError) {
            return <ErrorState message={mediaError.message} />;
        }

        for (const item of media ?? []) {
            if (!item.section_id) continue;
            const list = mediaBySection.get(item.section_id) ?? [];
            list.push(item);
            mediaBySection.set(item.section_id, list);
        }
    }

    const category = getPortfolioCategory(page.slug);
    const uploadFolder = getUploadFolder(page.slug);
    const isAccueil = page.slug === 'accueil';
    const isUnhandledCustomPage = page.type === 'custom' && !isAccueil;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">/{page.slug}</p>
                <h1 className="text-2xl font-semibold text-[#2E4A6F]">{page.title}</h1>
            </div>

            {isUnhandledCustomPage && (
                <div className="rounded-xl border border-dashed border-[#2E4A6F]/20 bg-[#2E4A6F]/[0.03] px-8 py-16 text-center">
                    <p className="text-sm text-muted-foreground">
                        Cette page (type &laquo;&nbsp;{page.type}&nbsp;&raquo;) n&apos;est pas encore éditable depuis
                        l&apos;admin.
                    </p>
                </div>
            )}

            {!isUnhandledCustomPage && sectionList.length === 0 && <EmptyState />}

            {!isUnhandledCustomPage && isAccueil && sectionList.length > 0 && (
                <div className="space-y-6">
                    {sectionList.map((section) =>
                        section.type === 'hero' ? (
                            <div key={section.id} className="space-y-6 rounded-xl border border-border bg-white p-6">
                                <SectionEditor
                                    section={section}
                                    dbSlug={page.slug}
                                    category={category}
                                    uploadFolder={uploadFolder}
                                    media={mediaBySection.get(section.id) ?? []}
                                />
                                <div className="border-t border-border pt-6">
                                    <p className="mb-3 text-sm font-medium text-[#2E4A6F]">
                                        Images du hero (exactement 3)
                                    </p>
                                    <HeroThreeImages
                                        sectionId={section.id}
                                        dbSlug={page.slug}
                                        uploadFolder={uploadFolder}
                                        media={mediaBySection.get(section.id) ?? []}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div key={section.id} className="rounded-xl border border-border bg-white p-6">
                                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {SECTION_TYPE_LABELS[section.type] ?? section.type}
                                </p>
                                <SectionEditor
                                    section={section}
                                    dbSlug={page.slug}
                                    category={category}
                                    uploadFolder={uploadFolder}
                                    media={mediaBySection.get(section.id) ?? []}
                                />
                            </div>
                        )
                    )}
                </div>
            )}

            {!isUnhandledCustomPage && !isAccueil && sectionList.length > 0 && (
                <Accordion type="multiple" className="rounded-xl border border-border bg-white px-6">
                    {sectionList.map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                            <AccordionTrigger>
                                {SECTION_TYPE_LABELS[section.type] ?? section.type}
                                {section.title ? ` — ${section.title}` : ''}
                            </AccordionTrigger>
                            <AccordionContent>
                                <SectionEditor
                                    section={section}
                                    dbSlug={page.slug}
                                    category={category}
                                    uploadFolder={uploadFolder}
                                    media={mediaBySection.get(section.id) ?? []}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed border-[#2E4A6F]/20 bg-[#2E4A6F]/[0.03] px-8 py-16 text-center">
            <p className="text-sm text-muted-foreground">Aucune section pour cette page.</p>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Erreur de chargement : {message}
        </p>
    );
}
