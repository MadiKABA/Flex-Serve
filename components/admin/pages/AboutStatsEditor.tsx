'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { moveAboutStatPosition, updateAboutStats } from '@/app/admin/(dashboard)/pages/about-actions';
import type { AboutStat } from '@/lib/types/content';

interface Edit {
    label: string;
    value: string;
}

export default function AboutStatsEditor({ stats }: { stats: AboutStat[] }) {
    const router = useRouter();
    // Clé par id (pas par index) pour que les saisies non enregistrées survivent à un réordonnancement.
    const [edits, setEdits] = useState<Record<string, Edit>>({});
    const [isSaving, startSaveTransition] = useTransition();
    const [movingId, setMovingId] = useState<string | null>(null);

    const fieldFor = (stat: AboutStat): Edit => edits[stat.id] ?? { label: stat.label, value: stat.value };

    const handleChange = (stat: AboutStat, field: keyof Edit, next: string) => {
        setEdits((prev) => ({ ...prev, [stat.id]: { ...fieldFor(stat), [field]: next } }));
    };

    const handleSave = () => {
        startSaveTransition(async () => {
            const payload = stats.map((stat) => {
                const field = fieldFor(stat);
                return { id: stat.id, label: field.label, value: field.value };
            });
            const result = await updateAboutStats(payload);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Stats enregistrées.');
            router.refresh();
        });
    };

    const handleMove = (statId: string, direction: 'up' | 'down') => {
        setMovingId(statId);
        moveAboutStatPosition(statId, direction).then((result) => {
            setMovingId(null);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            router.refresh();
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {stats.map((stat, index) => {
                    const field = fieldFor(stat);
                    const isMoving = movingId === stat.id;
                    return (
                        <div key={stat.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                            <div className="flex flex-col gap-1 pt-1">
                                <button
                                    type="button"
                                    onClick={() => handleMove(stat.id, 'up')}
                                    disabled={index === 0 || isMoving}
                                    className="rounded border border-border p-1 text-[#2E4A6F] disabled:opacity-30"
                                    aria-label="Monter"
                                >
                                    {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMove(stat.id, 'down')}
                                    disabled={index === stats.length - 1 || isMoving}
                                    className="rounded border border-border p-1 text-[#2E4A6F] disabled:opacity-30"
                                    aria-label="Descendre"
                                >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="grid flex-1 gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor={`stat-label-${stat.id}`} className="text-xs">
                                        Label
                                    </Label>
                                    <Input
                                        id={`stat-label-${stat.id}`}
                                        value={field.label}
                                        onChange={(e) => handleChange(stat, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor={`stat-value-${stat.id}`} className="text-xs">
                                        Valeur
                                    </Label>
                                    <Input
                                        id={`stat-value-${stat.id}`}
                                        value={field.value}
                                        onChange={(e) => handleChange(stat, 'value', e.target.value)}
                                        placeholder="450+"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 bg-[#3d5a7a] text-white hover:bg-[#2d4a6a]"
            >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Enregistrer
            </Button>
        </div>
    );
}
