import { notFound } from 'next/navigation';
import GalleryHome from "@/components/home/GalleryHome";
import HeroFlexServev2 from "@/components/home/HeroPhotographyv2";
import { getPageData } from "@/lib/data/page";

export const revalidate = 3600;

export default async function Home() {
  const data = await getPageData('accueil');

  if (!data || !data.page.is_published) {
    notFound();
  }

  const { sections, mediaBySection } = data;
  const hero = sections.find((s) => s.position === 0);
  const weddingStory = sections.find((s) => s.position === 2);
  const weddingCta = sections.find((s) => s.position === 3);

  const heroMedia = hero ? mediaBySection.get(hero.id) ?? [] : [];
  const weddingStoryMedia = weddingStory ? mediaBySection.get(weddingStory.id) ?? [] : [];
  const weddingCtaMedia = weddingCta ? mediaBySection.get(weddingCta.id) ?? [] : [];

  return (
    <main className="min-h-screen bg-[#e8e4d9]" aria-label="Page d'accueil FlexServeStudio Dakar">

      {/* Hero section */}
      <section aria-label="Présentation de FlexServeStudio - Photographe et vidéaste à Dakar">
        <h1 className="sr-only">
          FlexServeStudio - Photographe et vidéaste professionnel à Dakar, Sénégal
        </h1>
        {hero && (
          <HeroFlexServev2
            title={hero.title ?? ''}
            body={hero.body}
            ctaLabel={hero.cta_label}
            ctaUrl={hero.cta_url}
            ctaLabel2={hero.cta_label_2}
            ctaUrl2={hero.cta_url_2}
            image1={heroMedia.find((m) => m.position === 0)}
            image2={heroMedia.find((m) => m.position === 1)}
            image3={heroMedia.find((m) => m.position === 2)}
          />
        )}
      </section>

      {/* Galerie principale */}
      <section aria-label="Galerie des services FlexServeStudio">
        <GalleryHome
          weddingStoryTitle={weddingStory?.title}
          weddingStoryBody={weddingStory?.body}
          weddingStoryMedia={weddingStoryMedia}
          weddingCtaTitle={weddingCta?.title}
          weddingCtaSubtitle={weddingCta?.subtitle}
          weddingCtaBody={weddingCta?.body}
          weddingCtaLabel={weddingCta?.cta_label}
          weddingCtaUrl={weddingCta?.cta_url}
          weddingCtaMedia={weddingCtaMedia}
        />
        <p className="sr-only">
          Découvrez notre portfolio : mariages, portraits, événements et publicité à Dakar.
        </p>
      </section>

    </main>
  );
}
