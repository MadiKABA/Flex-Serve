'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const moments = [
    { id: 1, src: '/images/portrait-1.jpg', label: 'Préparatifs' },
    { id: 2, src: '/images/portrait-2.jpg', label: 'L’attente' },
    { id: 3, src: '/images/portrait-3.jpg', label: 'Le Oui' },
    { id: 4, src: '/images/portrait-2.jpg', label: 'Émotions' },
    { id: 5, src: '/images/portrait-1.jpg', label: 'La fête' },
    { id: 6, src: '/images/portrait-.jpg', label: 'Dernières lueurs' },
    { id: 7, src: '/images/portrait-2.jpg', label: 'Complicité' },
    { id: 8, src: '/images/portrait-3.jpg', label: 'Éternité' },
];

export default function WeddingStorySection() {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // On adapte le défilement pour qu'il soit plus long avec 8 images
    // Mobile: de 20% à -100% | Desktop: de 10% à -40%
    const x = useTransform(scrollYProgress, [0, 1], ['15%', '-60%']);

    return (
        <section
            ref={ref}
            className="relative py-2 md:py-32 bg-[#2E4A6F]/25 overflow-hidden"
        >
            {/* LOVE arrière-plan - Responsive font-size */}
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.04, scale: 1 }}
                className="absolute top-10 md:top-20 left-5 text-[8rem] sm:text-[12rem] md:text-[25rem] font-bold text-white leading-none select-none pointer-events-none z-0"
            >
                LOVE
            </motion.h2>

            {/* TITRE ÉDITORIAL */}
            <div className="relative max-w-7xl mx-auto px-6 mb-12 md:mb-16 z-10">
                <h3 className="text-4xl md:text-7xl font-light text-white leading-tight">
                    Une histoire. <br />
                    <span className="italic font-serif">Un jour unique.</span>
                </h3>
            </div>

            {/* GALERIE EN COLLAGE (8 IMAGES) */}
            <motion.div
                style={{ x }}
                className="relative flex items-center z-10"
            >
                {moments.map((item, index) => {
                    const isEven = index % 2 === 0;

                    // Variantes de rotation pour un look organique
                    const rotations = [
                        'rotate-[-3deg]', 'rotate-[4deg]', 'rotate-[-2deg]', 'rotate-[5deg]',
                        'rotate-[-4deg]', 'rotate-[3deg]', 'rotate-[-5deg]', 'rotate-[2deg]'
                    ];

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.8 }}
                            viewport={{ once: true }}
                            // Marges négatives : plus petites sur mobile (-ml-8) que sur desktop (-ml-24)
                            className={`relative flex-shrink-0 -ml-12 md:-ml-32 ${rotations[index]}`}
                            style={{
                                marginTop: isEven ? '-20px' : '40px',
                                zIndex: isEven ? 20 : 10
                            }}
                            whileHover={{
                                scale: 1.1,
                                rotate: 0,
                                zIndex: 100,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="relative group">
                                {/* Cadre Photo - Largeur adaptée mobile/desktop */}
                                <div className="relative w-[220px] sm:w-[280px] md:w-[360px] aspect-[3/4] bg-white rounded-sm  p-2 md:p-3 shadow-[15px_15px_40px_rgba(46,74,111,0.15)] border-3 border-[#2E4A6F]/50">
                                    <div className="relative w-full h-[85%] overflow-hidden">
                                        <Image
                                            src={item.src}
                                            alt={item.label}
                                            fill
                                            sizes="(max-width: 768px) 220px, 360px"
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Légende Polaroid */}
                                    <div className="h-[15%] flex flex-col justify-center px-1 md:px-2">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-[#2E4A6F] font-serif italic text-xs sm:text-sm md:text-lg truncate mr-2">
                                                {item.label}
                                            </p>
                                            <span className="text-[#2E4A6F]/30 text-[7px] md:text-[9px] tracking-widest uppercase flex-shrink-0">
                                                0{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* NAVIGATION INDICATOR */}
            <div className="mt-16 md:mt-24 flex justify-center">
                <div className="flex items-center gap-4 opacity-40">
                    <div className="h-[1px] w-12 md:w-20 bg-[#2E4A6F]" />
                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.6em] text-[#2E4A6F] whitespace-nowrap">
                        Explorez le récit
                    </span>
                    <div className="h-[1px] w-12 md:w-20 bg-[#2E4A6F]" />
                </div>
            </div>
        </section>
    );
}