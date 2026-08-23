'use client';

import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { AboutStat } from '@/lib/types/content';

// Composant pour l'animation du chiffre. "value" est un texte libre venant de
// Supabase (ex: "450+", "08") : on isole préfixe / partie numérique / suffixe
// pour n'animer que le nombre, et on repad les zéros non significatifs
// (ex: "08" reste "08" à l'arrivée, pas "8").
function Counter({ value }: { value: string }) {
    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    const prefix = match ? match[1] : value;
    const digits = match?.[2] ?? '';
    const suffix = match ? match[3] : '';
    const hasNumber = digits.length > 0;
    const numericValue = hasNumber ? parseInt(digits, 10) : 0;
    const padLength = digits.length;

    const count = useMotionValue(0);

    // spring pour un mouvement fluide (pas linéaire)
    const springValue = useSpring(count, { stiffness: 40, damping: 20 });
    const displayValue = useTransform(springValue, (latest) =>
        hasNumber ? String(Math.round(latest)).padStart(padLength, '0') : ''
    );

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && hasNumber) {
            count.set(numericValue);
        }
    }, [isInView, count, numericValue, hasNumber]);

    return (
        <span ref={ref}>
            {prefix}
            {hasNumber && <motion.span>{displayValue}</motion.span>}
            {suffix}
        </span>
    );
}

export default function AboutValuesSection({
    title,
    subtitle,
    body,
    stats,
}: {
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    stats: AboutStat[];
}) {
    const paragraphs = (body ?? '').split(/\n\n+/).filter(Boolean);

    return (
        <section className="relative py-24 md:py-40 bg-[#2E4A6F]/90 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                    {/* CÔTÉ GAUCHE : PHILOSOPHIE D'ENTREPRISE */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="space-y-4">
                            {subtitle && (
                                <span className="text-[#F5F2E8] text-xs uppercase tracking-[0.4em] font-semibold">
                                    {subtitle}
                                </span>
                            )}
                            {title && (
                                <h3 className="text-4xl md:text-6xl font-light text-white leading-[1.1]">
                                    {title}
                                </h3>
                            )}
                        </div>

                        {paragraphs.length > 0 && (
                            <div className="space-y-6 text-white/70 text-lg leading-relaxed max-w-xl">
                                {paragraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        )}

                        {/* Distinction / Accréditation */}
                        <div className="pt-2 flex items-center gap-8">
                            <div className="flex flex-col">
                                <span className="text-white font-serif italic text-2xl">Studio d&apos;Art</span>
                                <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Production Audiovisuelle</span>
                            </div>
                            <div className="w-px h-12 bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-white font-serif italic text-2xl">Expertise</span>
                                <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Haut de Gamme</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* CÔTÉ DROIT : STATS EN CARDS AVEC COMPTEUR */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-sm hover:bg-white/[0.08] transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F5F2E8]/10 rounded-full blur-2xl group-hover:bg-[#F5F2E8]/20 transition-all duration-700" />

                                <div className="relative z-10">
                                    <span className="block text-4xl md:text-6xl font-light text-white mb-4 group-hover:text-[#F5F2E8] transition-all duration-500">
                                        <Counter value={stat.value} />
                                    </span>

                                    <div className="w-12 h-px bg-[#F5F2E8]/30 mb-6 group-hover:w-full transition-all duration-700" />

                                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-1 h-0 bg-[#F5F2E8] group-hover:h-12 transition-all duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}