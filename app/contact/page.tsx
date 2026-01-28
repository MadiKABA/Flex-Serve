import ContactContent from "@/components/contact/ContactContent";
import ContactHero from "@/components/contact/ContactHero";


export default function Home() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]">
            <ContactHero />
            <ContactContent />
        </main>
    );
}