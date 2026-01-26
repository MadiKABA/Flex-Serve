import HeroPhotography from "@/components/home/HeroPhotography";
import HeroFlexServev2 from "@/components/home/HeroPhotographyv2";
import { motion } from 'framer-motion';
export default function Home() {
  return (
    <main className="pb-12 min-h-screen bg-[#e8e4d9]">
      <HeroFlexServev2 />
      {/* <HeroPhotography /> */}
      <div className="relative w-full overflow-hidden bg-[#2E4A6F]/70">

        {/* SVG des gouttes */}
        <div className="relative w-full">
          {/* Couche de fond : Les gouttes Jaunes */}
          <svg
            viewBox="0 0 1440 320"
            className="absolute top-[-2px] w-full fill-[#e8e4d9]"
            preserveAspectRatio="none"
          >
            <path d="M0,160 C120,300 240,40 360,180 C480,320 600,60 720,200 C840,340 960,100 1080,220 C1200,340 1320,120 1440,240 L1440,0 L0,0 Z" />
          </svg>

          {/* Couche de devant : Les gouttes Rouges (plus courtes) */}
          <svg
            viewBox="0 0 1440 320"
            className="relative top-[-5px] w-full  fill-[#F5F2E8]/10 backdrop-blur-xl"
            preserveAspectRatio="none"
          >
            <path d="M0,120 C100,220 200,80 300,160 C400,240 500,40 600,180 C700,300 800,100 900,140 C1000,180 1100,20 1200,160 C1300,280 1400,100 1440,140 L1440,0 L0,0 Z" />
          </svg>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <section className="text-center py-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-6">
                Bienvenue chez FlexServe
              </h1>
              <p className="text-xl text-white max-w-2xl mx-auto mb-8">
                Capturez vos moments précieux avec des professionnels
              </p>
            </section>
          </div>
        </div>
      </div>

    </main>
  );
}