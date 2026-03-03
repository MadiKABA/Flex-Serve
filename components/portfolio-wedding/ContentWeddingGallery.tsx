'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import eventPhotos from '../home/eventPhotos';

const weddingMoments = [
    { id: 1, src: '/images/mariage/77.webp', label: '' },
    { id: 2, src: '/images/mariage/Mamy B1.webp', label: '' },
    { id: 3, src: '/images/mariage/MC (3).webp', label: '' },
    { id: 4, src: '/images/mariage/Mariage Vero-52.webp', label: '' },
    { id: 5, src: '/images/mariage/MC- (1).webp', label: '' },
    { id: 6, src: '/images/mariage/55-thumb.webp', label: '' },
    { id: 7, src: '/images/mariage/A4 (3).webp', label: '' },
    { id: 8, src: '/images/mariage/Mamy B1.webp', label: '' },

];

const weddingGridPhotos = [
    { id: 11, src: '/images/mariage/55-thumb.webp', title: '', category: '', size: 'lg' },
    { id: 12, src: '/images/mariage/Mamy V2.webp', title: '', category: '', size: 'md' },
    { id: 13, src: '/images/mariage/M6 (2).webp', title: '', category: '', size: 'md' },
    { id: 14, src: '/images/mariage/Mamy B2.webp', title: '', category: '', size: 'lg' },
    { id: 15, src: '/images/mariage/A4 (3).webp', title: '', category: 'Détails', size: 'md' },
    { id: 16, src: '/images/mariage/Mariage Vero-24.webp', title: '', category: '', size: 'md' },
    { id: 17, src: '/images/mariage/MC (3).webp', title: '', category: '', size: 'lg' },
    { id: 18, src: '/images/mariage/MC (5).webp', title: '', category: '', size: 'md' },
    { id: 19, src: '/images/mariage/Mariage Vero-17.webp', title: '', category: '', size: 'md' },
];
const lightboxPhotos = [
    ...weddingMoments.map(p => ({
        src: p.src,
        title: p.label,
        category: 'Mariage'
    })),
    ...weddingGridPhotos.map(p => ({
        src: p.src,
        title: p.title,
        category: p.category
    }))
];

// Spacer en haut de chaque colonne pour créer le décalage
// Les images gardent leur taille naturelle, zéro espace blanc entre elles
const colSpacers = [0, 64, 32, 96]; // px

export default function ContentWeddingGallery() {

    const ref = useRef(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const dragX = useMotionValue(0);
    const springX = useSpring(dragX, { stiffness: 120, damping: 20 });

    const [maxDrag, setMaxDrag] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const scrollWidth = containerRef.current.scrollWidth;
        const clientWidth = containerRef.current.clientWidth;

        setMaxDrag(scrollWidth - clientWidth);
    }, []);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const next = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex + 1) % lightboxPhotos.length);
    };

    const prev = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length);
    };

    const columns: typeof weddingGridPhotos[] = [[], [], [], []];
    weddingGridPhotos.forEach((photo, i) => {
        columns[i % 4].push(photo);
    });

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
                className="relative flex items-center z-10 space-x-8 overflow-x-auto overflow-y-hidden touch-pan-x scrollbar-hidden"
            >
                {weddingMoments.map((item, index) => {
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

            {/* GRID SECONDARY */}
            <div className="container mx-auto">

                <div className="hidden lg:flex gap-0 items-start">
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-0">

                            {/* Spacer invisible — crée le décalage sans espace entre les images */}
                            {colSpacers[colIndex] > 0 && (
                                <div style={{ height: colSpacers[colIndex] }} aria-hidden="true" />
                            )}

                            {col.map((photo) => {
                                const index = weddingGridPhotos.findIndex((p) => p.id === photo.id);
                                return (
                                    <GalleryItem
                                        key={photo.id}
                                        event={photo}
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
                    {weddingGridPhotos.map((event, index) => (
                        <GalleryItem
                            key={event.id}
                            event={event}
                            delay={index * 0.05}
                            index={index}
                            setOpenIndex={setOpenIndex}
                        />
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
function GalleryItem({
    event,
    delay,
    index,
    setOpenIndex,
}: {
    event: { src: string; title: string; category: string };
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
                src={event.src}
                alt="gallery image"
                width={1000}
                height={1500}
                className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
        </motion.div>
    );
}