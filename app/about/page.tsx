import AboutHero from "@/components/about/AboutHero";
import AboutValuesSection from "@/components/about/AboutValuesSection";


export default function Home() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <AboutHero />
            <AboutValuesSection />
        </main>
    );
}