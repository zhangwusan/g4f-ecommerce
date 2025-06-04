'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebarNav, IconKey, NavItem } from '@/components/layouts/admin-sidebar-nav';

const adminLinks: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' as IconKey },
    { label: 'Users', href: '/admin/users', icon: 'users' as IconKey },
    { label: 'Products', href: '/admin/products', icon: 'products' as IconKey },
    { label: 'Settings', href: '/admin/settings', icon: 'settings' as IconKey }
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r p-4">
                <AdminSidebarNav navLinks={adminLinks} />
            </aside>
            <div className="p-6 space-y-6 w-full">
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}