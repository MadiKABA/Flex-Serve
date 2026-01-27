'use client';

import { motion } from 'framer-motion';

const partners = [
    { name: "Brand One", logo: "BRAND 01" },
    { name: "Brand Two", logo: "BRAND 02" },
    { name: "Brand Three", logo: "BRAND 03" },
    { name: "Brand Four", logo: "BRAND 04" },
    { name: "Brand Five", logo: "BRAND 05" },
    { name: "Brand Six", logo: "BRAND 06" },
];

export default function PartnersSection() {
    // On double la liste pour créer l'effet de boucle infinie sans saut
    const duplicatedPartners = [...partners, ...partners];

    return (
        <section className="py-20 bg-[#2E4A6F]/90 border-t border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 mb-12">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-[#F5F2E8] text-[10px] uppercase tracking-[0.5em] block text-center"
                >
                    Ils nous font confiance
                </motion.span>
            </div>

            <div className="relative flex">
                {/* Conteneur du défilement infini */}
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                >
                    {duplicatedPartners.map((partner, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center px-12 md:px-20 min-w-[200px] md:min-w-[300px]"
                        >
                            <span className="text-white/20 text-2xl md:text-4xl font-serif italic hover:text-[#F5F2E8]/60 transition-colors duration-500 cursor-default select-none uppercase tracking-tighter">
                                {partner.logo}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Gradients pour masquer les bords et donner un effet de fondu */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#2E4A6F] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#2E4A6F] to-transparent z-10" />
            </div>

            {/* Version alternative : Grille statique pour mobile si nécessaire */}
            {/* Si tu préfères une grille fixe sur mobile, on peut adapter le code */}
        </section>
    );
}