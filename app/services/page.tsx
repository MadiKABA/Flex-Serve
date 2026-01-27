
import ServicesHero from "@/components/services/servicesHero";
import ServicesListSection from "@/components/services/ServicesListSection";
export default function Home() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <ServicesHero />
            <ServicesListSection />

        </main>
    );
}