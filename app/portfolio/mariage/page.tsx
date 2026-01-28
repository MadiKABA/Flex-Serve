import ContentWeddingGallery from "@/components/portfolio-wedding/ContentWeddingGallery";
import WeddingHero from "@/components/portfolio-wedding/WeddingHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <WeddingHero />
            <ContentWeddingGallery />
        </main>
    );
}