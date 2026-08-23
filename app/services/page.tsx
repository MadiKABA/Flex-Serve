import { notFound } from 'next/navigation';
import ServicesHero from "@/components/services/servicesHero";
import ServicesListSection from "@/components/services/ServicesListSection";
import { getPageData } from "@/lib/data/page";
import { getServicesData } from "@/lib/data/services";

export const revalidate = 3600;

export default async function ServicesPage() {
    const [data, services] = await Promise.all([getPageData('services'), getServicesData()]);

    if (!data || !data.page.is_published) {
        notFound();
    }

    const { sections, backgroundBySection } = data;
    const hero = sections.find((s) => s.position === 0);
    const heroBackground = hero ? backgroundBySection.get(hero.id) : undefined;

    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page Services FlexServeStudio Dakar">

            {/* Hero Section */}
            <section aria-label="Présentation des services FlexServeStudio">
                <h1 className="sr-only">
                    Services de photographie et vidéographie professionnelle à Dakar - FlexServeStudio
                </h1>
                {hero && (
                    <ServicesHero
                        title={hero.title ?? ''}
                        subtitle={hero.subtitle}
                        body={hero.body}
                        backgroundUrl={heroBackground?.url}
                        backgroundAlt={heroBackground?.alt}
                    />
                )}
            </section>

            {/* Liste des services */}
            <section aria-label="Liste complète des services de FlexServeStudio">
                <ServicesListSection services={services} />
                <p className="sr-only">
                    FlexServeStudio Dakar propose des services professionnels : mariages, portraits, événements et publicité.
                </p>
            </section>

        </main>
    );
}
