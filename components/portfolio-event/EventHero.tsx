'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function EventHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Effets de parallaxe et de dispersion
    const textLeft = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const textRight = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen flex items-center justify-center bg-[#2E4A6F] overflow-hidden"
        >
            {/* BACKGROUND : Image ou Vidéo à fort impact */}
            <motion.div style={{ scale }} className="absolute inset-0 z-0">
                <Image
                    src="/images/event-hero-bg.jpg" // Image d'une foule en mouvement ou d'un gala
                    alt="Événementiel de prestige"
                    fill
                    priority
                    className="object-cover brightness-[0.4] contrast-[1.1]"
                />
                {/* Overlay coloré progressif */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2E4A6F]/20 to-[#2E4A6F]" />
            </motion.div>

            {/* CONTENU TEXTE DYNAMIQUE */}
            <div className="container mx-auto px-6 relative z-10">
                <motion.div style={{ opacity }} className="text-center">

                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.8em" }}
                        transition={{ duration: 1.5 }}
                        className="text-[#F5F2E8] text-[10px] md:text-xs uppercase block mb-12 font-medium"
                    >
                        Live Experience
                    </motion.span>

                    <div className="relative inline-block">
                        {/* Titre scindé qui s'écarte au scroll */}
                        <h1 className="text-[12vw] md:text-[10vw] font-light leading-none text-white flex flex-col items-center">
                            <motion.span style={{ x: textLeft }} className="block">
                                L&apos;INSTANT
                            </motion.span>
                            <motion.span
                                style={{ x: textRight }}
                                className="block italic font-serif text-[#F5F2E8] -mt-[2vw]"
                            >
                                IMMORTEL
                            </motion.span>
                        </h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-12 text-white/40 text-sm md:text-base font-light tracking-[0.2em] max-w-xl mx-auto uppercase"
                    >
                        Des galas de prestige aux lancements exclusifs, <br />
                        nous capturons l&apos;énergie de vos événements.
                    </motion.p>
                </motion.div>
            </div>

            {/* BARRES DÉCORATIVES (Style Studio/Production) */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#2E4A6F] to-transparent z-20" />

            <div className="absolute left-12 bottom-12 hidden md:block z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-white/20" />
                    <span className="text-[10px] text-white/20 uppercase tracking-widest rotate-90 origin-left ml-4">
                        Scroll to explore
                    </span>
                </div>
            </div>

            {/* Bordures de cadre caméra subtiles */}
            <div className="absolute inset-12 border border-white/5 pointer-events-none z-20" />
        </section>
    );
}