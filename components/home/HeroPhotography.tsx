'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroFlexServe() {
    return (
        <section className="relative overflow-hidden">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#F5F2E8]/70 backdrop-blur-xl" />

            {/* Subtle light effect */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#2E4A6F]/10 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 py-24">
                <div className="grid items-center gap-20 lg:grid-cols-2">

                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold text-[#2E4A6F]">
                            Donnez une image forte <br />
                            <span className="font-bold">à votre vision</span>
                        </h1>

                        <p className="max-w-xl text-lg text-[#2E4A6F]/80">
                            Des visuels professionnels, précis et intemporels,
                            pensés pour les marques exigeantes.
                        </p>

                        <div className="flex gap-4">
                            <button className="rounded-xl bg-[#2E4A6F] px-6 py-3 text-white font-medium">
                                Voir le portfolio
                            </button>
                            <button className="rounded-xl border border-[#2E4A6F]/40 px-6 py-3 text-[#2E4A6F] font-medium">
                                Nous contacter
                            </button>
                        </div>
                    </motion.div>

                    {/* RIGHT – PHOTO PRINT STYLE (DISPOSITION TRIANGULAIRE) */}
                    <div className="relative mx-auto h-[500px] w-full max-w-lg">

                        {/* Photo haut gauche */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, y: 20 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                y: 0,
                                scale: [1, 1.015, 1],
                            }}
                            transition={{
                                opacity: { delay: 0.2, duration: 0.7 },
                                x: { delay: 0.2, duration: 0.7 },
                                y: { delay: 0.2, duration: 0.7 },
                                scale: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                            whileHover={{ scale: 1.05, zIndex: 40 }}
                            className="absolute left-4 top-0 z-10 rotate-[25deg]"
                        >
                            <div className="bg-white p-1 shadow-xl border border-gray-100 rounded-sm">
                                <Image
                                    src="/images/photo-1.jpg"
                                    alt="Portfolio 1"
                                    width={200}
                                    height={200}
                                    className="object-cover rounded-sm"
                                />
                            </div>
                        </motion.div>

                        {/* Photo haut droite */}
                        <motion.div
                            initial={{ opacity: 0, x: 20, y: 20 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                y: 0,
                                scale: [1, 1.015, 1],
                            }}
                            transition={{
                                opacity: { delay: 0.35, duration: 0.7 },
                                x: { delay: 0.35, duration: 0.7 },
                                y: { delay: 0.35, duration: 0.7 },
                                scale: {
                                    duration: 4.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                            whileHover={{ scale: 1.05, zIndex: 40 }}
                            className="absolute right-4 top-0 z-20 rotate-[-25deg]"
                        >
                            <div className="bg-white p-1 shadow-xl border border-gray-100 rounded-sm">
                                <Image
                                    src="/images/photo-2.jpg"
                                    alt="Portfolio 2"
                                    width={200}
                                    height={200}
                                    className="object-cover rounded-sm"
                                />
                            </div>
                        </motion.div>

                        {/* Photo centrale basse */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: [1, 1.015, 1],
                            }}
                            transition={{
                                opacity: { delay: 0.5, duration: 0.7 },
                                y: { delay: 0.5, duration: 0.7 },
                                scale: {
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                            whileHover={{ scale: 1.05, zIndex: 40 }}
                            className="absolute left-1/2 bottom-4 z-30 -translate-x-1/2 rotate-0"
                        >
                            <div className="bg-white p-1 shadow-2xl border border-gray-100 rounded-sm">
                                <Image
                                    src="/images/photo-3.jpg"
                                    alt="Portfolio 3"
                                    width={220}
                                    height={220}
                                    className="object-cover rounded-sm"
                                />
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

        </section>
    );
}
