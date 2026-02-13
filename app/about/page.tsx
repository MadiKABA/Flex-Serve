import AboutCTA from "@/components/about/AboutCTA";
import AboutHero from "@/components/about/AboutHero";
import AboutValuesSection from "@/components/about/AboutValuesSection";
import PartnersSection from "@/components/about/PartnersSection";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page À propos FlexServeStudio Dakar">

            {/* Hero About */}
            <section aria-label="Présentation de FlexServeStudio">
                <h1 className="sr-only">
                    À propos de FlexServeStudio - Photographe et vidéaste professionnel à Dakar, Sénégal
                </h1>
                <AboutHero />
                <p className="sr-only">
                    Découvrez l’histoire de FlexServeStudio, nos valeurs et notre expertise en photographie et vidéographie à Dakar.
                </p>
            </section>

            {/* Valeurs et approche */}
            <section aria-label="Nos valeurs et approche">
                <AboutValuesSection />
            </section>

            {/* Call to Action */}
            <section aria-label="Appel à action">
                <AboutCTA />
            </section>

            {/* Partenaires */}
            <section aria-label="Partenaires FlexServeStudio">
                <PartnersSection />
            </section>

        </main>
    );
}