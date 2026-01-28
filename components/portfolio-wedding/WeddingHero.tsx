'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function WeddingHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen flex items-center justify-center bg-[#2E4A6F] overflow-hidden"
        >
            {/* BACKGROUND AVEC EFFET IMMERSIF */}
            <motion.div style={{ scale }} className="absolute inset-0 z-0">
                <Image
                    src="/images/wedding-hero-bg.png"
                    alt="Mariage d'exception"
                    fill
                    priority
                    className="object-cover opacity-50 mix-blend-luminosity scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2E4A6F]/70 via-[#2E4A6F]/20 to-[#2E4A6F]" />
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.5)]" />
            </motion.div>

            {/* CONTENU TEXTE - IMPACT MAXIMAL */}
            <div className="container mx-auto px-4 relative z-10">
                <motion.div style={{ y: yText, opacity }} className="flex flex-col items-center">

                    {/* SUR-TITRE AÉRÉ */}
                    <motion.div
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "1.2em" }}
                        transition={{ duration: 1.5 }}
                        className="mb-6"
                    >
                        <span className="text-[#F5F2E8] text-[clamp(10px,1vw,14px)] uppercase font-light">
                            Love & Legacy
                        </span>
                    </motion.div>

                    {/* LE TITRE IMPACTANT */}
                    <h1 className="text-[12vw] md:text-[14vw] font-light text-white leading-[0.85] tracking-tighter text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="block font-serif italic text-[#F5F2E8] drop-shadow-2xl"
                        >
                            Capturer
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="block uppercase tracking-[-0.05em] drop-shadow-2xl"
                        >
                            L&apos;Éternel
                        </motion.span>
                    </h1>

                    {/* SOUS-TITRE ÉLÉGANT */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.2 }}
                        className="mt-10 text-[#F5F2E8]/60 text-sm md:text-xl font-light italic max-w-2xl mx-auto leading-relaxed text-center px-6"
                    >
                        Le patrimoine visuel de votre famille commence ici.
                    </motion.p>
                </motion.div>
            </div>

            {/* CADRE SUBTILE (PLUS FIN POUR LAISSÉ PLACE AU TITRE) */}
            <div className="absolute inset-6 md:inset-10 border border-[#F5F2E8]/5 pointer-events-none z-20" />

            {/* SCROLL INDICATOR */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-px h-24 bg-gradient-to-b from-[#F5F2E8]/40 via-[#F5F2E8]/10 to-transparent"
                />
            </div>
        </section>
    );
}