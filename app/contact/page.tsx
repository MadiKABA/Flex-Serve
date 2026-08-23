import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactContent from "@/components/contact/ContactContent";
import ContactHero from "@/components/contact/ContactHero";
import { getPageData } from "@/lib/data/page";
import { getSiteSettings } from "@/lib/data/site-settings";
import { buildPageMetadata } from '@/lib/utils/page-metadata';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
    const data = await getPageData('contact');
    if (!data) return {};

    return buildPageMetadata(data.page, '/contact', {
        title: 'Contact — FlexServeStudio, Photographe à Dakar',
        description:
            'Contactez FlexServeStudio à Dakar pour réserver votre séance photo ou vidéo : téléphone, email et réseaux sociaux.',
    });
}

export default async function ContactPage() {
    const [data, siteSettings] = await Promise.all([getPageData('contact'), getSiteSettings()]);

    if (!data || !data.page.is_published) {
        notFound();
    }

    const { sections } = data;
    const hero = sections.find((s) => s.position === 0);
    const content = sections.find((s) => s.position === 1);

    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page Contact FlexServeStudio Dakar">

            {/* Hero Contact */}
            <section aria-label="Présentation de la page Contact">
                {hero && <ContactHero title={hero.title ?? ''} subtitle={hero.subtitle} />}
                <p className="sr-only">
                    Obtenez toutes les informations pour contacter FlexServeStudio à Dakar : téléphone, email et formulaire.
                </p>
            </section>

            {/* Contenu Contact */}
            <section aria-label="Formulaire et informations de contact">
                <ContactContent title={content?.title} subtitle={content?.subtitle} siteSettings={siteSettings} />
            </section>

        </main>
    );
}
