'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { updateHeroBackground } from '@/app/admin/(dashboard)/pages/actions';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { compressImage, exceedsCloudinaryLimit } from '@/lib/utils/compress-image';
import type { MediaItem } from '@/lib/types/content';

const TOO_LARGE_MESSAGE =
    'Cette image est trop volumineuse même après compression. Essayez une résolution plus basse ou un autre fichier.';

interface PendingImage {
    file: File;
    previewUrl?: string;
    status: 'compressing' | 'pending' | 'uploading' | 'error' | 'too-large';
    error?: string;
}

/**
 * Image de fond d'un hero (sections.background_media_id) — pour toute
 * section type='hero' hors accueil (qui garde ses 3 images fixes via
 * HeroThreeImages). Remplacement direct : upload + confirmation, puis
 * l'ancienne image est supprimée (Cloudinary puis ligne) une fois le
 * nouveau lien confirmé en base.
 */
export default function HeroBackgroundImage({
    sectionId,
    dbSlug,
    uploadFolder,
    current,
}: {
    sectionId: string;
    dbSlug: string;
    uploadFolder: string;
    current: MediaItem | null;
}) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pending, setPending] = useState<PendingImage | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setPending({ file, status: 'compressing' });
        const compressed = await compressImage(file);

        if (exceedsCloudinaryLimit(compressed)) {
            setPending({ file: compressed, status: 'too-large', error: TOO_LARGE_MESSAGE });
            return;
        }

        setPending({ file: compressed, previewUrl: URL.createObjectURL(compressed), status: 'pending' });
    };

    const cancelPending = () => {
        if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl);
        setPending(null);
    };

    const confirm = async () => {
        if (!pending || (pending.status !== 'pending' && pending.status !== 'error')) return;
        setIsConfirming(true);
        setPending((prev) => (prev ? { ...prev, status: 'uploading', error: undefined } : prev));

        try {
            const { publicId, url } = await uploadToCloudinary(pending.file, uploadFolder);
            const result = await updateHeroBackground({
                sectionId,
                dbSlug,
                publicId,
                url,
                previousMediaId: current?.id ?? null,
                previousPublicId: current?.cloudinary_public_id ?? null,
            });
            if (!result.success) throw new Error(result.error);

            if (pending.previewUrl) URL.revokeObjectURL(pending.previewUrl);
            setPending(null);
            toast.success('Image de fond mise à jour.');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Échec de l'upload.";
            setPending((prev) => (prev ? { ...prev, status: 'error', error: message } : prev));
            toast.error(message);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="space-y-2">
            {!pending && (
                <div className="group relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-border bg-[#F5F2E8]/40">
                    {current ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={current.cloudinary_url} alt={current.alt_text ?? ''} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Aucune image de fond
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 text-transparent transition-all group-hover:bg-black/50 group-hover:text-white"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="text-xs font-medium">{current ? 'Remplacer' : 'Ajouter une image'}</span>
                    </button>
                </div>
            )}

            {pending && (
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-[#2E4A6F]/40 bg-[#2E4A6F]/5">
                    {pending.previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pending.previewUrl} alt="" className="h-full w-full object-cover opacity-80" />
                    )}
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-[#2E4A6F] px-2 py-0.5 text-[10px] font-medium text-white">
                        {pending.status === 'compressing' ? 'Compression...' : 'À confirmer'}
                    </span>
                    {(pending.status === 'compressing' || pending.status === 'uploading') && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                    )}
                    {(pending.status === 'pending' || pending.status === 'error') && (
                        <div className="absolute inset-x-0 bottom-0 flex gap-1 p-1.5">
                            <button
                                type="button"
                                onClick={confirm}
                                disabled={isConfirming}
                                className="flex-1 rounded bg-[#3d5a7a] py-1 text-[11px] font-medium text-white hover:bg-[#2d4a6a]"
                            >
                                Confirmer
                            </button>
                            <button
                                type="button"
                                onClick={cancelPending}
                                className="rounded bg-white/90 px-2 py-1 text-[11px] text-[#2E4A6F]"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                    {pending.status === 'too-large' && (
                        <div className="absolute inset-x-0 bottom-0 p-1.5">
                            <button
                                type="button"
                                onClick={cancelPending}
                                className="w-full rounded bg-white/90 py-1 text-[11px] text-[#2E4A6F]"
                            >
                                Retirer
                            </button>
                        </div>
                    )}
                    {(pending.status === 'error' || pending.status === 'too-large') && (
                        <div className="absolute inset-x-0 top-6 bg-destructive/90 px-2 py-1 text-[10px] text-white">
                            {pending.error}
                        </div>
                    )}
                </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSelect} />
        </div>
    );
}
