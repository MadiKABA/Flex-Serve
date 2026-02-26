'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
    id: number;
    name: string;
    href: string;
    images: [string, string]; // 2 images pour la composition
    description: string;
    tag: string;
}

const services: Service[] = [
    {
        id: 1,
        name: 'Portrait',
        href: '/portfolio/portrait',
        images: ['/images/portrait/B1.webp', '/images/portrait/MS (3).webp'],
        description: 'Des portraits conçus pour révéler votre personnalité avec justesse et élégance. Chaque séance est pensée avec direction artistique et précision afin de produire des images fortes, naturelles et intemporelles.',
        tag: 'Authenticité',
    },
    {
        id: 2,
        name: 'Mariage',
        href: '/portfolio/mariage',
        images: ['/images/mariage/FX_04569.webp', '/images/mariage/11.webp'],
        description: 'Un accompagnement sur mesure pour raconter votre union avec élégance et sensibilité. Du premier regard à la dernière célébration, chaque instant est capturé avec précision afin de créer des souvenirs intemporels.',
        tag: 'Émotions',
    },
    {
        id: 3,
        name: 'Événementiel',
        href: '/portfolio/evenementiel',
        images: ['/images/event/Stefdekarda 3.webp', '/images/event/F1.webp'],
        description: 'Une couverture maîtrisée de vos événements professionnels et privés. Conférences, lancements, cérémonies ou réceptions : chaque moment est capturé avec précision, discrétion et exigence pour en préserver toute l’intensité.',
        tag: 'Professionnel',
    },

    {
        id: 4,
        name: 'Publicité',
        href: '/portfolio/pub',
        images: ['/images/portrait/FX_03581.webp', '/images/portrait/FX_03588.webp'],
        description: 'Des visuels stratégiques conçus pour renforcer l’identité et la présence de votre marque. De la photographie produit aux campagnes créatives, chaque projet est pensé pour maximiser votre impact.',
        tag: 'Impact Visuel',
    },
];

export default function ServicesSection() {
    return (
        <section className="relative py-16 md:py-32 bg-[#2E4A6F]/75 overflow-hidden">
            {/* SERVICES arrière-plan */}
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.04, scale: 1 }}
                className="absolute top-10 md:top-20 right-5 text-[6rem] sm:text-[10rem] md:text-[20rem] font-bold text-white leading-none select-none pointer-events-none z-0"
            >
                SERVICES
            </motion.h2>

            {/* TITRE ÉDITORIAL */}
            <div className="relative max-w-7xl mx-auto px-6 mb-16 md:mb-24 z-10">
                <h3 className="text-4xl md:text-7xl font-light text-white leading-tight">
                    Nos prestations. <br />
                    <span className="italic font-serif">Votre vision.</span>
                </h3>
            </div>

            {/* LISTE DES SERVICES */}
            <div className="relative z-10">
                {services.map((service, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={service.id}
                            className="relative py-12 md:py-24 overflow-hidden"
                        >
                            {/* Décoration de fond (Cercle subtil) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="container mx-auto px-6 md:px-10 relative z-10">
                                <div
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'
                                        }`}
                                >
                                    {/* VISUEL (Composition de 2 images) */}
                                    <div
                                        className={`relative h-[400px] md:h-[600px] ${isEven ? '' : 'lg:col-start-2'
                                            }`}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1 }}
                                            viewport={{ once: true }}
                                            className="absolute left-0 top-0 w-2/3 h-[80%] z-10 shadow-2xl rounded-sm"
                                        >
                                            <Image
                                                src={service.images[0]}
                                                alt={`${service.name} - Image 1`}
                                                fill
                                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-sm"
                                            />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: 40 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 1, delay: 0.3 }}
                                            viewport={{ once: true }}
                                            className="absolute right-0 bottom-0 w-2/3 h-[70%] border-[12px] rounded-sm border-white/10 shadow-2xl"
                                        >
                                            <Image
                                                src={service.images[1]}
                                                alt={`${service.name} - Image 2`}
                                                fill
                                                className="object-cover rounded-sm"
                                            />
                                        </motion.div>

                                        {/* Badge numéro */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: 'spring' }}
                                            viewport={{ once: true }}
                                            className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg z-20"
                                        >
                                            <span className="text-[#2E4A6F] font-bold text-xl md:text-2xl">
                                                0{service.id}
                                            </span>
                                        </motion.div>
                                    </div>

                                    {/* TEXTE & BOUTONS */}
                                    <div
                                        className={`text-white space-y-6 md:space-y-8 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'
                                            }`}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.8 }}
                                            viewport={{ once: true }}
                                        >
                                            <span className="text-xs uppercase tracking-[0.5em] opacity-60">
                                                {service.tag}
                                            </span>
                                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-light mt-4 leading-tight">
                                                {service.name}
                                            </h2>
                                        </motion.div>

                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            viewport={{ once: true }}
                                            className="text-white/70 text-base md:text-lg max-w-md leading-relaxed"
                                        >
                                            {service.description}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            viewport={{ once: true }}
                                            className="flex flex-col sm:flex-row gap-4 pt-4"
                                        >
                                            {/* Bouton Réserver */}
                                            <Link
                                                href="/reservation"
                                                className="group relative px-8 py-4 bg-white text-[#2E4A6F] rounded-sm overflow-hidden transition-all duration-500 hover:pr-12 text-center"
                                            >
                                                <span className="relative z-10 uppercase tracking-widest text-sm font-semibold">
                                                    Réserver
                                                </span>
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-6 transition-all duration-500">
                                                    →
                                                </span>
                                            </Link>

                                            {/* Bouton Portfolio */}
                                            <Link
                                                href={service.href}
                                                className="group px-8 py-4 border-2 border-white/30 text-white rounded-sm uppercase tracking-widest text-sm font-semibold hover:border-white hover:bg-white/10 transition-all duration-300 text-center"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    Portfolio
                                                    <svg
                                                        className="w-4 h-4 transition-transform group-hover:scale-110"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}