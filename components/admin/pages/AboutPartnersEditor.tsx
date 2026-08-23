'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { addPartner, deletePartner, movePartnerPosition, updatePartner } from '@/app/admin/(dashboard)/pages/about-actions';
import type { AboutPartner } from '@/lib/types/content';

export default function AboutPartnersEditor({ partners }: { partners: AboutPartner[] }) {
    const router = useRouter();
    const [busyId, setBusyId] = useState<string | null>(null);
    const [isAdding, startAddTransition] = useTransition();

    const handleAdd = () => {
        startAddTransition(async () => {
            const result = await addPartner();
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Partenaire ajouté.');
            router.refresh();
        });
    };

    const handleDelete = async (id: string) => {
        setBusyId(id);
        const result = await deletePartner(id);
        setBusyId(null);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        toast.success('Partenaire supprimé.');
        router.refresh();
    };

    const handleMove = async (id: string, direction: 'up' | 'down') => {
        setBusyId(id);
        const result = await movePartnerPosition(id, direction);
        setBusyId(null);
        if (!result.success) {
            toast.error(result.error);
            return;
        }
        router.refresh();
    };

    return (
        <div className="space-y-4">
            {partners.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Aucun partenaire — le bandeau est masqué sur la page publique tant que cette liste est vide.
                </p>
            )}

            {partners.length > 0 && (
                <div className="space-y-3">
                    {partners.map((partner, index) => (
                        <PartnerRow
                            key={partner.id}
                            partner={partner}
                            isFirst={index === 0}
                            isLast={index === partners.length - 1}
                            busy={busyId === partner.id}
                            onMoveUp={() => handleMove(partner.id, 'up')}
                            onMoveDown={() => handleMove(partner.id, 'down')}
                            onDelete={() => handleDelete(partner.id)}
                        />
                    ))}
                </div>
            )}

            <Button type="button" variant="outline" size="sm" onClick={handleAdd} disabled={isAdding} className="gap-2">
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Ajouter un partenaire
            </Button>
        </div>
    );
}

function PartnerRow({
    partner,
    isFirst,
    isLast,
    busy,
    onMoveUp,
    onMoveDown,
    onDelete,
}: {
    partner: AboutPartner;
    isFirst: boolean;
    isLast: boolean;
    busy: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
}) {
    const router = useRouter();
    const [name, setName] = useState(partner.name);
    const [visible, setVisible] = useState(partner.is_visible);
    const [isSaving, startSaveTransition] = useTransition();

    const handleSaveName = () => {
        startSaveTransition(async () => {
            const result = await updatePartner(partner.id, { name, is_visible: visible });
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Partenaire enregistré.');
            router.refresh();
        });
    };

    const handleVisibilityChange = async (next: boolean) => {
        const previous = visible;
        setVisible(next);
        const result = await updatePartner(partner.id, { name, is_visible: next });
        if (!result.success) {
            setVisible(previous);
            toast.error(result.error);
            return;
        }
        toast.success(next ? 'Partenaire visible.' : 'Partenaire masqué.');
        router.refresh();
    };

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <div className="flex flex-col gap-1">
                <button
                    type="button"
                    onClick={onMoveUp}
                    disabled={isFirst || busy}
                    className="rounded border border-border p-1 text-[#2E4A6F] disabled:opacity-30"
                    aria-label="Monter"
                >
                    <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    onClick={onMoveDown}
                    disabled={isLast || busy}
                    className="rounded border border-border p-1 text-[#2E4A6F] disabled:opacity-30"
                    aria-label="Descendre"
                >
                    <ArrowDown className="h-3.5 w-3.5" />
                </button>
            </div>

            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du partenaire"
                className="flex-1"
            />

            <Button type="button" size="sm" variant="outline" onClick={handleSaveName} disabled={isSaving} className="shrink-0">
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'OK'}
            </Button>

            <Switch
                checked={visible}
                onCheckedChange={handleVisibilityChange}
                aria-label={visible ? 'Masquer' : 'Afficher'}
            />

            <button
                type="button"
                onClick={onDelete}
                disabled={busy}
                className="shrink-0 rounded p-1.5 text-destructive disabled:opacity-30"
                aria-label="Supprimer"
            >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
        </div>
    );
}
