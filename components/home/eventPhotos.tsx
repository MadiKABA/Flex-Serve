'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const eventPhotos = [
    { id: 1, src: '/images/portrait-1.jpg', title: 'Sommet Business', category: 'Corporate', gridClass: 'md:col-span-2 md:row-span-2' },
    { id: 2, src: '/images/portrait-2.jpg', title: 'Conférence Tech', category: 'Innovation', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 3, src: '/images/portrait-3.jpg', title: 'Gala Annuel', category: 'Cérémonie', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 4, src: '/images/portrait-3.jpg', title: 'Lancement Produit', category: 'Marketing', gridClass: 'md:col-span-1 md:row-span-2' },
    { id: 5, src: '/images/portrait-1.jpg', title: 'Forum Entrepreneur', category: 'Business', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 6, src: '/images/portrait-3.jpg', title: 'Soirée Privée', category: 'Événementiel', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 7, src: '/images/portrait-2.jpg', title: 'Soirée Privée', category: 'Événementiel', gridClass: 'md:col-span-1 md:row-span-1' },
    { id: 7, src: '/images/portrait-2.jpg', title: 'Soirée Privée', category: 'Événementiel', gridClass: 'md:col-span-1 md:row-span-1' },
];

export default function EventsGallery() {
    return (
        <section className="px-6 relative overflow-hidden">

            <div className="max-w-7xl mx-auto">

                {/* GRILLE ASYMÉTRIQUE (BENTO) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1 auto-rows-[200px]">
                    {eventPhotos.map((event, index) => (
                        <GalleryItem
                            key={event.id}
                            event={event}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GalleryItem({
    event,
    delay,
}: {
    event: { src: string; title: string; category: string; gridClass: string };
    delay: number;
}) {
    return (
        <motion.div
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