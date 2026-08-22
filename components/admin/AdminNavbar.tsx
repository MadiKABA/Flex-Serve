'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';

export default function AdminNavbar({
    userEmail,
    onMenuClick,
}: {
    userEmail: string;
    onMenuClick: () => void;
}) {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        await supabaseBrowser.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e8e4d9] bg-white px-4 lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Ouvrir le menu"
                    className="text-[#2E4A6F] lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <span className="hidden text-lg font-semibold tracking-tight text-[#2E4A6F] lg:block">
                    FlexServeStudio
                </span>
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden text-sm text-muted-foreground sm:block">{userEmail}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="gap-2 border-[#2E4A6F]/20 text-[#2E4A6F] hover:bg-[#2E4A6F]/5"
                >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                </Button>
            </div>
        </header>
    );
}
