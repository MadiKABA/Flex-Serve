import ContentPortraitGallery from "@/components/portfolio-portrait/ContentPortraitGallery";
import PortraitHero from "@/components/portfolio-portrait/PortraitHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Portfolio Événementiel FlexServeStudio Dakar">

            <section aria-label="Galerie Événements FlexServeStudio">
                <h1 className="sr-only">
                    Portfolio Événements à Dakar - Photographe et vidéaste - FlexServeStudio
                </h1>
                <PortraitHero />
                <ContentPortraitGallery />
                <p className="sr-only">
                    Découvrez les événements couverts par FlexServeStudio à Dakar : conférences, soirées et événements d’entreprise.
                </p>
            </section>
        </main>
    );
}