import { notFound } from 'next/navigation';
import EventHero from "@/components/portfolio-event/EventHero";
import GalleryGrid from "@/components/portfolio/GalleryGrid";
import { getPortfolioPageData } from "@/lib/data/portfolio";

export const revalidate = 3600;

export default async function EventPortfolioPage() {
    const data = await getPortfolioPageData('portfolio-evenementiel');

    if (!data || !data.page.is_published) {
        notFound();
    }

    const { sections, mediaBySection, heroBackground } = data;
    const heroSection = sections.find((s) => s.type === 'hero');
    const gallerySections = sections.filter((s) => s.type === 'gallery');

    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Portfolio Événementiel FlexServeStudio Dakar">

            <section aria-label="Galerie Événements FlexServeStudio">
                <h1 className="sr-only">
                    Portfolio Événements à Dakar - Photographe et vidéaste - FlexServeStudio
                </h1>

                {heroSection && (
                    <EventHero
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
                    Découvrez les événements couverts par FlexServeStudio à Dakar : conférences, soirées et événements d'entreprise.
                </p>
            </section>

        </main>
    );
}
