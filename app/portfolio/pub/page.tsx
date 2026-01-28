import ContentPubGallery from "@/components/portfolio-pub/ContentPubGallery";
import PubHero from "@/components/portfolio-pub/PubHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <PubHero />
            <ContentPubGallery />
        </main>
    );
}