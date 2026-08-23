'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import { useState } from 'react';
import type { MediaItem } from '@/lib/types/content';

// Spacer en haut de chaque colonne pour créer le décalage
// Les images gardent leur taille naturelle, zéro espace blanc entre elles
const colSpacers = [0, 64, 32, 96]; // px

export default function EventsGallery({ media }: { media: MediaItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const photosForLightbox = media.map((item) => ({
        src: item.cloudinary_url,
        title: item.title ?? '',
        category: item.category ?? '',
    }));

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

    const columns: MediaItem[][] = [[], [], [], []];
    media.forEach((item, i) => {
        columns[i % 4].push(item);
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

                            {col.map((item) => {
                                const index = media.findIndex((m) => m.id === item.id);
                                return (
                                    <GalleryItem
                                        key={item.id}
                                        item={item}
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
                    {media.map((item, index) => (
                        <GalleryItem
                            key={item.id}
                            item={item}
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
    item,
    delay,
    index,
    setOpenIndex,
}: {
    item: MediaItem;
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
                src={item.cloudinary_url}
                alt={item.alt_text ?? 'gallery image'}
                width={1000}
                height={1500}
                className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
        </motion.div>
    );
}
