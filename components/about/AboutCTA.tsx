'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutCTA() {
    return (
        <section className="relative py-32 md:py-48 bg-[#2E4A6F] overflow-hidden">
            {/* Éléments décoratifs d'arrière-plan */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 md:px-12 text-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto space-y-12"
                >
                    <span className="text-[#F5F2E8]/50 text-xs uppercase tracking-[0.6em] font-light block">
                        Parlons de votre projet
                    </span>

                    <h2 className="text-5xl md:text-8xl font-light text-white leading-[1.1]">
                        Donnons vie à vos <br />
                        <span className="italic font-serif text-[#F5F2E8]">ambitions.</span>
                    </h2>

                    <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        FlexServe Studio met son expertise au service de votre image.
                        Qu’il s’agisse d’une campagne ambitieuse ou d’un projet plus intime, chaque réalisation est pensée avec exigence et précision.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 pt-10">
                        {/* Bouton Principal - Contraste fort en Crème */}
                        <Link
                            href="/contact"
                            className="group relative px-14 py-6 bg-[#F5F2E8] text-[#2E4A6F] overflow-hidden transition-all duration-500 rounded-sm"
                        >
                            <span className="relative z-10 uppercase tracking-[0.2em] text-xs font-bold">
                                Engager le studio
                            </span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>

                        {/* Lien Secondaire - Discret en Blanc */}
                        <Link
                            href="/portfolio/mariage"
                            className="group flex items-center gap-4 text-white/80 uppercase tracking-[0.2em] text-xs font-light hover:text-white transition-all"
                        >
                            <span className="border-b border-white/20 group-hover:border-white transition-all duration-500 pb-1">
                                Explorer le portfolio
                            </span>
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                →
                            </motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Signature visuelle en filigrane */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none">
                <span className="text-[15vw] font-serif italic text-white whitespace-nowrap">
                    Creative Studio
                </span>
            </div>
        </section>
    );
}