import ServicesHero from "@/components/services/servicesHero";
import ServicesListSection from "@/components/services/ServicesListSection";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page Services FlexServeStudio Dakar">

            {/* Hero Section */}
            <section aria-label="Présentation des services FlexServeStudio">
                <h1 className="sr-only">
                    Services de photographie et vidéographie professionnelle à Dakar - FlexServeStudio
                </h1>
                <ServicesHero />
            </section>

            {/* Liste des services */}
            <section aria-label="Liste complète des services de FlexServeStudio">
                <ServicesListSection />
                <p className="sr-only">
                    FlexServeStudio Dakar propose des services professionnels : mariages, portraits, événements et publicité.
                </p>
            </section>

        </main>
    );
}