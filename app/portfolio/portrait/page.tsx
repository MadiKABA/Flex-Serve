import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortraitHero from "@/components/portfolio-portrait/PortraitHero";
import GalleryGrid from "@/components/portfolio/GalleryGrid";
import { getPortfolioPageData } from "@/lib/data/portfolio";
import { buildPageMetadata } from '@/lib/utils/page-metadata';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const data = await getPortfolioPageData('portfolio-portrait');
    if (!data) return {};

    return buildPageMetadata(data.page, '/portfolio/portrait', {
        title: 'Portfolio Portrait — Photographe Portrait à Dakar | FlexServeStudio',
        description:
            'Portraits professionnels réalisés à Dakar par FlexServeStudio : studio, lifestyle et corporate.',
    });
}

export default async function PortraitPortfolioPage() {
    const data = await getPortfolioPageData('portfolio-portrait');

    if (!data || !data.page.is_published) {
        notFound();
    }

    const { sections, mediaBySection, heroBackground } = data;
    const heroSection = sections.find((s) => s.type === 'hero');
    const gallerySections = sections.filter((s) => s.type === 'gallery');

    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Portfolio Portrait FlexServeStudio Dakar">

            <section aria-label="Galerie Portrait FlexServeStudio">
                {heroSection && (
                    <PortraitHero
                        title={heroSection.title ?? ''}
                        subtitle={heroSection.subtitle}
                        backgroundUrl={heroBackground?.url}
                        backgroundAlt={heroBackground?.alt}
                    />
                )}

                {gallerySections.map((section) => (
                    <GalleryGrid
                        key={section.id}
                        media={mediaBySection.get(section.id) ?? []}
                        layout={section.layout}
                        title={section.title}
                    />
                ))}

                <p className="sr-only">
                    Découvrez les portraits réalisés par FlexServeStudio à Dakar : studio, lifestyle et corporate.
                </p>
            </section>

        </main>
    );
}
