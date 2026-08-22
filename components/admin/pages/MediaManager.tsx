'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import {
    confirmMediaUpload,
    deleteMediaItem,
    moveMediaItem,
    updateMediaMeta,
} from '@/app/admin/(dashboard)/pages/actions';
import type { MediaItem, PortfolioCategory } from '@/lib/types/content';

interface PendingFile {
    id: string;
    file: File;
    previewUrl: string;
    status: 'pending' | 'uploading' | 'error';
    error?: string;
}

export default function MediaManager({
    sectionId,
    dbSlug,
    category,
    uploadFolder,
    media,
}: {
    sectionId: string;
    dbSlug: string;
    category: PortfolioCategory | null;
    uploadFolder: string;
    media: MediaItem[];
}) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [busyMediaId, setBusyMediaId] = useState<string | null>(null);

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const next: PendingFile[] = files.map((file) => ({
            id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
            file,
            previewUrl: URL.createObjectURL(file),
            status: 'pending',
        }));
        setPendingFiles((prev) => [...prev, ...next]);
        e.target.value = '';
    };

    const removePending = (id: string) => {
        setPendingFiles((prev) => {
            const target = prev.find((p) => p.id === id);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((p) => p.id !== id);
        });
    };

    const confirmAll = async () => {
        const toUpload = pendingFiles.filter((p) => p.status !== 'uploading');

        for (const item of toUpload) {
            setPendingFiles((prev) =>
                prev.map((p) => (p.id === item.id ? { ...p, status: 'uploading', error: undefined } : p))
            );

            try {
                const { publicId, url } = await uploadToCloudinary(item.file, uploadFolder);
                const result = await confirmMediaUpload({ sectionId, dbSlug, category, publicId, url });
                if (!result.success) throw new Error(result.error);

                URL.revokeObjectURL(item.previewUrl);
                setPendingFiles((prev) => prev.filter((p) => p.id !== item.id));
                toast.success(`"${item.file.name}" ajoutée.`);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Échec de l'upload.";
                setPendingFiles((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: 'error', error: message } : p)));
                toast.error(`"${item.file.name}" : ${message}`);
            }
        }

        router.refresh();
    };

    const handleDelete = async (mediaId: string, publicId: string) => {
        setBusyMediaId(mediaId);
        const result = await deleteMediaItem(mediaId, publicId, dbSlug);
        setBusyMediaId(null);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success('Photo supprimée.');
        router.refresh();
    };

    const handleMove = async (mediaId: string, direction: 'up' | 'down') => {
        setBusyMediaId(mediaId);
        const result = await moveMediaItem(mediaId, direction, dbSlug);
        setBusyMediaId(null);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {media.map((item, index) => (
                    <MediaCard
                        key={item.id}
                        item={item}
                        dbSlug={dbSlug}
                        isFirst={index === 0}
                        isLast={index === media.length - 1}
                        busy={busyMediaId === item.id}
                        onDelete={() => handleDelete(item.id, item.cloudinary_public_id)}
                        onMoveUp={() => handleMove(item.id, 'up')}
                        onMoveDown={() => handleMove(item.id, 'down')}
                    />
                ))}

                {pendingFiles.map((pending) => (
                    <div
                        key={pending.id}
                        className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-[#2E4A6F]/40 bg-[#2E4A6F]/5"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pending.previewUrl} alt="" className="h-full w-full object-cover opacity-80" />
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-[#2E4A6F] px-2 py-0.5 text-[10px] font-medium text-white">
                            À confirmer
                        </span>
                        {pending.status !== 'uploading' && (
                            <button
                                type="button"
                                onClick={() => removePending(pending.id)}
                                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                                aria-label="Retirer"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                        {pending.status === 'uploading' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                        )}
                        {pending.status === 'error' && (
                            <div className="absolute inset-x-0 bottom-0 bg-destructive/90 px-2 py-1 text-[10px] text-white">
                                {pending.error}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFilesSelected}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Ajouter des photos
                </Button>
                {pendingFiles.length > 0 && (
                    <Button
                        type="button"
                        size="sm"
                        onClick={confirmAll}
                        disabled={pendingFiles.every((p) => p.status === 'uploading')}
                        className="gap-2 bg-[#3d5a7a] text-white hover:bg-[#2d4a6a]"
                    >
                        Confirmer l&apos;ajout ({pendingFiles.length})
                    </Button>
                )}
            </div>
        </div>
    );
}

function MediaCard({
    item,
    dbSlug,
    isFirst,
    isLast,
    busy,
    onDelete,
    onMoveUp,
    onMoveDown,
}: {
    item: MediaItem;
    dbSlug: string;
    isFirst: boolean;
    isLast: boolean;
    busy: boolean;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const router = useRouter();
    const [altText, setAltText] = useState(item.alt_text ?? '');
    const [title, setTitle] = useState(item.title ?? '');
    const [isPending, startTransition] = useTransition();

    const handleSaveMeta = () => {
        startTransition(async () => {
            const result = await updateMediaMeta(item.id, dbSlug, { alt_text: altText, title });
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Légende enregistrée.');
            router.refresh();
        });
    };

    return (
        <div className="space-y-1.5">
            <div className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-[#F5F2E8]/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.cloudinary_url} alt={item.alt_text ?? ''} className="h-full w-full object-cover" />
                {busy && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                )}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-1 bg-gradient-to-b from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={onMoveUp}
                            disabled={isFirst || busy}
                            className="rounded bg-white/90 p-1 text-[#2E4A6F] disabled:opacity-30"
                            aria-label="Monter"
                        >
                            <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={onMoveDown}
                            disabled={isLast || busy}
                            className="rounded bg-white/90 p-1 text-[#2E4A6F] disabled:opacity-30"
                            aria-label="Descendre"
                        >
                            <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={busy}
                        className="rounded bg-white/90 p-1 text-destructive"
                        aria-label="Supprimer"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" className="h-7 px-2 text-xs" />
            <div className="flex gap-1">
                <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Texte alternatif"
                    className="h-7 px-2 text-xs"
                />
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSaveMeta}
                    disabled={isPending}
                    className="h-7 px-2 text-xs"
                >
                    OK
                </Button>
            </div>
        </div>
    );
}
