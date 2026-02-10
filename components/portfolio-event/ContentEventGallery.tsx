'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const eventPhotos = [
    { id: 1, src: '/images/event/Stefdekarda 1-large.avif', title: 'Ouverture de Séminaire', category: 'Conférence', size: 'xl' },
    { id: 2, src: '/images/event/F1-large.avif', title: 'Public Engagé', category: 'Séminaire', size: 'md' },
    { id: 3, src: '/images/portrait/', title: 'Panel d’Experts', category: 'Corporate', size: 'md' },
    { id: 4, src: '/images/portrait-2.jpg', title: 'Présentation Officielle', category: 'Institutionnel', size: 'lg' },
    { id: 5, src: '/images/portrait-1.jpg', title: 'Networking Premium', category: 'Business Event', size: 'md' },
    { id: 6, src: '/images/portrait-3.jpg', title: 'Discours Clé', category: 'Conférence', size: 'lg' },
    { id: 7, src: '/images/photo-1.jpg', title: 'Interaction Public', category: 'Séminaire', size: 'md' },
    { id: 8, src: '/images/photo-3.jpg', title: 'Lancement Produit', category: 'Corporate', size: 'xl' },
    { id: 9, src: '/images/photo-2.jpg', title: 'Espace Exposition', category: 'Salon', size: 'md' },
    { id: 10, src: '/images/portrait-2.jpg', title: 'Clôture Officielle', category: 'Institutionnel', size: 'lg' },
];

export default function ContentEventGallery() {
    return (
        <section className="py-10 px-6 bg-gradient-to-b from-[#2E4A6F] via-[#2E4A6F]/95 to-[#1F344D]">
            <div className="container mx-auto">

                {/* GRID DYNAMIQUE CORPORATE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-[260px]">
                    {eventPhotos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.8 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03 }}
                            className={`group relative overflow-hidden rounded-md shadow-[0_5px_7px_rgba(0,0,0,0.45)]
                ${photo.size === 'lg' ? 'row-span-2' : ''}
                ${photo.size === 'xl' ? 'col-span-2 row-span-2' : ''}`}
                        >

                            {/* IMAGE PARALLAX ZOOM */}
                            <motion.div
                                className="absolute inset-0"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* OVERLAY CORPORATE CINÉMATIQUE */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2E4A6F]/85 via-[#2E4A6F]/40 to-transparent" />

                            {/* LUMIÈRE ARCHITECTURALE (effet salle moderne) */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_60%)]" />

                            {/* TEXTE */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                                    {photo.category}
                                </p>
                                <h3 className="text-white text-2xl font-semibold">
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
