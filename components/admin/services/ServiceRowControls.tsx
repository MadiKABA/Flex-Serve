'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { moveServicePosition, toggleServiceVisibility } from '@/app/admin/(dashboard)/services/actions';
import { cn } from '@/lib/utils';

export default function ServiceRowControls({
    serviceId,
    initialVisible,
    isFirst,
    isLast,
}: {
    serviceId: string;
    initialVisible: boolean;
    isFirst: boolean;
    isLast: boolean;
}) {
    const router = useRouter();
    const [visible, setVisible] = useState(initialVisible);
    const [isMoving, startMoveTransition] = useTransition();

    const handleVisibilityChange = async (next: boolean) => {
        const previous = visible;
        setVisible(next);
        const result = await toggleServiceVisibility(serviceId, next);
        if (!result.success) {
            setVisible(previous);
            toast.error(result.error);
            return;
        }
        toast.success(next ? 'Service visible.' : 'Service masqué.');
        router.refresh();
    };

    const handleMove = (direction: 'up' | 'down') => {
        startMoveTransition(async () => {
            const result = await moveServicePosition(serviceId, direction);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            router.refresh();
        });
    };

    return (
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-1">
                <button
                    type="button"
                    onClick={() => handleMove('up')}
                    disabled={isFirst || isMoving}
                    className="rounded border border-border p-1 text-[#2E4A6F] disabled:opacity-30"
                    aria-label="Monter"
                >
                    {isMoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
                </button>
                <button
                    type="button"
                    onClick={() => handleMove('down')}
                    disabled={isLast || isMoving}
                    className="rounded border border-border p-1 text-[#2E4A6F] disabled:opacity-30"
                    aria-label="Descendre"
                >
                    <ArrowDown className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <Switch checked={visible} onCheckedChange={handleVisibilityChange} aria-label={visible ? 'Masquer' : 'Afficher'} />
                <Badge
                    variant="secondary"
                    className={cn(visible && 'bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400')}
                >
                    {visible ? 'Visible' : 'Masqué'}
                </Badge>
            </div>
        </div>
    );
}
