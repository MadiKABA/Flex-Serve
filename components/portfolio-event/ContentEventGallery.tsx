'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from '../gallery/Lightbox'; // Vérifie que le chemin est correct

const eventPhotos = [
    { id: 1, src: '/images/event/Stefdekarda 1-large.avif', title: '', category: '', size: 'xl' },
    { id: 2, src: '/images/event/F1-large.avif', title: '', category: '', size: 'md' },
    { id: 3, src: '/images/mariage/M6 (2).webp', title: '', category: '', size: 'md' },
    { id: 4, src: '/images/portrait/V9.webp', title: '', category: '', size: 'lg' },
    { id: 5, src: '/images/portrait/BW 1.webp', title: '', category: '', size: 'md' },
    { id: 6, src: '/images/portrait/TB (3).webp', title: '', category: '', size: 'lg' },
    { id: 7, src: '/images/portrait/AL (3).webp', title: '', category: '', size: 'md' },
    { id: 8, src: '/images/portrait/t1.webp', title: '', category: '', size: 'xl' },
    { id: 9, src: '/images/portrait/V5.webp', title: '', category: '', size: 'md' },
    { id: 10, src: '/images/portrait/N12.webp', title: '', category: '', size: 'lg' },
];

// Préparation des photos pour la lightbox
const lightboxPhotos = eventPhotos.map(p => ({
    src: p.src,
    title: p.title,
    category: p.category
}));

export default function ContentEventGallery() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const next = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex + 1) % lightboxPhotos.length);
    };

    const prev = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length);
    };

    return (
        <section className="py-10 px-6 bg-gradient-to-b from-[#2E4A6F] via-[#2E4A6F]/95 to-[#1F344D]">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-[260px]">
                    {eventPhotos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            onClick={() => setOpenIndex(index)} // Ouvre la lightbox au clic
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.8 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03 }}
                            className={`group relative overflow-hidden rounded-md shadow-[0_5px_7px_rgba(0,0,0,0.45)] cursor-pointer
                                ${photo.size === 'lg' ? 'row-span-2' : ''}
                                ${photo.size === 'xl' ? 'col-span-2 row-span-2' : ''}`}
                        >
                            <motion.div
                                className="absolute inset-0"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4A6F]/85 via-[#2E4A6F]/40 to-transparent" />

                            {/* EFFET LUMIÈRE */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_60%)]" />

                            {/* TEXTE (affiché uniquement si non vide) */}
                            {(photo.category || photo.title) && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                                        {photo.category}
                                    </p>
                                    <h3 className="text-white text-2xl font-semibold">
                                        {photo.title}
                                    </h3>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* LIGHTBOX */}
            {openIndex !== null && (
                <Lightbox
                    photos={lightboxPhotos}
                    index={openIndex}
                    onClose={() => setOpenIndex(null)}
                    onNext={next}
                    onPrev={prev}
                />
            )}
        </section>
    );
}