'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from '../gallery/Lightbox';
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

const lightboxPhotos = [
    ...portraitPhotos.map(p => ({
        src: p.src,
        title: p.title,
        category: p.category
    })),
];

export default function ContentPortraitGallery() {
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
        <section className="py-2 px-6 bg-[#2E4A6F]/85">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
                    {portraitPhotos.map((photo, index) => (
                        <motion.div
                            key={photo.id} // Ajout de la clé unique ici
                            onClick={() => setOpenIndex(index)}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.8 }}
                            viewport={{ once: true }}
                            whileHover={{
                                scale: 1.04,
                                rotate: 0.5,
                                transition: { duration: 0.4 }
                            }}
                            className={`group relative overflow-hidden rounded-sm shadow-2xl cursor-pointer ${photo.size === 'lg' ? 'row-span-2' : ''}`}
                        >
                            <motion.div
                                className="absolute inset-0"
                                animate={{ scale: 1.05 }}
                                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition duration-500" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-[#F5F2E8]/70 text-xs uppercase tracking-widest mb-1">{photo.category}</p>
                                <h3 className="text-white text-xl font-semibold">{photo.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
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