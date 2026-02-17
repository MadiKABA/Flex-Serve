'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const portraitPhotos = [
    { id: 1, src: '/images/portrait/AL (3).webp', title: '', category: '', size: 'lg' },
    { id: 2, src: '/images/portrait/B1.webp', title: '', category: '', size: 'md' },
    { id: 3, src: '/images/portrait/1.webp', title: '', category: '', size: 'md' },
    { id: 4, src: '/images/mariage/4.webp', title: '', category: '', size: 'lg' },
    { id: 5, src: '/images/portrait/MS (1).webp', title: '', category: '', size: 'md' },
    { id: 6, src: '/images/portrait/t4-thumb.webp', title: '', category: '', size: 'md' },
    { id: 7, src: '/images/mariage/FX_04569.webp', title: '', category: '', size: 'md' },
];

export default function PortraitGallery() {

    const [index, setIndex] = useState<number | null>(null);

    // navigation clavier
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (index === null) return;

            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'Escape') setIndex(null);
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [index]);

    const next = () => {
        if (index === null) return;
        setIndex((index + 1) % portraitPhotos.length);
    };

    const prev = () => {
        if (index === null) return;
        setIndex((index - 1 + portraitPhotos.length) % portraitPhotos.length);
    };

    return (
        <>
            <section className="pt-5 pb-1 px-6 bg-[#2E4A6F]/25">
                <div className="container mx-auto sm:px-6 lg:px-2">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 auto-rows-[280px]">
                        {portraitPhotos.map((photo, i) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.6 }}
                                viewport={{ once: true }}
                                onClick={() => setIndex(i)}
                                className={`
                                    group relative overflow-hidden rounded-sm border-3 border-white bg-white shadow-sm cursor-zoom-in
                                    ${photo.size === 'lg' ? 'row-span-2' : ''}
                                `}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#2E4A6F]/80 via-[#2E4A6F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <p className="text-[#EAE7DC] text-xs uppercase tracking-widest mb-1">
                                        {photo.category}
                                    </p>
                                    <h3 className="text-white text-xl font-semibold">
                                        {photo.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= LIGHTBOX ================= */}
            <AnimatePresence>
                {index !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
                    >
                        {/* close */}
                        <button
                            onClick={() => setIndex(null)}
                            className="absolute top-6 right-6 text-white hover:scale-110 transition"
                        >
                            <X size={32} />
                        </button>

                        {/* left arrow */}
                        <button
                            onClick={prev}
                            className="absolute left-4 md:left-10 text-white hover:scale-110 transition"
                        >
                            <ChevronLeft size={42} />
                        </button>

                        {/* image */}
                        <div className="relative w-[92vw] h-[85vh]">
                            <Image
                                src={portraitPhotos[index].src}
                                alt=""
                                fill
                                priority
                                sizes="100vw"
                                className="object-contain"
                            />
                        </div>

                        {/* right arrow */}
                        <button
                            onClick={next}
                            className="absolute right-4 md:right-10 text-white hover:scale-110 transition"
                        >
                            <ChevronRight size={42} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}