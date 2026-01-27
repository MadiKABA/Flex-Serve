'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function ServicesHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Effet de parallaxe sur l'image et le texte
    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    return (
        <section
            ref={containerRef}
            className="relative h-[90vh] w-full overflow-hidden bg-[#F5F2E8]"
        >
            {/* Background Image avec Parallaxe */}
            <motion.div
                style={{ scale: scaleImg }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/images/service/services-hero.png" // Image d'ambiance (ex: un appareil photo argentique ou un couple au loin)
                    alt="Photographie professionnelle"
                    fill
                    priority
                    className="object-cover brightness-[0.85]"
                />
                {/* Overlay dégradé pour la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#F5F2E8]" />
            </motion.div>

            {/* Contenu Texte */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
                <motion.div style={{ y: yText }} className="space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block text-[#F5F2E8] uppercase tracking-[0.5em] text-xs md:text-sm font-medium"
                    >
                        Expertise & Art
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-9xl text-white font-light leading-none"
                    >
                        Nos <br />
                        <span className="italic font-serif pl-12 md:pl-24">Services</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="max-w-md text-[#F5F2E8]/80 text-lg font-light leading-relaxed border-l border-[#F5F2E8]/30 pl-6"
                    >
                        Découvrez nos services : Portrait, Événementiel, Mariage et PUB, conçus pour capturer chaque moment unique avec style et émotion.
                    </motion.p>
                </motion.div>
            </div>

            {/* Indicateur de scroll minimaliste */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#2E4A6F]/40 rotate-90 mb-8">Scroll</span>
                <div className="w-[1px] h-12 bg-[#2E4A6F]/20 relative overflow-hidden">
                    <motion.div
                        animate={{ y: [0, 48] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-full h-1/2 bg-[#2E4A6F]"
                    />
                </div>
            </motion.div>
        </section>
    );
}