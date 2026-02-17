'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type Photo = {
    src: string
    title?: string
    category?: string
}

export default function Lightbox({
    photos,
    index,
    onClose,
    onNext,
    onPrev,
}: {
    photos: Photo[]
    index: number
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}) {
    const photo = photos[index]

    // ESC + flèches clavier
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') onNext()
            if (e.key === 'ArrowLeft') onPrev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [index])

    // bloque scroll body
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    return (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">

            {/* close */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white hover:scale-110 transition"
            >
                <X size={34} />
            </button>

            {/* left */}
            <button
                onClick={onPrev}
                className="absolute left-4 md:left-10 text-white p-3 rounded-full bg-white/10 hover:bg-white/20"
            >
                <ChevronLeft size={40} />
            </button>

            {/* image */}
            <div className="relative w-[95vw] h-[85vh] max-w-6xl">
                <Image
                    src={photo.src}
                    alt={photo.title || 'photo'}
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* right */}
            <button
                onClick={onNext}
                className="absolute right-4 md:right-10 text-white p-3 rounded-full bg-white/10 hover:bg-white/20"
            >
                <ChevronRight size={40} />
            </button>

            {/* caption */}
            {(photo.title || photo.category) && (
                <div className="absolute bottom-10 text-center text-white">
                    <p className="text-xs tracking-widest uppercase opacity-70">
                        {photo.category}
                    </p>
                    <h3 className="text-xl font-semibold">{photo.title}</h3>
                </div>
            )}
        </div>
    )
}