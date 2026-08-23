import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AboutCTA from "@/components/about/AboutCTA";
import AboutHero from "@/components/about/AboutHero";
import AboutValuesSection from "@/components/about/AboutValuesSection";
import PartnersSection from "@/components/about/PartnersSection";
import { getPageData } from "@/lib/data/page";
import { getAboutPartners, getAboutStats } from "@/lib/data/about";
import { buildPageMetadata } from '@/lib/utils/page-metadata';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const data = await getPageData('about');
    if (!data) return {};

    return buildPageMetadata(data.page, '/about', {
        title: 'À propos — FlexServeStudio, Studio Photo & Vidéo à Dakar',
        description:
            "FlexServeStudio réunit une équipe de photographes et vidéastes à Dakar, spécialisée en mariages, portraits, événements et publicité. Découvrez notre histoire et nos valeurs.",
    });
}

export default async function AboutPage() {
    const [data, stats, partnerBrands] = await Promise.all([
        getPageData('about'),
        getAboutStats(),
        getAboutPartners(),
    ]);

    if (!data || !data.page.is_published) {
        notFound();
    }

    const { sections, backgroundBySection } = data;
    const hero = sections.find((s) => s.position === 0);
    const values = sections.find((s) => s.position === 1);
    const cta = sections.find((s) => s.position === 2);
    const partners = sections.find((s) => s.position === 3);
    const heroBackground = hero ? backgroundBySection.get(hero.id) : undefined;

    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page À propos FlexServeStudio Dakar">

            {/* Hero About */}
            <section aria-label="Présentation de FlexServeStudio">
                {hero && (
                    <AboutHero
                        title={hero.title ?? ''}
                        subtitle={hero.subtitle}
                        body={hero.body}
                        backgroundUrl={heroBackground?.url}
                        backgroundAlt={heroBackground?.alt}
                    />
                )}
                <p className="sr-only">
                    Découvrez l’histoire de FlexServeStudio, nos valeurs et notre expertise en photographie et vidéographie à Dakar.
                </p>
            </section>

            {/* Valeurs et approche */}
            <section aria-label="Nos valeurs et approche">
                {values && (
                    <AboutValuesSection title={values.title} subtitle={values.subtitle} body={values.body} stats={stats} />
                )}
            </section>

            {/* Call to Action */}
            <section aria-label="Appel à action">
                {cta && (
                    <AboutCTA
                        title={cta.title}
                        subtitle={cta.subtitle}
                        body={cta.body}
                        ctaLabel={cta.cta_label}
                        ctaUrl={cta.cta_url}
                        ctaLabel2={cta.cta_label_2}
                        ctaUrl2={cta.cta_url_2}
                    />
                )}
            </section>

            {/* Partenaires */}
            {partnerBrands.length > 0 && (
                <section aria-label="Partenaires FlexServeStudio">
                    <PartnersSection subtitle={partners?.subtitle} partners={partnerBrands} />
                </section>
            )}

        </main>
    );
}
