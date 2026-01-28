import ContentPortraitGallery from "@/components/portfolio-portrait/ContentPortraitGallery";
import PortraitHero from "@/components/portfolio-portrait/PortraitHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <PortraitHero />
            <ContentPortraitGallery />
        </main>
    );
}