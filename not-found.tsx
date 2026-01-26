import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-4xl font-bold text-[#3d5a7a] mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page non trouvée</p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#3d5a7a] text-white rounded-lg hover:bg-[#2d4a6a] transition-colors"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
}