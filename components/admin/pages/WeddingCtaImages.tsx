'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { confirmHeroImage, deleteMediaItem } from '@/app/admin/(dashboard)/pages/actions';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import { compressImage, exceedsCloudinaryLimit } from '@/lib/utils/compress-image';
import type { MediaItem } from '@/lib/types/content';

const SLOT_LABELS = ['Image 1', 'Image 2'] as const;
const TOO_LARGE_MESSAGE =
    'Cette image est trop volumineuse même après compression. Essayez une résolution plus basse ou un autre fichier.';

interface PendingSlot {
    file: File;
    previewUrl?: string;
    status: 'compressing' | 'pending' | 'uploading' | 'error' | 'too-large';
    error?: string;
}

/**
 * Les 2 images de composition de WeddingCTA (section type='cta', accueil
 * position 3) — mêmes 2 emplacements fixes que ServiceTwoImages, mais
 * réutilise confirmHeroImage/deleteMediaItem (déjà scoped par section_id)
 * avec maxImages=2 plutôt que des actions dédiées.
 */
export default function WeddingCtaImages({
    sectionId,
    dbSlug,
    uploadFolder,
    media,
}: {
    sectionId: string;
    dbSlug: string;
    uploadFolder: string;
    media: MediaItem[];
}) {
    const router = useRouter();
    const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const [pending, setPending] = useState<Partial<Record<0 | 1, PendingSlot>>>({});
    const [busySlot, setBusySlot] = useState<number | null>(null);

    const byPosition = (position: number) => media.find((m) => m.position === position);

    const handleSelect = async (position: 0 | 1, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setPending((prev) => ({ ...prev, [position]: { file, status: 'compressing' } }));

        const compressed = await compressImage(file);

        if (exceedsCloudinaryLimit(compressed)) {
            setPending((prev) => ({
                ...prev,
                [position]: { file: compressed, status: 'too-large', error: TOO_LARGE_MESSAGE },
            }));
            return;
        }

        setPending((prev) => ({
            ...prev,
            [position]: { file: compressed, previewUrl: URL.createObjectURL(compressed), status: 'pending' },
        }));
    };

    const cancelPending = (position: 0 | 1) => {
        setPending((prev) => {
            const slot = prev[position];
            if (slot?.previewUrl) URL.revokeObjectURL(slot.previewUrl);
            const next = { ...prev };
            delete next[position];
            return next;
        });
    };

    const confirmSlot = async (position: 0 | 1) => {
        const slot = pending[position];
        if (!slot || slot.status === 'compressing' || slot.status === 'too-large') return;

        setPending((prev) => ({ ...prev, [position]: { ...slot, status: 'uploading', error: undefined } }));

        try {
            const { publicId, url } = await uploadToCloudinary(slot.file, uploadFolder);
            const result = await confirmHeroImage({ sectionId, dbSlug, position, publicId, url, maxImages: 2 });
            if (!result.success) throw new Error(result.error);

            if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
            setPending((prev) => {
                const next = { ...prev };
                delete next[position];
                return next;
            });
            toast.success('Image ajoutée.');
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Échec de l'upload.";
            setPending((prev) => ({ ...prev, [position]: { ...slot, status: 'error', error: message } }));
            toast.error(message);
        }
    };

    const handleDelete = async (position: number, mediaId: string, publicId: string) => {
        setBusySlot(position);
        const result = await deleteMediaItem(mediaId, publicId, dbSlug);
        setBusySlot(null);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success('Image supprimée.');
        router.refresh();
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {([0, 1] as const).map((position) => {
                const existing = byPosition(position);
                const pendingSlot = pending[position];

                return (
                    <div key={position} className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">{SLOT_LABELS[position]}</p>

                        {existing && !pendingSlot && (
                            <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={existing.cloudinary_url} alt={existing.alt_text ?? ''} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleDelete(position, existing.id, existing.cloudinary_public_id)}
                                    disabled={busySlot === position}
                                    className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                    aria-label="Supprimer"
                                >
                                    {busySlot === position ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        )}

                        {!existing && !pendingSlot && (
                            <button
                                type="button"
                                onClick={() => fileInputRefs[position].current?.click()}
                                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#2E4A6F]/25 text-[#2E4A6F]/60 transition-colors hover:border-[#2E4A6F]/50 hover:text-[#2E4A6F]"
                            >
                                <Plus className="h-6 w-6" />
                                <span className="text-xs">Ajouter {SLOT_LABELS[position].toLowerCase()}</span>
                            </button>
                        )}

                        {pendingSlot && (
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-dashed border-[#2E4A6F]/40 bg-[#2E4A6F]/5">
                                {pendingSlot.previewUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={pendingSlot.previewUrl} alt="" className="h-full w-full object-cover opacity-80" />
                                )}
                                <span className="absolute left-1.5 top-1.5 rounded-full bg-[#2E4A6F] px-2 py-0.5 text-[10px] font-medium text-white">
                                    {pendingSlot.status === 'compressing' ? 'Compression...' : 'À confirmer'}
                                </span>
                                {(pendingSlot.status === 'compressing' || pendingSlot.status === 'uploading') && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    </div>
                                )}
                                {(pendingSlot.status === 'pending' || pendingSlot.status === 'error') && (
                                    <div className="absolute inset-x-0 bottom-0 flex gap-1 p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => confirmSlot(position)}
                                            className="flex-1 rounded bg-[#3d5a7a] py-1 text-[11px] font-medium text-white hover:bg-[#2d4a6a]"
                                        >
                                            Confirmer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => cancelPending(position)}
                                            className="rounded bg-white/90 px-2 py-1 text-[11px] text-[#2E4A6F]"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                )}
                                {pendingSlot.status === 'too-large' && (
                                    <div className="absolute inset-x-0 bottom-0 p-1.5">
                                        <button
                                            type="button"
                                            onClick={() => cancelPending(position)}
                                            className="w-full rounded bg-white/90 py-1 text-[11px] text-[#2E4A6F]"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                )}
                                {(pendingSlot.status === 'error' || pendingSlot.status === 'too-large') && (
                                    <div className="absolute inset-x-0 top-6 bg-destructive/90 px-2 py-1 text-[10px] text-white">
                                        {pendingSlot.error}
                                    </div>
                                )}
                            </div>
                        )}

                        <input
                            ref={fileInputRefs[position]}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSelect(position, e)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
