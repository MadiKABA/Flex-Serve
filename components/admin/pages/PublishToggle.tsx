'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { togglePagePublished } from '@/app/admin/(dashboard)/pages/actions';
import { cn } from '@/lib/utils';

export default function PublishToggle({
    pageId,
    dbSlug,
    initialPublished,
}: {
    pageId: string;
    dbSlug: string;
    initialPublished: boolean;
}) {
    const [checked, setChecked] = useState(initialPublished);
    const [isPending, startTransition] = useTransition();

    const handleChange = (next: boolean) => {
        const previous = checked;
        setChecked(next);
        startTransition(async () => {
            const result = await togglePagePublished(pageId, dbSlug, next);
            if (!result.success) {
                setChecked(previous);
                toast.error(result.error);
            } else {
                toast.success(next ? 'Page publiée.' : 'Page dépubliée.');
            }
        });
    };

    return (
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Switch checked={checked} onCheckedChange={handleChange} disabled={isPending} aria-label={checked ? 'Dépublier' : 'Publier'} />
            <Badge
                variant="secondary"
                className={cn(checked && 'bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400')}
            >
                {checked ? 'Publiée' : 'Dépubliée'}
            </Badge>
        </div>
    );
}
