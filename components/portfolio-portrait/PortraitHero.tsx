'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function PortraitHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Effets de parallaxe
    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const opacityOverlay = useTransform(scrollYProgress, [0, 0.8], [0.6, 0.9]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen flex items-center justify-center bg-[#2E4A6F] overflow-hidden"
        >
            {/* IMAGE DE FOND AVEC PARALLAXE */}
            <motion.div
                style={{ scale: scaleBg }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/images/hero-portrait-bg.png" // Remplace par ton image phare
                    alt="Portrait artistique"
                    fill
                    priority
                    className="object-cover"
                />
                {/* OVERLAY DYNAMIQUE : Mélange du bleu signature et du noir pour la profondeur */}
                <motion.div
                    style={{ opacity: opacityOverlay }}
                    className="absolute inset-0 bg-gradient-to-b from-[#2E4A6F]/80 via-[#2E4A6F]/70 to-[#2E4A6F]"
                />
            </motion.div>

            {/* TEXTE GÉANT EN FILIGRANE (Optionnel avec image, mais gardé pour le style) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <h2 className="text-[20vw] font-serif italic text-[#F5F2E8]/5 whitespace-nowrap leading-none blur-[2px]">
                    Essence
                </h2>
            </div>

            <div className="container mx-auto px-6 relative z-20">
                <motion.div
                    style={{ y: yText }}
                    className="text-center space-y-8"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[#F5F2E8] text-xs uppercase tracking-[1em] block font-light"
                    >
                        Portfolio
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-[10rem] font-light text-white leading-none"
                    >
                        L&apos;âme par <br />
                        <span className="italic font-serif text-[#F5F2E8]">le regard.</span>
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100px" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-[1px] bg-[#F5F2E8]/30 mx-auto mt-12"
                    />
                </motion.div>
            </div>

            {/* DÉTAIL TECHNIQUE : Grain de film pour la texture */}
            <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('/images/noise.png')] mix-blend-overlay" />

            {/* INDICATEUR DE SCROLL */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="flex flex-col items-center gap-4"
                >
                    <span className="text-[9px] uppercase tracking-[0.5em] text-[#F5F2E8]/40">Scroll</span>
                    <div className="w-px h-16 bg-gradient-to-b from-[#F5F2E8]/50 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
}