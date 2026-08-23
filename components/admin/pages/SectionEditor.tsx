'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MediaManager from '@/components/admin/pages/MediaManager';
import HeroBackgroundImage from '@/components/admin/pages/HeroBackgroundImage';
import { saveSectionLayout, saveSectionText, toggleSectionVisibility } from '@/app/admin/(dashboard)/pages/actions';
import type { GalleryLayout, MediaItem, PortfolioCategory, Section } from '@/lib/types/content';

const LAYOUT_OPTIONS: { value: GalleryLayout; label: string }[] = [
    { value: 'grid', label: 'Grille' },
    { value: 'scroll_ltr', label: 'Défilement gauche → droite' },
    { value: 'scroll_rtl', label: 'Défilement droite → gauche' },
];

export default function SectionEditor({
    section,
    dbSlug,
    category,
    uploadFolder,
    media,
}: {
    section: Section;
    dbSlug: string;
    category: PortfolioCategory | null;
    uploadFolder: string;
    media: MediaItem[];
}) {
    const router = useRouter();
    const [title, setTitle] = useState(section.title ?? '');
    const [subtitle, setSubtitle] = useState(section.subtitle ?? '');
    const [body, setBody] = useState(section.body ?? '');
    const [ctaLabel, setCtaLabel] = useState(section.cta_label ?? '');
    const [ctaUrl, setCtaUrl] = useState(section.cta_url ?? '');
    const [showCta2, setShowCta2] = useState(Boolean(section.cta_label_2 || section.cta_url_2));
    const [ctaLabel2, setCtaLabel2] = useState(section.cta_label_2 ?? '');
    const [ctaUrl2, setCtaUrl2] = useState(section.cta_url_2 ?? '');
    const [visible, setVisible] = useState(section.is_visible);
    const [layout, setLayout] = useState<GalleryLayout>(section.layout);
    const [isSaving, startSaveTransition] = useTransition();

    const isHeroWithBackground = section.type === 'hero' && dbSlug !== 'accueil';
    const currentBackground = section.background_media_id
        ? media.find((m) => m.id === section.background_media_id) ?? null
        : null;

    const handleSave = () => {
        startSaveTransition(async () => {
            const result = await saveSectionText(section.id, dbSlug, {
                title,
                subtitle,
                body,
                cta_label: ctaLabel,
                cta_url: ctaUrl,
                cta_label_2: ctaLabel2,
                cta_url_2: ctaUrl2,
            });
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Section enregistrée.');
            router.refresh();
        });
    };

    const handleVisibilityChange = async (next: boolean) => {
        setVisible(next);
        const result = await toggleSectionVisibility(section.id, dbSlug, next);
        if (!result.success) {
            setVisible(!next);
            toast.error(result.error);
            return;
        }
        toast.success(next ? 'Section visible.' : 'Section masquée.');
        router.refresh();
    };

    const handleLayoutChange = async (next: GalleryLayout) => {
        const previous = layout;
        setLayout(next);
        const result = await saveSectionLayout(section.id, dbSlug, next);
        if (!result.success) {
            setLayout(previous);
            toast.error(result.error);
            return;
        }
        toast.success('Disposition mise à jour.');
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end gap-2">
                <Label htmlFor={`visible-${section.id}`} className="text-xs text-muted-foreground">
                    Visible
                </Label>
                <Switch id={`visible-${section.id}`} checked={visible} onCheckedChange={handleVisibilityChange} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={`title-${section.id}`}>Titre</Label>
                    <Input id={`title-${section.id}`} value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={`subtitle-${section.id}`}>Sous-titre</Label>
                    <Input id={`subtitle-${section.id}`} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`body-${section.id}`}>Texte</Label>
                <Textarea id={`body-${section.id}`} rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={`cta-label-${section.id}`}>Libellé du bouton</Label>
                    <Input id={`cta-label-${section.id}`} value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={`cta-url-${section.id}`}>Lien du bouton</Label>
                    <Input id={`cta-url-${section.id}`} value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
                </div>
            </div>

            {showCta2 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor={`cta-label-2-${section.id}`}>Libellé du 2ᵉ bouton</Label>
                        <Input
                            id={`cta-label-2-${section.id}`}
                            value={ctaLabel2}
                            onChange={(e) => setCtaLabel2(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`cta-url-2-${section.id}`}>Lien du 2ᵉ bouton</Label>
                        <Input
                            id={`cta-url-2-${section.id}`}
                            value={ctaUrl2}
                            onChange={(e) => setCtaUrl2(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCta2(true)}>
                    + Ajouter un 2ᵉ bouton
                </Button>
            )}

            {isHeroWithBackground && (
                <div className="grid gap-2">
                    <Label>Image de fond</Label>
                    <HeroBackgroundImage
                        sectionId={section.id}
                        dbSlug={dbSlug}
                        uploadFolder={uploadFolder}
                        current={currentBackground}
                    />
                </div>
            )}

            <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 bg-[#3d5a7a] text-white hover:bg-[#2d4a6a]"
            >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Enregistrer
            </Button>

            {section.type === 'gallery' && (
                <div className="space-y-4 border-t border-border pt-6">
                    <div className="grid gap-2">
                        <Label>Disposition de la galerie</Label>
                        <RadioGroup
                            value={layout}
                            onValueChange={(value) => handleLayoutChange(value as GalleryLayout)}
                            className="grid-flow-row gap-3 sm:grid-flow-col sm:auto-cols-max sm:gap-6"
                        >
                            {LAYOUT_OPTIONS.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <RadioGroupItem value={option.value} id={`layout-${section.id}-${option.value}`} />
                                    <Label htmlFor={`layout-${section.id}-${option.value}`} className="font-normal">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                        <Label>Photos</Label>
                        <MediaManager
                            sectionId={section.id}
                            dbSlug={dbSlug}
                            category={category}
                            uploadFolder={uploadFolder}
                            media={media}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
