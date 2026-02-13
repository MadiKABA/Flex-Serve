'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const moments = [
    { id: 1, src: '/images/mariage/77.webp', label: 'Préparatifs' },
    { id: 2, src: '/images/mariage/Mamy B1.webp', label: 'L’attente' },
    { id: 3, src: '/images/mariage/MC (3).webp', label: 'Le Oui' },
    { id: 4, src: '/images/mariage/Mariage Vero-52.webp', label: 'Émotions' },
    { id: 5, src: '/images/mariage/MC- (1).webp', label: 'La fête' },
    { id: 6, src: '/images/mariage/55-thumb.webp', label: 'Dernières lueurs' },
    { id: 7, src: '/images/mariage/A4 (3).webp', label: 'Complicité' },
    { id: 8, src: '/images/mariage/Mamy B1.webp', label: 'Éternité' },
];

export default function WeddingStorySection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

    return (
        <section ref={ref} className="relative py-2 md:py-32 bg-[#2E4A6F]/25 overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.04, scale: 1 }}
                className="absolute top-10 md:top-20 left-5 text-[8rem] sm:text-[12rem] md:text-[25rem] font-bold text-white leading-none select-none pointer-events-none z-0"
            >
                LOVE
            </motion.h2>

            <div className="relative max-w-7xl mx-auto px-6 mb-12 md:mb-16 z-10">
                <h3 className="text-4xl md:text-7xl font-light text-white leading-tight">
                    Une histoire. <br />
                    <span className="italic font-serif">Un jour unique.</span>
                </h3>
            </div>

            {/* GALERIE HORIZONTALE DRAG + SCROLL VERTICAL */}
            <motion.div
                style={{ x }}
                className="relative flex items-center z-10 space-x-8 overflow-x-auto overflow-y-hidden touch-pan-x scrollbar-hidden"
            >
                {moments.map((item, index) => {
                    const isEven = index % 2 === 0;
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
                            className={`relative flex-shrink-0 ${rotations[index]}`}
                            style={{ marginTop: isEven ? '-20px' : '40px', zIndex: isEven ? 20 : 10, minWidth: 220 }}
                        >
                            <div className="relative group">
                                <div className="relative w-[220px] sm:w-[280px] md:w-[360px] aspect-[3/4] bg-white rounded-sm p-2 md:p-3 shadow-[15px_15px_40px_rgba(46,74,111,0.15)] border-3 border-[#2E4A6F]/50">
                                    <div className="relative w-full h-[85%] overflow-hidden">
                                        <Image
                                            src={item.src}
                                            alt={item.label}
                                            fill
                                            sizes="(max-width: 768px) 220px, 360px"
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
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