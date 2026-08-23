'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Lightbox from '@/components/gallery/Lightbox';
import { fallbackAlt } from '@/lib/utils/media-alt';
import type { GalleryLayout, MediaItem } from '@/lib/types/content';

const COL_SPACERS = [0, 64, 32, 96];
const ROTATIONS = [
    'rotate-[-3deg]',
    'rotate-[4deg]',
    'rotate-[-2deg]',
    'rotate-[5deg]',
    'rotate-[-4deg]',
    'rotate-[3deg]',
    'rotate-[-5deg]',
    'rotate-[2deg]',
];

export default function GalleryGrid({
    media,
    layout,
    title,
}: {
    media: MediaItem[];
    layout: GalleryLayout;
    title?: string | null;
}) {
    const visibleMedia = media.filter((m) => m.is_visible);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (visibleMedia.length === 0) return null;

    const photosForLightbox = visibleMedia.map((m) => ({
        src: m.cloudinary_url,
        title: m.title ?? '',
        category: m.category ?? '',
    }));

    const next = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex + 1) % photosForLightbox.length);
    };
    const prev = () => {
        if (openIndex === null) return;
        setOpenIndex((openIndex - 1 + photosForLightbox.length) % photosForLightbox.length);
    };

    return (
        <>
            {layout === 'grid' ? (
                <GridLayout media={visibleMedia} setOpenIndex={setOpenIndex} />
            ) : (
                <ScrollLayout media={visibleMedia} layout={layout} title={title} setOpenIndex={setOpenIndex} />
            )}

            {openIndex !== null && (
                <Lightbox
                    photos={photosForLightbox}
                    index={openIndex}
                    onClose={() => setOpenIndex(null)}
                    onNext={next}
                    onPrev={prev}
                />
            )}
        </>
    );
}

function GridLayout({ media, setOpenIndex }: { media: MediaItem[]; setOpenIndex: (i: number) => void }) {
    const columns: MediaItem[][] = [[], [], [], []];
    media.forEach((item, i) => columns[i % 4].push(item));

    return (
        <section className="px-6 py-0">
            <div className="container mx-auto">
                <div className="hidden lg:flex gap-0 items-start">
                    {columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-0">
                            {COL_SPACERS[colIndex] > 0 && (
                                <div style={{ height: COL_SPACERS[colIndex] }} aria-hidden="true" />
                            )}
                            {col.map((item) => {
                                const index = media.findIndex((m) => m.id === item.id);
                                return (
                                    <GridItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        delay={index * 0.05}
                                        setOpenIndex={setOpenIndex}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="lg:hidden columns-1 sm:columns-2 md:columns-3 [column-gap:16px]">
                    {media.map((item, index) => (
                        <GridItem key={item.id} item={item} index={index} delay={index * 0.05} setOpenIndex={setOpenIndex} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GridItem({
    item,
    index,
    delay,
    setOpenIndex,
}: {
    item: MediaItem;
    index: number;
    delay: number;
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
                src={item.cloudinary_url}
                alt={item.alt_text || fallbackAlt(item.category)}
                width={1000}
                height={1500}
                className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
        </motion.div>
    );
}

function ScrollLayout({
    media,
    layout,
    title,
    setOpenIndex,
}: {
    media: MediaItem[];
    layout: GalleryLayout;
    title?: string | null;
    setOpenIndex: (i: number) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const range: [string, string] = layout === 'scroll_rtl' ? ['-60%', '15%'] : ['15%', '-60%'];
    const x = useTransform(scrollYProgress, [0, 1], range);

    return (
        <section className="relative py-24 md:py-40 bg-[#2E4A6F]/90 overflow-hidden" ref={ref}>
            {title && (
                <div className="relative max-w-7xl mx-auto px-6 z-10 mb-16">
                    <h3 className="text-4xl md:text-6xl font-light text-white">{title}</h3>
                </div>
            )}

            <motion.div
                style={{ x }}
                className="relative flex items-center z-10 space-x-8 overflow-x-auto overflow-y-hidden touch-pan-x scrollbar-hidden"
            >
                {media.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.8 }}
                            viewport={{ once: true }}
                            onClick={() => setOpenIndex(index)}
                            className={`relative flex-shrink-0 cursor-pointer ${ROTATIONS[index % ROTATIONS.length]}`}
                            style={{ marginTop: isEven ? '-20px' : '40px', zIndex: isEven ? 20 : 10, minWidth: 220 }}
                        >
                            <div className="relative group">
                                <div className="relative w-[220px] sm:w-[280px] md:w-[360px] aspect-[3/4] bg-white rounded-sm p-2 md:p-3 shadow-[15px_15px_40px_rgba(46,74,111,0.15)] border-3 border-[#2E4A6F]/50">
                                    <div className="relative w-full h-[85%] overflow-hidden">
                                        <Image
                                            src={item.cloudinary_url}
                                            alt={item.alt_text || fallbackAlt(item.category)}
                                            fill
                                            sizes="(max-width: 768px) 220px, 360px"
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="h-[15%] flex flex-col justify-center px-1 md:px-2">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-[#2E4A6F] font-serif italic text-xs sm:text-sm md:text-lg truncate mr-2">
                                                {item.title ?? ''}
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
        </section>
    );
}
