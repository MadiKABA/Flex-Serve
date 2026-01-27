import GalleryHome from "@/components/home/GalleryHome";
import HeroFlexServev2 from "@/components/home/HeroPhotographyv2";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#e8e4d9]">
      <HeroFlexServev2 />
      {/* <HeroPhotography /> */}
      <GalleryHome />

    </main>
  );
}