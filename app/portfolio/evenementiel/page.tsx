import ContentEventGallery from "@/components/portfolio-event/ContentEventGallery";
import EventHero from "@/components/portfolio-event/EventHero";


export default function Portrait() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <EventHero />
            <ContentEventGallery />
        </main>
    );
}