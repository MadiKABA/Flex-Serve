'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function AboutHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center bg-[#F5F2E8] overflow-hidden pt-20"
        >
            {/* TEXTE GÉANT EN ARRIÈRE-PLAN (L'ÂME) */}
            <motion.h2
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.05, x: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute top-1/2 left-10 -translate-y-1/2 text-[15rem] md:text-[25rem] font-serif italic text-[#2E4A6F] whitespace-nowrap z-0 pointer-events-none"
            >
                L&apos;œil & l&apos;esprit
            </motion.h2>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* CÔTÉ GAUCHE : TEXTE ÉDITORIAL */}
                    <motion.div
                        style={{ opacity: opacityText }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-xs uppercase tracking-[0.6em] text-[#2E4A6F]/60 block mb-4">
                                Depuis 2018
                            </span>
                            <h1 className="text-5xl md:text-8xl font-light text-[#2E4A6F] leading-[1.1]">
                                Au-delà de <br />
                                <span className="italic font-serif pl-8 md:pl-16">l&apos;image.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-lg text-[#2E4A6F]/80 font-light leading-relaxed max-w-md border-l-2 border-[#2E4A6F]/10 pl-6"
                        >
                            Photographe par passion, conteur par nécessité. Mon travail consiste à capturer non pas ce que je vois, mais ce que je ressens face à l&apos;instant.
                        </motion.p>
                    </motion.div>

                    {/* CÔTÉ DROIT : PORTRAIT / IMAGE SIGNATURE */}
                    <div className="lg:col-span-7 relative">
                        <motion.div
                            style={{ y: yImage }}
                            className="relative w-full aspect-[4/5] md:aspect-square lg:w-[110%] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="/images/photographer-portrait.jpg" // Image de toi ou d'une main tenant un boitier
                                alt="Le photographe au travail"
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Overlay subtil */}
                            <div className="absolute inset-0 bg-[#2E4A6F]/5 mix-blend-multiply" />
                        </motion.div>

                        {/* Petit encadré flottant (Stats ou Citation) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute -bottom-10 -left-10 md:left-20 bg-white p-8 md:p-12 shadow-xl z-20 max-w-[280px]"
                        >
                            <p className="text-[#2E4A6F] font-serif italic text-xl">
                                &quot;La photographie est une brève complicité entre la prévoyance et le hasard.&quot;
                            </p>
                            <div className="mt-4 w-10 h-[1px] bg-[#2E4A6F]/30" />
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* BARRE DE SCROLL MINIMALISTE */}
            <div className="absolute bottom-10 right-10 flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#2E4A6F]/40">Philosophie</span>
                <div className="w-20 h-[1px] bg-[#2E4A6F]/20" />
            </div>
        </section>
    );
}