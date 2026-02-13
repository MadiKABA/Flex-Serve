import GalleryHome from "@/components/home/GalleryHome";
import HeroFlexServev2 from "@/components/home/HeroPhotographyv2";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page d'accueil FlexServeStudio Dakar">

      {/* Hero section */}
      <section aria-label="Présentation de FlexServeStudio - Photographe et vidéaste à Dakar">
        <h1 className="sr-only">
          FlexServeStudio - Photographe et vidéaste professionnel à Dakar, Sénégal
        </h1>
        <HeroFlexServev2 />
      </section>

      {/* Galerie principale */}
      <section aria-label="Galerie des services FlexServeStudio">
        <GalleryHome />
        <p className="sr-only">
          Découvrez notre portfolio : mariages, portraits, événements et publicité à Dakar.
        </p>
      </section>

    </main>
  );
}