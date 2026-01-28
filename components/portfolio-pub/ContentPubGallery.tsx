'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const pubPhotos = [
    { id: 1, src: '/images/photo-1.jpg', title: 'Campagne Print', category: 'Commercial', size: 'lg' },
    { id: 2, src: '/images/portrait-1.jpg', title: 'Shooting Produit', category: 'Editorial', size: 'md' },
    { id: 3, src: '/images/photo-3.jpg', title: 'Ambiance Studio', category: 'Corporate', size: 'md' },
    { id: 4, src: '/images/portrait-2.jpg', title: 'Concept Creatif', category: 'Commercial', size: 'lg' },
    { id: 5, src: '/images/photo-3.jpg', title: 'Light & Shadow', category: 'Editorial', size: 'md' },
    { id: 6, src: '/images/portrait-2.jpg', title: 'Produit en Action', category: 'Commercial', size: 'md' },
    { id: 7, src: '/images/photo-3.jpg', title: 'Séminaire', category: 'Corporate', size: 'lg' },
    { id: 8, src: '/images/portrait-1.jpg', title: 'Publicité Digitale', category: 'Marketing', size: 'md' },
    { id: 9, src: '/images/portrait-2.jpg', title: 'Brand Story', category: 'Editorial', size: 'md' },
    { id: 10, src: '/images/photo-1.jpg', title: 'Lancement Produit', category: 'Commercial', size: 'lg' },
];

export default function ContentPubGallery() {
    return (
        <section className="py-12 px-6 bg-gradient-to-b from-[#2E4A6F]/85 to-[#2E4A6F]/70">
            <div className="container mx-auto space-y-12">

                {/* GRID PRINCIPAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
                    {pubPhotos.slice(0, 10).map((photo, index) => (
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
                            {/* IMAGE ZOOM LENT */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{ scale: 1.08 }}
                                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* OVERLAY CINÉMATOGRAPHIQUE */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition duration-500" />

                            {/* TEXTE IMMERSIF */}
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
