'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactContent() {
    return (
        <section className="py-24 bg-[#2E4A6F]/90 backdrop-blur-md relative overflow-hidden">
            {/* Décoration de fond pour accentuer le glass effect */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#F5F2E8]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* GAUCHE : LE FORMULAIRE (Champs Full Border) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 bg-white/5 p-8 md:p-12 rounded-2xl border border-white/10 backdrop-blur-xl shadow-md"
                    >
                        <div className="mb-10">
                            <h2 className="text-3xl text-white font-light mb-2">Envoyez-nous un message</h2>
                            <p className="text-[#F5F2E8]/50 text-sm italic">Nous étudions chaque demande avec précision.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F2E8]/60 ml-1">Nom Complet</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 outline-none focus:border-[#F5F2E8]/40 focus:bg-white/10 text-white transition-all placeholder:text-white/20"
                                        placeholder="Jean Dupont"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F2E8]/60 ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 outline-none focus:border-[#F5F2E8]/40 focus:bg-white/10 text-white transition-all placeholder:text-white/20"
                                        placeholder="jean@exemple.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F2E8]/60 ml-1">Sujet du Projet</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 outline-none focus:border-[#F5F2E8]/40 text-white transition-all appearance-none cursor-pointer">
                                    <option className="bg-[#2E4A6F]">Production Audiovisuelle</option>
                                    <option className="bg-[#2E4A6F]">Série de Portraits</option>
                                    <option className="bg-[#2E4A6F]">Campagne Publicitaire</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#F5F2E8]/60 ml-1">Votre Message</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-5 py-4 outline-none focus:border-[#F5F2E8]/40 focus:bg-white/10 text-white transition-all resize-none placeholder:text-white/20"
                                    placeholder="Décrivez votre vision..."
                                />
                            </div>

                            <button className="w-full group bg-[#F5F2E8] hover:bg-white text-[#2E4A6F] font-bold py-5 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-sm shadow-black/20">
                                <span className="uppercase tracking-widest text-xs">Envoyer la demande</span>
                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>

                    {/* DROITE : COORDONNÉES EN CARD GLASS */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* CARD COORDONNÉES */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-2xl shadow-md relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MapPin size={120} text-white />
                            </div>

                            <h3 className="text-[#F5F2E8] font-serif italic text-3xl mb-10">Studio Infos</h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-white/10 rounded-lg text-[#F5F2E8]"><Phone size={20} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-tighter text-white/40 mb-1">Téléphone</p>
                                        <p className="text-white text-lg font-light">
                                            <a href="tel:++221 710360534">+221 71 036 05 34</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-white/10 rounded-lg text-[#F5F2E8]"><Mail size={20} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-tighter text-white/40 mb-1">Email</p>
                                        <p className="text-white text-lg font-light"><a href="mailto:flexserve333@gmail.com">flexserve330@gmail.com</a></p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-white/10 rounded-lg text-[#F5F2E8]"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-tighter text-white/40 mb-1">Localisation</p>
                                        <p className="text-white text-lg font-light">Dakar, Sénégal <br /> Sacre COeur, VDN</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* CARD RÉSEAUX SOCIAUX (EFFET GLASS) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex justify-around items-center shadow-sm"
                        >
                            {[
                                { icon: <Instagram size={22} />, link: "https://www.instagram.com/flexserve_studio?igsh=NWx6bXoyYnVzcGtj&utm_source=qr" },
                                { icon: <Facebook size={22} />, link: "https://www.facebook.com/share/1AgBWggXkW/?mibextid=wwXIfr" },
                                {
                                    icon: (
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.32c7.87,33.47,31.24,60.58,62.7,74.33A124.2,124.2,0,0,0,448,109.91Z"></path>
                                        </svg>
                                    ),
                                    link: "https://www.tiktok.com/@flexserve_studio?_r=1&_t=ZP-93hPVZObEB5"
                                }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-white/5 hover:bg-[#F5F2E8] hover:text-[#2E4A6F] text-white rounded-full transition-all duration-500 hover:scale-110 border border-white/10 shadow-lg"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}