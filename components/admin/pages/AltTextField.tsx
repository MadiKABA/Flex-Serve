'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type SaveResult = { success: true } | { success: false; error: string };

/** Champ compact d'édition du alt_text, réutilisé par les éditeurs d'image à emplacement fixe (hero, CTA, service). */
export default function AltTextField({
    initialValue,
    onSave,
}: {
    initialValue: string | null;
    onSave: (value: string) => Promise<SaveResult>;
}) {
    const [value, setValue] = useState(initialValue ?? '');
    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        startTransition(async () => {
            const result = await onSave(value);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Texte alternatif enregistré.');
        });
    };

    return (
        <div className="flex gap-1">
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Texte alternatif"
                className="h-7 px-2 text-xs"
            />
            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={isPending}
                className="h-7 px-2 text-xs"
            >
                OK
            </Button>
        </div>
    );
}
