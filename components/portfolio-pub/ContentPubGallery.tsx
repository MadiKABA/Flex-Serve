'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from '../gallery/Lightbox';

const pubPhotos = [
    { id: 1, src: '/images/photo-1.jpg', title: '', category: '', size: 'lg' },
    { id: 2, src: '/images/portrait-1.jpg', title: '', category: '', size: 'md' },
    { id: 3, src: '/images/photo-3.jpg', title: '', category: '', size: 'md' },
    { id: 4, src: '/images/portrait-2.jpg', title: '', category: '', size: 'lg' },
    { id: 5, src: '/images/photo-3.jpg', title: '', category: '', size: 'md' },
    { id: 6, src: '/images/portrait-2.jpg', title: '', category: '', size: 'md' },
    { id: 7, src: '/images/photo-3.jpg', title: '', category: '', size: 'lg' },
    { id: 8, src: '/images/portrait-1.jpg', title: '', category: '', size: 'md' },
];

const photosForLightbox = pubPhotos.map((p) => ({
    src: p.src,
    title: p.title,
    category: p.category,
}));

// Spacer en haut de chaque colonne pour créer le décalage
// Les images gardent leur taille naturelle, zéro espace blanc entre elles
const colSpacers = [0, 64, 32, 96]; // px

export default function ContentPubGallery() {
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

    const columns: typeof pubPhotos[] = [[], [], [], []];
    pubPhotos.forEach((photo, i) => {
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
                                const index = pubPhotos.findIndex((p) => p.id === photo.id);
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
                    {pubPhotos.map((event, index) => (
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
