'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateSiteSettings } from '@/app/admin/(dashboard)/settings/actions';
import type { SiteSettings } from '@/lib/data/site-settings';

const FIELDS: { key: keyof SiteSettings; label: string; type: string; placeholder: string }[] = [
    { key: 'contact_email', label: 'Email', type: 'email', placeholder: 'contact@flexservestudio.com' },
    { key: 'contact_phone', label: 'Téléphone', type: 'text', placeholder: '+221 XX XXX XX XX' },
    { key: 'address', label: 'Adresse', type: 'text', placeholder: 'Dakar, Sénégal' },
    { key: 'facebook_url', label: 'Facebook', type: 'url', placeholder: 'https://www.facebook.com/...' },
    { key: 'instagram_url', label: 'Instagram', type: 'url', placeholder: 'https://www.instagram.com/...' },
    { key: 'tiktok_url', label: 'TikTok', type: 'url', placeholder: 'https://www.tiktok.com/@...' },
];

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
    const router = useRouter();
    const [values, setValues] = useState<SiteSettings>(settings);
    const [isSaving, startSaveTransition] = useTransition();

    const handleChange = (key: keyof SiteSettings, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        startSaveTransition(async () => {
            const result = await updateSiteSettings(values);
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            toast.success('Coordonnées enregistrées.');
            router.refresh();
        });
    };

    return (
        <div className="space-y-6 rounded-xl border border-border bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((field) => (
                    <div key={field.key} className="grid gap-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                            id={field.key}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={values[field.key]}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                        />
                    </div>
                ))}
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
