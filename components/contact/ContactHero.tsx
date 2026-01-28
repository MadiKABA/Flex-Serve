'use client';

import { motion } from 'framer-motion';

export default function ContactHero() {
    return (
        <section className="relative pt-32 pb-20 bg-[#2E4A6F] overflow-hidden">
            {/* Texte en arrière-plan avec flou */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.03, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-[20vw] font-serif italic text-white whitespace-nowrap leading-none select-none blur-sm"
                >
                    Connexion & Vision
                </motion.h2>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <span className="text-[#F5F2E8] text-xs uppercase tracking-[0.6em] block">Contact</span>
                    <h1 className="text-6xl md:text-8xl font-light text-white leading-tight">
                        Donnons vie à <br />
                        <span className="italic font-serif text-[#F5F2E8]">votre récit.</span>
                    </h1>
                </motion.div>
            </div>
        </section>
    );
}