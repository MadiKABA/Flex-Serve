'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="relative min-h-screen bg-[#2E4A6F] flex items-center justify-center overflow-hidden font-sans">
            {/* Background Branding (Comme sur ton booking) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-bold opacity-[0.03] select-none pointer-events-none">
                404
            </div>

            <div className="container relative z-10 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Icône Stylisée */}
                    <div className="relative inline-block">
                        <Camera className="w-24 h-24 text-white/20 mx-auto" strokeWidth={1} />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                        >
                            OUT OF FOCUS
                        </motion.div>
                    </div>

                    {/* Texte principal */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
                            CADRAGE <span className="font-bold italic text-white/40">PERDU</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 max-w-md mx-auto font-light">
                            Désolé, cette page est restée dans la chambre noire. Elle n'a pas été développée ou a été déplacée.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/">
                            <Button className="bg-white text-[#2E4A6F] hover:bg-white/90 h-14 px-8 text-lg font-bold transition-transform hover:scale-105">
                                <Home className="mr-2 h-5 w-5" /> Retour à l'accueil
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg font-light"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" /> Page précédente
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Décoration : Grain de film ou flashs */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        </main>
    );
}