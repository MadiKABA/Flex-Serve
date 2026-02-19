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

    // Effet de parallaxe sur l'image et disparition du texte au scroll
    const yImage = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const opacityText = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center bg-[#2E4A6F] overflow-hidden pt-32 pb-20 md:pt-40"
        >
            {/* TEXTE GÉANT EN ARRIÈRE-PLAN (L'ÂME) - Opacité réduite pour le bleu */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.03, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    // Utilisation de vw (viewport width) pour que le texte s'adapte à l'écran
                    className="text-[18vw] font-serif italic text-white whitespace-nowrap leading-none select-none tracking-tighter"
                >
                    L&apos;œil & l&apos;esprit
                </motion.h2>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

                    {/* CÔTÉ GAUCHE : TEXTE ÉDITORIAL */}
                    <motion.div
                        style={{ opacity: opacityText }}
                        className="lg:col-span-5 space-y-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-xs uppercase tracking-[0.6em] text-white/50 block mb-6">
                                Depuis 2018
                            </span>
                            <h1 className="text-6xl md:text-8xl font-light text-white leading-[1.05]">
                                Au-delà de <br />
                                <span className="italic font-serif pl-10 md:pl-20 text-[#F5F2E8]">l&apos;image.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-md border-l-2 border-white/10 pl-8"
                        >
                            Chez FlexServe Studio, chaque projet est pensé avec direction artistique, précision et exigence du détail.
                            Nous créons des visuels puissants et intemporels qui renforcent votre image et marquent durablement les esprits.
                        </motion.p>
                    </motion.div>

                    {/* CÔTÉ DROIT : PORTRAIT / IMAGE SIGNATURE */}
                    <div className="lg:col-span-7 relative lg:pl-10">
                        <motion.div
                            style={{ y: yImage }}
                            className="relative w-full aspect-[4/5] md:aspect-[4/3] lg:w-[115%] overflow-hidden shadow-2xl rounded-sm"
                        >
                            <Image
                                src="/images/about/photographer-portrait.png"
                                alt="Le photographe au travail"
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Overlay subtil pour intégrer l'image au bleu */}
                            <div className="absolute inset-0 bg-[#2E4A6F]/10 mix-blend-multiply" />
                        </motion.div>


                    </div>

                </div>
            </div>

            {/* BARRE DE SCROLL MINIMALISTE */}
            <div className="absolute bottom-12 right-12 flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Philosophie</span>
                <div className="w-24 h-[1px] bg-white/20" />
            </div>
        </section>
    );
}