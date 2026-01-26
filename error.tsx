'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h2 className="text-2xl font-bold text-[#3d5a7a] mb-4">
                Une erreur est survenue
            </h2>
            <button
                onClick={reset}
                className="px-6 py-3 bg-[#3d5a7a] text-white rounded-lg hover:bg-[#2d4a6a] transition-colors"
            >
                Réessayer
            </button>
        </div>
    );
}
