'use client';

import { useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminShell({
    userEmail,
    children,
}: {
    userEmail: string;
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <AdminNavbar userEmail={userEmail} onMenuClick={() => setSidebarOpen(true)} />
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
