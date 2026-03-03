'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import { useState } from 'react';

const portraitPhotos = [
    { id: 1, src: '/images/portrait/1-large.avif', title: '', category: '', size: 'lg' },
    { id: 2, src: '/images/portrait/AL (1).webp', title: '', category: '', size: 'md' },
    { id: 3, src: '/images/portrait/B1.webp', title: '', category: '', size: 'md' },
    { id: 4, src: '/images/portrait/MS (1).webp', title: '', category: '', size: 'lg' },
    { id: 5, src: '/images/portrait/N1.webp', title: '', category: '', size: 'md' },
    { id: 6, src: '/images/portrait/AL (3).webp', title: '', category: '', size: 'md' },
    { id: 7, src: '/images/portrait/t4.webp', title: '', category: '', size: 'md' },
    { id: 8, src: '/images/portrait/V5-thumb.webp', title: '', category: '', size: 'lg' },
    { id: 9, src: '/images/portrait/TB (3)-thumb.webp', title: '', category: '', size: 'md' },
    { id: 10, src: '/images/portrait/N1.webp', title: '', category: '', size: 'md' },
    { id: 11, src: '/images/portrait/MS (3)-thumb.webp', title: '', category: '', size: 'md' },
    { id: 12, src: '/images/portrait/N3.webp', title: '', category: '', size: 'lg' },
    { id: 13, src: '/images/portrait/FX_03588.webp', title: '', category: '', size: 'md' },
    { id: 14, src: '/images/portrait/AL (4).webp', title: '', category: '', size: 'md' },
    { id: 15, src: '/images/portrait/N1.webp', title: '', category: '', size: 'lg' },
    { id: 19, src: '/images/portrait/v3.webp', title: '', category: '', size: 'md' },
    { id: 20, src: '/images/portrait/TB (3).webp', title: '', category: '', size: 'lg' },
    { id: 21, src: '/images/portrait/MS (3).webp', title: '', category: '', size: 'lg' },
];

const photosForLightbox = portraitPhotos.map((p) => ({
    src: p.src,
    title: p.title,
    category: p.category,
}));

// Spacer en haut de chaque colonne pour créer le décalage
// Les images gardent leur taille naturelle, zéro espace blanc entre elles
const colSpacers = [0, 64, 32, 96]; // px

export default function ContentPortraitGallery() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const next = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex + 1) % photosForLightbox.length);
    };

    const prev = () => {
        if (openIndex === null) return;
        setOpenIndex(
            (openIndex - 1 + photosForLightbox.length) % photosForLightbox.length
        );
    };

    const columns: typeof portraitPhotos[] = [[], [], [], []];
    portraitPhotos.forEach((photo, i) => {
        columns[i % 4].push(photo);
    });

    return (
        <section className="px-6 py-0">
            <div className="container mx-auto">

                <div className="hidden lg:flex gap-0 items-start">
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-0">

                            {/* Spacer invisible — crée le décalage sans espace entre les images */}
                            {colSpacers[colIndex] > 0 && (
                                <div style={{ height: colSpacers[colIndex] }} aria-hidden="true" />
                            )}

                            {col.map((photo) => {
                                const index = portraitPhotos.findIndex((p) => p.id === photo.id);
                                return (
                                    <GalleryItem
                                        key={photo.id}
                                        event={photo}
                                        index={index}
                                        delay={index * 0.05}
                                        setOpenIndex={setOpenIndex}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Fallback mobile/tablet : masonry classique */}
                <div className="lg:hidden columns-1 sm:columns-2 md:columns-3 [column-gap:16px]">
                    {portraitPhotos.map((event, index) => (
                        <GalleryItem
                            key={event.id}
                            event={event}
                            delay={index * 0.05}
                            index={index}
                            setOpenIndex={setOpenIndex}
                        />
                    ))}
                </div>
            </div>

            {openIndex !== null && (
                <Lightbox
                    photos={photosForLightbox}
                    index={openIndex}
                    onClose={() => setOpenIndex(null)}
                    onNext={next}
                    onPrev={prev}
                />
            )}
        </section>
    );
}

function GalleryItem({
    event,
    delay,
    index,
    setOpenIndex,
}: {
    event: { src: string; title: string; category: string };
    delay: number;
    index: number;
    setOpenIndex: (i: number) => void;
}) {
    return (
        <motion.div
            onClick={() => setOpenIndex(index)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className="relative break-inside-avoid overflow-hidden cursor-pointer group"
        >
            <Image
                src={event.src}
                alt="gallery image"
                width={1000}
                height={1500}
                className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
        </motion.div>
    );
}