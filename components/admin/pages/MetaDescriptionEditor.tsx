'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updatePageMetaDescription } from '@/app/admin/(dashboard)/pages/actions';

const MAX_LENGTH = 300;

export default function MetaDescriptionEditor({
    pageId,
    dbSlug,
    initialValue,
}: {
    pageId: string;
    dbSlug: string;
    initialValue: string | null;
}) {
    const [value, setValue] = useState(initialValue ?? '');
    const [isPending, startTransition] = useTransition();

    const handleSave = () => {
        startTransition(async () => {
            const result = await updatePageMetaDescription(pageId, dbSlug, value);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Description SEO enregistrée.');
        });
    };

    return (
        <div className="space-y-2 rounded-xl border border-border bg-white p-6">
            <Label htmlFor="meta-description">
                Description SEO <span className="font-normal text-muted-foreground">(balise meta description)</span>
            </Label>
            <p className="text-xs text-muted-foreground">
                Affichée dans les résultats de recherche sous le titre de la page. Laisser vide pour utiliser la
                description par défaut de cette page.
            </p>
            <Textarea
                id="meta-description"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={MAX_LENGTH}
                rows={3}
                placeholder="Résumé de la page pour les moteurs de recherche (150-160 caractères recommandés)."
            />
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    {value.length} / {MAX_LENGTH}
                </span>
                <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
                    Enregistrer
                </Button>
            </div>
        </div>
    );
}
