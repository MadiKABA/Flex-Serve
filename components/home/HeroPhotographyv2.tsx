'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { MediaItem } from '@/lib/types/content';

export default function HeroFlexServev2({
    title,
    body,
    ctaLabel,
    ctaUrl,
    ctaLabel2,
    ctaUrl2,
    image1,
    image2,
    image3,
}: {
    title: string;
    body?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
    ctaLabel2?: string | null;
    ctaUrl2?: string | null;
    image1?: MediaItem;
    image2?: MediaItem;
    image3?: MediaItem;
}) {
    return (
        <section className="pt-24 relative overflow-hidden bg-[#2E4A6F]/70 min-h-screen flex flex-col">
            {/* SVG DECOR TOP */}
            <div className="absolute top-0 left-0 w-full pointer-events-none">
                <svg
                    viewBox="0 0 1440 320"
                    className="w-full fill-[#e8e4d9]"
                    preserveAspectRatio="none"
                >
                    <path d="M0,160 C120,300 240,40 360,180 C480,320 600,60 720,200 C840,340 960,100 1080,220 C1200,340 1320,120 1440,240 L1440,0 L0,0 Z" />
                </svg>

                <svg
                    viewBox="0 0 1440 320"
                    className="absolute top-0 w-full fill-[#F5F2E8]/10 backdrop-blur-2xl"
                    preserveAspectRatio="none"
                >
                    <path d="M0,120 C100,220 200,80 300,160 C400,240 500,40 600,180 C700,300 800,100 900,140 C1000,180 1100,20 1200,160 C1300,280 1400,100 1440,140 L1440,0 L0,0 Z" />
                </svg>
            </div>

            {/* MAIN CONTENT – CENTRÉ VERTICALEMENT */}
            <div className="relative z-10 flex-1 flex items-center">
                <div className="mx-auto max-w-7xl px-6 w-full py-12 sm:py-28 lg:py-24">
                    <div className="grid items-center gap-20 lg:grid-cols-2">

                        {/* LEFT CONTENT */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="space-y-8"
                        >
                            <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold text-white leading-tight">
                                {title}<br />
                                <span className="sr-only"> — FlexServeStudio, photographe et vidéaste professionnel à Dakar, Sénégal</span>
                            </h1>

                            {body && (
                                <p className="max-w-xl text-lg text-white/80">
                                    {body}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4">
                                {ctaLabel && ctaUrl && (
                                    <button className="rounded-xl bg-[#2E4A6F] px-6 py-3 text-white font-medium">
                                        <Link href={ctaUrl}>
                                            {ctaLabel}
                                        </Link>
                                    </button>
                                )}
                                {ctaLabel2 && ctaUrl2 && (
                                    <button className="rounded-xl border border-white px-6 py-3 text-white font-medium">
                                        <Link href={ctaUrl2}>
                                            {ctaLabel2}
                                        </Link>
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* RIGHT – IMAGES */}
                        <div className="relative mx-auto h-[420px] sm:h-[460px] lg:h-[520px] w-full max-w-lg">

                            {/* Image gauche */}
                            {image1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, y: 20 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.7 }}
                                    whileHover={{ scale: 1.05, zIndex: 40 }}
                                    className="absolute left-6 top-6 rotate-[25deg]"
                                >
                                    <div className="bg-white p-1 shadow-xl border border-gray-100 rounded-sm">
                                        <Image
                                            src={image1.cloudinary_url}
                                            alt={image1.alt_text || "Portfolio 1"}
                                            width={200}
                                            height={200}
                                            priority
                                            className="object-cover rounded-sm"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Image droite */}
                            {image2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20, y: 20 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.7 }}
                                    whileHover={{ scale: 1.05, zIndex: 40 }}
                                    className="absolute right-6 top-6 rotate-[-25deg]"
                                >
                                    <div className="bg-white p-1 shadow-xl border border-gray-100 rounded-sm">
                                        <Image
                                            src={image2.cloudinary_url}
                                            alt={image2.alt_text || "Portfolio 2"}
                                            width={200}
                                            height={200}
                                            priority
                                            className="object-cover rounded-sm"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Image centrale */}
                            {image3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.7 }}
                                    whileHover={{ scale: 1.05, zIndex: 40 }}
                                    className="absolute left-1/2 bottom-6 -translate-x-1/2"
                                >
                                    <div className="bg-white p-1 shadow-2xl border border-gray-100 rounded-sm">
                                        <Image
                                            src={image3.cloudinary_url}
                                            alt={image3.alt_text || "Portfolio 3"}
                                            width={220}
                                            height={220}
                                            priority
                                            className="object-cover rounded-sm"
                                        />
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
