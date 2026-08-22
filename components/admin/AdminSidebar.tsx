'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Briefcase,
    FileText,
    Image as ImageIcon,
    LayoutDashboard,
    ListTree,
    Settings,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { label: 'Pages', href: '/admin/pages', icon: FileText },
    { label: 'Médiathèque', href: '/admin/media', icon: ImageIcon },
    { label: 'Services', href: '/admin/services', icon: Briefcase },
    { label: 'Paramètres', href: '/admin/settings', icon: Settings },
    { label: 'Navigation', href: '/admin/navigation', icon: ListTree },
];

function isActive(pathname: string, href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
    return (
        <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            active
                                ? 'bg-[#3d5a7a] text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                        )}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Sidebar fixe — desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col bg-[#2E4A6F]">
                <div className="flex h-16 items-center border-b border-white/10 px-6">
                    <span className="text-lg font-semibold tracking-tight text-white">FlexServeStudio</span>
                </div>
                <div className="px-6 pt-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                        Administration
                    </span>
                </div>
                <SidebarNav pathname={pathname ?? ''} />
            </aside>

            {/* Drawer — mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />
            )}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#2E4A6F] transition-transform duration-300 ease-in-out lg:hidden',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <span className="text-lg font-semibold tracking-tight text-white">FlexServeStudio</span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer le menu"
                        className="text-white/70 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="px-6 pt-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                        Administration
                    </span>
                </div>
                <SidebarNav pathname={pathname ?? ''} onNavigate={onClose} />
            </aside>
        </>
    );
}
