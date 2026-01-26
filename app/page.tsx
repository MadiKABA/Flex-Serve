import HeroPhotography from "@/components/home/HeroPhotography";

export default function Home() {
  return (
    <main className="pt-12 pb-12 min-h-screen bg-[#e8e4d9]">
      <HeroPhotography />
      <section className="relative bg-[#F5F2E8] pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2E4A6F]">
            Notre expertise
          </h2>

          <p className="mt-6 max-w-2xl text-[#2E4A6F]/80">
            Nous accompagnons les marques, institutions et créateurs
            dans la production de contenus visuels haut de gamme.
          </p>
        </div>
      </section>

    </main>
  );
}