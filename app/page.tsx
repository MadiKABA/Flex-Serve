import GalleryHome from "@/components/home/GalleryHome";
import HeroPhotography from "@/components/home/HeroPhotography";
import HeroFlexServev2 from "@/components/home/HeroPhotographyv2";
import { motion } from 'framer-motion';
export default function Home() {
  return (
    <main className="pb-12 min-h-screen bg-[#e8e4d9]">
      <HeroFlexServev2 />
      {/* <HeroPhotography /> */}
      <GalleryHome />

    </main>
  );
}