'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const weddingMoments = [
    { id: 1, src: '/images/photo-1.jpg', label: 'Préparatifs' },
    { id: 2, src: '/images/photo-2.jpg', label: 'Cérémonie' },
    { id: 3, src: '/images/photo-3.jpg', label: 'Le Oui' },
    { id: 4, src: '/images/photo-1.jpg', label: 'Éclats de Rire' },
    { id: 5, src: '/images/photo-3.jpg', label: 'La Danse' },
    { id: 6, src: '/images/photo-2.jpg', label: 'Complicité' },
    { id: 7, src: '/images/photo-2.jpg', label: 'Décor & Détails' },
    { id: 8, src: '/images/photo-3.jpg', label: 'Famille & Invités' },
    { id: 9, src: '/images/photo-2.jpg', label: 'Moment Vrai' },
    { id: 10, src: '/images/photo-1.jpg', label: 'Émotion Pure' },
];

const weddingGridPhotos = [
    { id: 11, src: '/images/portrait-1.jpg', title: 'Lumière Dorée', category: 'Extérieur', size: 'lg' },
    { id: 12, src: '/images/portrait-2.jpg', title: 'Danse des Étoiles', category: 'Soirée', size: 'md' },
    { id: 13, src: '/images/portrait-3.jpg', title: 'Éclat Emotionnel', category: 'Cérémonie', size: 'md' },
    { id: 14, src: '/images/portrait-3.jpg', title: 'Rires & Joie', category: 'Famille', size: 'lg' },
    { id: 15, src: '/images/portrait-2.jpg', title: 'Décor Sublime', category: 'Détails', size: 'md' },
    { id: 16, src: '/images/portrait-1.jpg', title: 'Regards Croisés', category: 'Couple', size: 'md' },
    { id: 17, src: '/images/portrait-2.jpg', title: 'Moments Vrais', category: 'Émotion', size: 'lg' },
    { id: 18, src: '/images/portrait-3.jpg', title: 'Sérénité', category: 'Extérieur', size: 'md' },
    { id: 19, src: '/images/portrait-2.jpg', title: 'Élégance', category: 'Studio', size: 'md' },
];

export default function ContentWeddingGallery() {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const x = useTransform(scrollYProgress, [0, 1], ['15%', '-60%']);

    return (
        <section className="relative py-24 md:py-40 bg-[#2E4A6F]/90 overflow-hidden" ref={ref}>

            {/* TITRE */}
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.05, scale: 1 }}
                className="absolute top-10 md:top-20 left-5 text-[8rem] sm:text-[12rem] md:text-[20rem] font-bold text-white/5 leading-none select-none pointer-events-none z-0"
            >
                MARIAGE
            </motion.h2>

            <div className="relative max-w-7xl mx-auto px-6 z-10">
                <h3 className="text-4xl md:text-6xl font-light text-white mb-16">
                    Capturons chaque <br />
                    <span className="italic font-serif">moment inoubliable</span>
                </h3>
            </div>

            {/* GALERIE HORIZONTALE */}
            <motion.div
                style={{ x }}
                className="relative flex items-center space-x-8 md:space-x-12 px-6 z-10 mb-32"
            >
                {weddingMoments.map((item, index) => {
                    const isEven = index % 2 === 0;
                    const rotations = ['-3deg', '4deg', '-2deg', '5deg', '-4deg', '3deg', '-5deg', '2deg', '3deg', '-2deg'];

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.8 }}
                            viewport={{ once: true }}
                            className={`relative flex-shrink-0 -ml-8 md:-ml-16 rotate-[${rotations[index]}]`}
                            style={{
                                marginTop: isEven ? '-20px' : '40px',
                                zIndex: isEven ? 20 : 10,
                            }}
                            whileHover={{
                                scale: 1.08,
                                rotate: 0,
                                zIndex: 100,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="relative group w-[220px] sm:w-[280px] md:w-[360px] aspect-[3/4] bg-white rounded-sm p-2 md:p-3 shadow-2xl border-2 border-[#2E4A6F]/50 overflow-hidden">
                                <Image
                                    src={item.src}
                                    alt={item.label}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <p className="text-[#F8F6F2]/70 text-xs uppercase tracking-widest mb-1">
                                        Moment
                                    </p>
                                    <h3 className="text-white text-lg font-semibold">{item.label}</h3>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* GRID SECONDARY */}
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
                    {weddingGridPhotos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.8 }}
                            viewport={{ once: true }}
                            whileHover={{
                                scale: 1.04,
                                rotate: 0.5,
                                transition: { duration: 0.4 }
                            }}
                            className={`group relative overflow-hidden rounded-sm shadow-2xl ${photo.size === 'lg' ? 'row-span-2' : ''}`}
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
        </section>
    );
}
