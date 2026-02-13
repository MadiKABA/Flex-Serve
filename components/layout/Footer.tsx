'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, } from 'lucide-react';

export default function Footer() {
    const socialIcons = [
        { icon: <Facebook size={20} />, href: 'https://www.facebook.com/share/1AgBWggXkW/?mibextid=wwXIfr' },
        { icon: <Instagram size={20} />, href: 'https://www.instagram.com/flexserve_studio?igsh=NWx6bXoyYnVzcGtj&utm_source=qr' },
        //{ icon: <Tiktok size={20} />, href: '#' }
    ];

    return (
        <footer className="relative bg-[#2E4A6F] backdrop-blur-lg text-[#EAE7DC] py-16 overflow-hidden">
            <div className="container sm:px-6 lg:px-12 mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* CONTACT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <h4 className="text-xl font-semibold tracking-wider">Contact</h4>
                    <p>Dakar, Sénégal</p>
                    <p>Email : flexserve333@gmail.com</p>
                    <p>Téléphone : +221 71 036 05 34</p>
                </motion.div>

                {/* LIENS RAPIDES */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h4 className="text-xl font-semibold tracking-wider">Liens rapides</h4>
                    <ul className="space-y-2">
                        <li className="hover:text-white transition-colors cursor-pointer">Accueil</li>
                        <li className="hover:text-white transition-colors cursor-pointer">Portfolio</li>
                        <li className="hover:text-white transition-colors cursor-pointer">Services</li>
                        <li className="hover:text-white transition-colors cursor-pointer">À propos</li>
                        <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                    </ul>
                </motion.div>

                {/* RESEAUX SOCIAUX */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="space-y-4"
                >
                    <h4 className="text-xl font-semibold tracking-wider">Suivez-nous</h4>
                    <div className="flex space-x-4 mt-2">
                        {socialIcons.map((item, idx) => (
                            <motion.a
                                key={idx}
                                href={item.href} target='_blank'
                                className="text-[#EAE7DC] hover:text-white transition-colors"
                                whileHover={{ scale: 1.3, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {item.icon}
                            </motion.a>
                        ))}
                    </div>
                    <p className="text-sm mt-4">
                        &copy; {new Date().getFullYear()} L'Agence. Tous droits réservés.
                    </p>
                </motion.div>

            </div>

            {/* PETITS ÉLÉMENTS FLOTTANTS */}
            <motion.div
                className="absolute top-10 left-10 w-6 h-6 bg-[#EAE7DC]/20 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-10 h-10 bg-[#EAE7DC]/15 rounded-full"
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-[#EAE7DC]/10 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            />
        </footer>
    );
}
