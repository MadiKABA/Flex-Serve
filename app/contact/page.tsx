import ContactContent from "@/components/contact/ContactContent";
import ContactHero from "@/components/contact/ContactHero";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page Contact FlexServeStudio Dakar">

            {/* Hero Contact */}
            <section aria-label="Présentation de la page Contact">
                <h1 className="sr-only">
                    Contactez FlexServeStudio - Photographe et vidéaste professionnel à Dakar, Sénégal
                </h1>
                <ContactHero />
                <p className="sr-only">
                    Obtenez toutes les informations pour contacter FlexServeStudio à Dakar : téléphone, email et formulaire.
                </p>
            </section>

            {/* Contenu Contact */}
            <section aria-label="Formulaire et informations de contact">
                <ContactContent />
            </section>

        </main>
    );
}