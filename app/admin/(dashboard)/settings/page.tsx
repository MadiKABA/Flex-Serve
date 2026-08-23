import SiteSettingsForm from '@/components/admin/settings/SiteSettingsForm';
import { getSiteSettings } from '@/lib/data/site-settings';

export default async function AdminSettingsPage() {
    const settings = await getSiteSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#2E4A6F]">Paramètres</h1>
                <p className="text-sm text-muted-foreground">
                    Coordonnées affichées sur la page Contact, le pied de page et les données structurées du site.
                </p>
            </div>

            <SiteSettingsForm settings={settings} />
        </div>
    );
}
