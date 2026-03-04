'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import { useState } from 'react';

const eventPhotos = [
    { id: 1, src: '/images/portrait/AL (3).webp', title: '', category: '', size: 'lg' },
    { id: 2, src: '/images/portrait/B1.webp', title: '', category: '', size: 'md' },
    { id: 3, src: '/images/event/Stefdekarda 1-thumb.webp', title: '', category: '', size: 'md' },
    { id: 4, src: '/images/mariage/4.webp', title: '', category: '', size: 'lg' },
    { id: 5, src: '/images/event/3.webp', title: '', category: '', size: 'md' },
    { id: 6, src: '/images/event/t2.webp', title: '', category: '', size: 'md' },
    { id: 7, src: '/images/mariage/11_copy.webp', title: '', category: '', size: 'md' },
    { id: 8, src: '/images/mariage/M6 (2).webp', title: '', category: '', size: 'md' },
    { id: 9, src: '/images/portrait/N.webp', title: '', category: '' },
    { id: 10, src: '/images/mariage/A4 (3).webp', title: '', category: '' },
    { id: 11, src: '/images/mariage/Mariage Vero-42.webp', title: '', category: '' },
    { id: 12, src: '/images/event/F1-thumb.webp', title: '', category: '' },
    { id: 13, src: '/images/portrait/v3-thumb.webp', title: '', category: '' },
    { id: 14, src: '/images/portrait/bb2 (3).webp', title: '', category: '' },
    { id: 15, src: '/images/portrait/MS (3).webp', title: '', category: '' },
    { id: 16, src: '/images/portrait/h2.webp', title: '', category: '' },
];

const photosForLightbox = eventPhotos.map((p) => ({
    src: p.src,
    title: p.title,
    category: p.category,
}));

// Spacer en haut de chaque colonne pour créer le décalage
// Les images gardent leur taille naturelle, zéro espace blanc entre elles
const colSpacers = [0, 64, 32, 96]; // px

export default function EventsGallery() {
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

    const columns: typeof eventPhotos[] = [[], [], [], []];
    eventPhotos.forEach((photo, i) => {
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
                                const index = eventPhotos.findIndex((p) => p.id === photo.id);
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
                    {eventPhotos.map((event, index) => (
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