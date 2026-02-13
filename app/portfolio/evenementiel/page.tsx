import ContentEventGallery from "@/components/portfolio-event/ContentEventGallery";
import EventHero from "@/components/portfolio-event/EventHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Portfolio Portrait FlexServeStudio Dakar">

            <section aria-label="Galerie Portrait FlexServeStudio">
                <h1 className="sr-only">
                    Portfolio Portraits professionnels à Dakar - FlexServeStudio
                </h1>
                <EventHero />
                <ContentEventGallery />
                <p className="sr-only">
                    Découvrez les portraits réalisés par FlexServeStudio à Dakar : studio, lifestyle et corporate.
                </p>
            </section>

        </main>

    );
}