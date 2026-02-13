'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, ChevronRight, ChevronLeft, MapPin, User, AlertCircle, Star } from 'lucide-react';

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- Types ---
type PrestationType = 'photo' | 'video' | null;

interface BookingData {
    prestationType: PrestationType;
    category: string;
    quantity: number;
    nom: string;
    telephone: string;
    adresse: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    lieuType: 'plein-air' | 'studio' | 'domicile' | null;
}

export default function BookingWizard() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BookingData>({
        prestationType: null,
        category: '',
        quantity: 0,
        nom: '',
        telephone: '',
        adresse: '',
        date: '',
        heureDebut: '',
        heureFin: '',
        lieuType: null,
    });

    const totalSteps = 7;
    const progress = (step / totalSteps) * 100;

    // --- LOGIQUE DE NAVIGATION CORRIGÉE ---
    const updateDataAndNext = (field: keyof BookingData, value: any) => {
        setError(null);
        setData(prev => {
            const newData = { ...prev, [field]: value };

            // Si on change de prestationType, on réinitialise la catégorie et la quantité
            if (field === 'prestationType') {
                newData.category = '';
                newData.quantity = 0;
            }
            // Si on change de catégorie, on réinitialise la quantité
            if (field === 'category') {
                newData.quantity = 0;
            }

            return newData;
        });
        setStep(prev => prev + 1); // Passe à l'étape suivante immédiatement après le clic
    };

    const updateData = (field: keyof BookingData, value: any) => {
        setError(null);
        setData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = () => {
        if (step === 4 && (!data.nom || !data.telephone || !data.adresse)) return "Veuillez remplir tous les champs personnels.";
        if (step === 5 && (!data.date || !data.heureDebut || !data.heureFin)) return "Veuillez renseigner la date et les horaires.";
        return null;
    };

    const handleNext = () => {
        const err = validateStep();
        if (err) {
            setError(err);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setError(null);
        setStep(prev => Math.max(prev - 1, 1));
    };

    // --- LOGIQUE DYNAMIQUE DES OPTIONS ---
    const categories = data.prestationType === 'photo'
        ? ['Portrait', 'Mariage', 'Événement', 'Publicité']
        : ['Clip Vidéo', 'Aftermovie', 'Interview', 'Publicité TV'];

    const getQuantities = () => {
        if (data.prestationType === 'video') return [1, 3, 5, 10, 15, 30, 60];
        if (data.category === 'Mariage') return [100, 200, 300, 400, 500, 600];
        if (data.category === 'Portrait') return [10, 20, 30, 50];
        return [10, 30, 50, 100, 200, 400, 600];
    };
    const sendToWhatsApp = () => {
        // Numéro de destination (avec indicatif pays 221 pour le Sénégal)
        const phoneNumber = "221710360534";

        // Construction du message avec formatage WhatsApp (astérisques pour le gras)
        const message = [
            "📸 NOUVELLE RÉSERVATION",
            "------------------------------",
            `Service: ${data.prestationType?.toUpperCase()}`,
            `Catégorie: ${data.category}`,
            `Volume: ${data.quantity} ${data.prestationType === 'photo' ? 'Photos' : 'Minutes'}`,
            "",
            "DÉTAILS",
            `Date: ${data.date}`,
            `Horaires: ${data.heureDebut} - ${data.heureFin}`,
            `Type de lieu: ${data.lieuType}`,
            `Adresse: ${data.adresse}`,
            "",
            "👤 CLIENT",
            `Nom: ${data.nom}`,
            `Téléphone: ${data.telephone}`,
            "------------------------------"
        ].join("\n");

        // Encodage du message pour l'URL
        const encodedMessage = encodeURIComponent(message);

        // Construction du lien final
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Ouverture dans un nouvel onglet
        window.open(whatsappUrl, '_blank');
    };
    return (
        <section className="relative min-h-screen py-12 bg-[#2E4A6F] text-white overflow-hidden font-sans">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[12rem] md:text-[18rem] font-bold opacity-[0.03] select-none pointer-events-none">BOOKING</div>

            <div className="container max-w-3xl mx-auto px-6 relative z-10">
                {/* Progress & Error */}
                <div className="mb-12 space-y-4">
                    <Progress value={progress} className="h-1 bg-white/10" />
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <Alert variant="destructive" className="bg-red-500/20 border-red-500 text-white">
                                <AlertCircle className="h-4 w-4 stroke-white" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                </div>

                <div className="min-h-[450px]">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: PHOTO OU VIDEO */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <h2 className="text-4xl font-light text-center">Quel est votre projet ?</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { id: 'photo' as const, label: 'Photographie', icon: Camera },
                                        { id: 'video' as const, label: 'Vidéographie', icon: Video }
                                    ].map((item) => (
                                        <Card key={item.id}
                                            onClick={() => updateDataAndNext('prestationType', item.id)}
                                            className={`cursor-pointer transition-all border-2 ${data.prestationType === item.id ? 'bg-white text-[#2E4A6F] border-white' : 'bg-white/5 text-white border-white/10 hover:border-white/40'}`}>
                                            <CardContent className="p-8 flex flex-col items-center gap-4">
                                                <item.icon className="w-12 h-12" />
                                                <span className="text-xl font-medium">{item.label}</span>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: CATEGORIES */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h2 className="text-3xl font-light text-center uppercase tracking-widest">Catégorie</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {categories.map((cat) => (
                                        <div key={cat} onClick={() => updateDataAndNext('category', cat)}
                                            className={`p-6 rounded-xl border-2 text-center cursor-pointer transition-all ${data.category === cat ? 'bg-white text-[#2E4A6F]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: QUANTITÉ DYNAMIQUE */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h2 className="text-3xl font-light text-center">
                                    {data.prestationType === 'photo' ? 'Nombre de photos' : 'Durée de la vidéo'}
                                </h2>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {getQuantities().map((q) => (
                                        <div key={q} onClick={() => updateDataAndNext('quantity', q)}
                                            className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all ${data.quantity === q ? 'bg-white text-[#2E4A6F]' : 'bg-white/5 border-white/10'}`}>
                                            <span className="text-xl font-bold">{q}</span>
                                            <span className="text-xs block opacity-60">{data.prestationType === 'photo' ? 'Photos' : 'Min'}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: INFOS PERSONNELLES */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h2 className="text-3xl font-light text-center">Vos Informations</h2>
                                <div className="space-y-4">
                                    <div className="grid gap-2"><Label>Nom Complet</Label><Input value={data.nom} onChange={(e) => updateData('nom', e.target.value)} className="bg-white/5 border-white/20" /></div>
                                    <div className="grid gap-2"><Label>Téléphone</Label><Input value={data.telephone} onChange={(e) => updateData('telephone', e.target.value)} className="bg-white/5 border-white/20" /></div>
                                    <div className="grid gap-2"><Label>Adresse du shooting</Label><Input value={data.adresse} onChange={(e) => updateData('adresse', e.target.value)} className="bg-white/5 border-white/20" /></div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: DATE & HEURES */}
                        {step === 5 && (
                            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
                                <h2 className="text-3xl font-light">Date & Horaires</h2>
                                <div className="grid gap-4 max-w-xs mx-auto">
                                    <div className="grid text-left gap-2"><Label>Date</Label><Input type="date" value={data.date} onChange={(e) => updateData('date', e.target.value)} className="bg-white/5 border-white/20 text-white invert" /></div>
                                    <div className="flex gap-4">
                                        <div className="grid text-left gap-2 flex-1"><Label>Début</Label><Input type="time" value={data.heureDebut} onChange={(e) => updateData('heureDebut', e.target.value)} className="bg-white/5 border-white/20 invert" /></div>
                                        <div className="grid text-left gap-2 flex-1"><Label>Fin</Label><Input type="time" value={data.heureFin} onChange={(e) => updateData('heureFin', e.target.value)} className="bg-white/5 border-white/20 invert" /></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 6: LIEU */}
                        {step === 6 && (
                            <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <h2 className="text-3xl font-light text-center">Type de lieu</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'plein-air' as const, label: 'Plein Air', icon: MapPin },
                                        { id: 'studio' as const, label: 'Studio', icon: Star },
                                        { id: 'domicile' as const, label: 'À Domicile', icon: User }
                                    ].map((l) => (
                                        <div key={l.id} onClick={() => updateDataAndNext('lieuType', l.id)}
                                            className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 cursor-pointer transition-all ${data.lieuType === l.id ? 'bg-white text-[#2E4A6F]' : 'bg-white/5 border-white/10'}`}>
                                            <l.icon className="w-8 h-8" />
                                            <span className="text-sm font-medium">{l.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 7: RECAPITULATIF */}
                        {step === 7 && (
                            <motion.div key="s7" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
                                    <h2 className="text-3xl font-light border-b border-white/10 pb-4">Résumé</h2>
                                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                                        <span className="opacity-60">Prestation</span><span className="font-bold capitalize">{data.prestationType} ({data.category})</span>
                                        <span className="opacity-60">Volume</span><span className="font-bold">{data.quantity} {data.prestationType === 'photo' ? 'Photos' : 'Minutes'}</span>
                                        <span className="opacity-60">Date</span><span className="font-bold">{data.date}</span>
                                        <span className="opacity-60">Horaires</span><span className="font-bold">{data.heureDebut} - {data.heureFin}</span>
                                        <span className="opacity-60">Lieu</span><span className="font-bold capitalize">{data.lieuType}</span>
                                        <span className="opacity-60">Client</span><span className="font-bold">{data.nom}</span>
                                        <span className="opacity-60">Téléphone</span>
                                        <span className="font-bold">{data.telephone}</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={sendToWhatsApp}
                                    className="w-full h-16 bg-white text-[#2E4A6F] text-xl font-bold hover:bg-white/90 shadow-xl"
                                >
                                    Confirmer via WhatsApp
                                </Button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-12 flex justify-between">
                    {step > 1 && (
                        <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                            <ChevronLeft className="mr-2" /> Retour
                        </Button>
                    )}
                    <div className="flex-1" />
                    {(step === 4 || step === 5) && (
                        <Button onClick={handleNext} className="bg-white text-[#2E4A6F] hover:bg-white/90">
                            Suivant <ChevronRight className="ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}