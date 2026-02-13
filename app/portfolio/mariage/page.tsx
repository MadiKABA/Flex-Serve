import ContentWeddingGallery from "@/components/portfolio-wedding/ContentWeddingGallery";
import WeddingHero from "@/components/portfolio-wedding/WeddingHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Portfolio Mariage FlexServeStudio Dakar">

            <section aria-label="Galerie Mariages FlexServeStudio">
                <h1 className="sr-only">
                    Portfolio Mariages à Dakar - Photographe professionnel - FlexServeStudio
                </h1>
                <WeddingHero />
                <ContentWeddingGallery />
                <p className="sr-only">
                    Découvrez les mariages capturés par FlexServeStudio à Dakar : cérémonies, réception et moments mémorables.
                </p>
            </section>

        </main>
    );
}