import { notFound } from 'next/navigation';
import WeddingHero from "@/components/portfolio-wedding/WeddingHero";
import GalleryGrid from "@/components/portfolio/GalleryGrid";
import { getPortfolioPageData } from "@/lib/data/portfolio";

export const revalidate = 3600;

export default async function WeddingPortfolioPage() {
    const data = await getPortfolioPageData('portfolio-mariage');

    if (!data || !data.page.is_published) {
        notFound();
    }

    const { sections, mediaBySection, heroBackground } = data;
    const heroSection = sections.find((s) => s.type === 'hero');
    const gallerySections = sections.filter((s) => s.type === 'gallery');

    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Portfolio Mariage FlexServeStudio Dakar">

            <section aria-label="Galerie Mariages FlexServeStudio">
                <h1 className="sr-only">
                    Portfolio Mariages à Dakar - Photographe professionnel - FlexServeStudio
                </h1>

                {heroSection && (
                    <WeddingHero
                        title={heroSection.title ?? ''}
                        subtitle={heroSection.subtitle}
                        body={heroSection.body}
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
                    Découvrez les mariages capturés par FlexServeStudio à Dakar : cérémonies, réception et moments mémorables.
                </p>
            </section>

        </main>
    );
}
