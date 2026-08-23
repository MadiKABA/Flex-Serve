'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/Footer';
import type { SiteSettings } from '@/lib/data/site-settings';

/**
 * Le header et le footer publics ne doivent apparaître que sur le site
 * vitrine. L'admin (/admin/**) a son propre chrome (navbar + sidebar).
 */
export default function SiteChrome({
    children,
    siteSettings,
}: {
    children: React.ReactNode;
    siteSettings: SiteSettings;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer siteSettings={siteSettings} />
        </>
    );
}
