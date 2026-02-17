'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import { useState } from 'react';


const eventPhotos = [
    { id: 1, src: '/images/portrait/N.webp', title: '', category: '', gridClass: 'md:col-span-2 md:row-span-2' },
    { id: 2, src: '/images/event/Stefdekarda 1-thumb.webp', title: '', category: '', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 3, src: '/images/portrait/AL (3).webp', title: '', category: '', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 4, src: '/images/event/F1-thumb.webp', title: '', category: '', gridClass: 'md:col-span-1 md:row-span-2' },
    { id: 5, src: '/images/portrait/v3-thumb.webp', title: '', category: '', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 6, src: '/images/portrait/AL (4)-thumb.webp', title: '', category: '', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 7, src: '/images/portrait/MS (3).webp', title: '', category: '', gridClass: 'md:col-span-1 md:row-span-1' },
];

const photosForLightbox = eventPhotos.map(p => ({
    src: p.src,
    title: p.title,
    category: p.category
}))

export default function EventsGallery() {

    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const next = () => {
        if (openIndex === null) return
        setOpenIndex((openIndex + 1) % photosForLightbox.length)
    }

    const prev = () => {
        if (openIndex === null) return
        setOpenIndex((openIndex - 1 + photosForLightbox.length) % photosForLightbox.length)
    }


    return (
        <section className="px-6 relative overflow-hidden">

            <div className="container mx-auto sm:px-6 lg:px-2">

                {/* GRILLE ASYMÉTRIQUE (BENTO) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 auto-rows-[200px]">
                    {eventPhotos.map((event, index) => (
                        <GalleryItem
                            key={index}
                            event={event}
                            delay={index * 0.1}
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
    setOpenIndex
}: {
    event: { src: string; title: string; category: string; gridClass: string };
    delay: number;
    index: number;
    setOpenIndex: (i: number) => void
}) {
    return (
        <motion.div
            onClick={() => setOpenIndex(index)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden group cursor-pointer rounded-sm border-3 border-white bg-white shadow-sm ${event.gridClass}`}
        >
            <Image
                src={event.src}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 rounded-sm"
            />

            {/* Overlay Gradient (Toujours visible mais s'intensifie au hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4A6F]/80 via-transparent to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Contenu Texte - Positionné en bas à gauche */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[#EAE7DC] text-[10px] uppercase tracking-[0.2em] font-bold mb-1 block">
                    {event.category}
                </span>
                <h3 className="text-white text-lg md:text-xl font-semibold leading-tight">
                    {event.title}
                </h3>
            </div>

            {/* Bordure de focus au hover */}
            <div className="absolute inset-0 border-0 group-hover:border-4 border-[#2E4A6F]/20 transition-all duration-300 pointer-events-none" />
        </motion.div>
    );
}