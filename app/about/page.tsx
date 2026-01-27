import AboutCTA from "@/components/about/AboutCTA";
import AboutHero from "@/components/about/AboutHero";
import AboutValuesSection from "@/components/about/AboutValuesSection";
import PartnersSection from "@/components/about/PartnersSection";


export default function Home() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <AboutHero />
            <AboutValuesSection />
            <AboutCTA />
            <PartnersSection />
        </main>
    );
}