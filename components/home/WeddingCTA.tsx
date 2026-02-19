'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function WeddingCTA() {
    return (
        <section className="relative py-24 md:py-40  overflow-hidden">
            {/* Décoration de fond (Cercle subtil) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5F2E8]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* VISUEL PUB (Composition de 2 images) */}
                    <div className="relative h-[400px] md:h-[600px]">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute left-0 top-0 w-2/3 h-[80%] z-10 shadow-2xl rounded-sm"
                        >
                            <Image
                                src="/images/portrait/V9.webp"

                                alt="Détail Mariage"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-sm"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="absolute right-0 bottom-0 w-2/3 h-[70%] border-[12px] rounded-sm border-[#F5F2E8]/10 shadow-2xl"
                        >
                            <Image
                                src="/images/portrait/N.webp"
                                alt="Ambiance"
                                fill
                                className="object-cover rounded-sm"
                            />
                        </motion.div>
                    </div>

                    {/* TEXTE & BOUTON */}
                    <div className="text-[#F5F2E8] space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-xs uppercase tracking-[0.5em] opacity-60">Saison 2026</span>
                            <h2 className="text-5xl md:text-7xl font-light mt-4 leading-tight">
                                Écrivons votre <br />
                                <span className="italic font-serif">prochain chapitre.</span>
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-[#F5F2E8]/70 text-lg max-w-md leading-relaxed"
                        >
                            Nos agendas pour la prochaine saison sont ouverts.
                            Réservez une consultation privée afin de structurer votre projet et donner à votre image l’impact qu’elle mérite.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pt-4"
                        >
                            <button className="group relative px-8 py-4 bg-[#F5F2E8] text-[#2E4A6F] rounded-sm overflow-hidden transition-all duration-500 hover:pr-12">
                                <span className="relative z-10 uppercase tracking-widest text-sm font-semibold">
                                    <Link href={"/reservation"}>
                                        Réserver Maintenant
                                    </Link>
                                </span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-6 transition-all duration-500">
                                    →
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}