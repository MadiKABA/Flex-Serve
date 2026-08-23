'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateService } from '@/app/admin/(dashboard)/services/actions';
import type { Service } from '@/lib/types/content';

export default function ServiceEditor({ service }: { service: Service }) {
    const router = useRouter();
    const [name, setName] = useState(service.name);
    const [tag, setTag] = useState(service.tag ?? '');
    const [description, setDescription] = useState(service.description ?? '');
    const [href, setHref] = useState(service.href);
    const [ctaPortfolioLabel, setCtaPortfolioLabel] = useState(service.cta_portfolio_label);
    const [ctaReservationLabel, setCtaReservationLabel] = useState(service.cta_reservation_label);
    const [ctaReservationUrl, setCtaReservationUrl] = useState(service.cta_reservation_url);
    const [isSaving, startSaveTransition] = useTransition();

    const handleSave = () => {
        startSaveTransition(async () => {
            const result = await updateService(service.id, service.slug, {
                name,
                tag,
                description,
                href,
                cta_portfolio_label: ctaPortfolioLabel,
                cta_reservation_label: ctaReservationLabel,
                cta_reservation_url: ctaReservationUrl,
            });
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Service enregistré.');
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="tag">Tag</Label>
                    <Input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Authenticité" />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="href">Lien du bouton Portfolio</Label>
                <Input id="href" value={href} onChange={(e) => setHref(e.target.value)} placeholder="/portfolio/portrait" />
            </div>

            <div className="space-y-4 border-t border-border pt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Boutons d&apos;action</p>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="cta-portfolio-label">Libellé du bouton Portfolio</Label>
                        <Input
                            id="cta-portfolio-label"
                            value={ctaPortfolioLabel}
                            onChange={(e) => setCtaPortfolioLabel(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cta-reservation-label">Libellé du bouton Réserver</Label>
                        <Input
                            id="cta-reservation-label"
                            value={ctaReservationLabel}
                            onChange={(e) => setCtaReservationLabel(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="cta-reservation-url">Lien du bouton Réserver</Label>
                    <Input
                        id="cta-reservation-url"
                        value={ctaReservationUrl}
                        onChange={(e) => setCtaReservationUrl(e.target.value)}
                        placeholder="/reservation"
                    />
                </div>
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
