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
    { id: 8, src: '/images/mariage/FX_04569.webp', title: '', category: '', size: 'md' },
    { id: 9, src: '/images/portrait/N.webp', title: '', category: '' },
    { id: 10, src: '/images/event/Stefdekarda 1-thumb.webp', title: '', category: '' },
    { id: 11, src: '/images/portrait/AL (3).webp', title: '', category: '' },
    { id: 12, src: '/images/event/F1-thumb.webp', title: '', category: '' },
    { id: 13, src: '/images/portrait/v3-thumb.webp', title: '', category: '' },
    { id: 14, src: '/images/portrait/AL (4)-thumb.webp', title: '', category: '' },
    { id: 15, src: '/images/portrait/MS (3).webp', title: '', category: '' },
    { id: 16, src: '/images/portrait/MS (3).webp', title: '', category: '' },
];

// Décalage vertical appliqué à la 2ème image de chaque colonne
const secondImageOffsets = ['mt-0', 'mt-16', 'mt-8', 'mt-24'];

export default function PortraitGallery() {
    const [index, setIndex] = useState<number | null>(null);

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

    // Répartir les photos en 4 colonnes
    const columns: typeof portraitPhotos[] = [[], [], [], []];
    portraitPhotos.forEach((photo, i) => {
        columns[i % 4].push(photo);
    });

    return (
        <>
            <section className="pt-5 pb-1 px-6 bg-[#2E4A6F]/25">
                <div className="container mx-auto sm:px-6 lg:px-2">

                    {/* Desktop : 4 colonnes avec décalage vertical */}
                    <div className="hidden lg:flex gap-0 items-start">
                        {columns.map((col, colIndex) => (
                            <div key={colIndex} className="flex-1 flex flex-col gap-0">
                                {col.map((photo, photoIndex) => {
                                    const globalIndex = portraitPhotos.findIndex((p) => p.id === photo.id);
                                    // Décalage uniquement sur la 2ème image de chaque colonne
                                    const offsetClass = photoIndex === 1 ? secondImageOffsets[colIndex] : '';
                                    return (
                                        <motion.div
                                            key={photo.id}
                                            initial={{ opacity: 0, y: 24 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: globalIndex * 0.08, duration: 0.6 }}
                                            viewport={{ once: true }}
                                            onClick={() => setIndex(globalIndex)}
                                            className={`group relative overflow-hidden rounded-sm border-3 border-white bg-white shadow-sm cursor-zoom-in ${offsetClass}`}
                                        >
                                            <Image
                                                src={photo.src}
                                                alt={photo.title}
                                                width={1000}
                                                height={1500}
                                                sizes="25vw"
                                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
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
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Mobile / Tablet : grille originale */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-1 auto-rows-[280px]">
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
                                    sizes="(max-width:768px) 100vw, 50vw"
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
                        <button
                            onClick={() => setIndex(null)}
                            className="absolute top-6 right-6 text-white hover:scale-110 transition"
                        >
                            <X size={32} />
                        </button>

                        <button
                            onClick={prev}
                            className="absolute left-4 md:left-10 text-white hover:scale-110 transition"
                        >
                            <ChevronLeft size={42} />
                        </button>

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