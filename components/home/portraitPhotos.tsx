'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const portraitPhotos = [
    { id: 1, src: '/images/portrait/AL (1).webp', title: 'Regard Profond', category: 'Studio', size: 'lg' },
    { id: 2, src: '/images/portrait/B1.webp', title: 'Lumière d\'Or', category: 'Extérieur', size: 'md' },
    { id: 3, src: '/images/portrait/1.webp', title: 'Sérénité', category: 'Noir & Blanc', size: 'md' },
    { id: 4, src: '/images/portrait/N1.webp', title: 'Business Pro', category: 'Corporate', size: 'lg' },
    { id: 5, src: '/images/portrait/MS (1).webp', title: 'Éclat Naturel', category: 'Lifestyle', size: 'md' },
    { id: 6, src: '/images/portrait/t4-thumb.webp', title: 'Expression', category: 'Studio', size: 'md' },
    { id: 6, src: '/images/portrait/FX_03581.webp', title: 'Expression', category: 'Studio', size: 'md' },
];

export default function PortraitGallery() {
    return (
        <section className="pt-5 pb-1 px-6 bg-[#2E4A6F]/25">
            <div className="container mx-auto sm:px-6 lg:px-2">

                {/* GRID GALERIE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 auto-rows-[280px]">
                    {portraitPhotos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.6 }}
                            viewport={{ once: true }}
                            className={`
                                group relative overflow-hidden rounded-sm border-3 border-white bg-white shadow-sm
                                ${photo.size === 'lg' ? 'row-span-2' : ''}
                            `}
                        >
                            {/* IMAGE */}
                            <Image
                                src={photo.src}
                                alt={photo.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4A6F]/80 via-[#2E4A6F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* TEXTE */}
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
    );
}
