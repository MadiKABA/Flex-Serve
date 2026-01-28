'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function PubHero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center bg-[#0A0A0A] overflow-hidden"
        >
            {/* IMAGE DE FOND */}
            <motion.div
                style={{ scale: scaleImage }}
                className="absolute inset-0 z-0 w-full h-full"
            >
                <Image
                    src="/images/pub-hero-bg.png"
                    alt="Campagne Publicitaire"
                    fill
                    priority
                    className="object-cover brightness-[0.5]"
                />
            </motion.div>

            {/* OVERLAYS DYNAMIQUES */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Vignette et gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                {/* Rayons diagonaux animés */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <motion.div
                        className="absolute w-[200%] h-[2px] bg-[#2E4A6F]/50 rotate-[25deg] animate-slide-slow"
                        animate={{ x: [-200, 200] }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[200%] h-[2px] bg-[#2E4A6F]/30 rotate-[15deg] animate-slide-slow"
                        animate={{ x: [200, -200] }}
                        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                    />
                </div>
            </div>

            {/* CONTENU TEXTE */}
            <div className="container mx-auto px-6 relative z-10">
                <motion.div style={{ y: yText }} className="max-w-6xl mx-auto text-center md:text-left">
                    <span className="text-[#F5F2E8] text-[clamp(10px,1vw,14px)] uppercase font-light mb-4 block">
                        Commercial & Editorial
                    </span>
                    <h1 className="text-[12vw] md:text-[12vw] font-black text-white leading-[0.8] uppercase tracking-tighter italic relative">
                        <motion.span
                            initial={{ opacity: 0, x: -50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="block text-white drop-shadow-[0_0_30px_rgba(46,74,111,0.8)]"
                        >
                            Impact
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="block text-transparent stroke-[2px] stroke-white"
                            style={{ WebkitTextStroke: '2px rgba(245, 242, 232, 0.5)' }}
                        >
                            Visuel.
                        </motion.span>
                    </h1>

                    <p className="mt-12 text-[#F5F2E8]/60 text-sm md:text-xl font-light italic max-w-lg leading-relaxed">
                        Sublimer chaque texture. Raconter l&apos;histoire par la lumière.
                    </p>
                </motion.div>
            </div>

            {/* Coins tech */}
            <div className="absolute top-8 left-8 w-12 h-px bg-white/20" />
            <div className="absolute top-8 left-8 w-px h-12 bg-white/20" />
            <div className="absolute top-8 right-8 w-12 h-px bg-white/20" />
            <div className="absolute top-8 right-8 w-px h-12 bg-white/20" />
            <div className="absolute bottom-8 left-8 w-12 h-px bg-white/20" />
            <div className="absolute bottom-8 left-8 w-px h-12 bg-white/20" />
            <div className="absolute bottom-8 right-8 w-12 h-px bg-white/20" />
            <div className="absolute bottom-8 right-8 w-px h-12 bg-white/20" />
        </section>
    );
}
