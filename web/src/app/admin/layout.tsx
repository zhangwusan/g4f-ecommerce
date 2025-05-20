import { AdminSidebarNav, IconKey, NavItem } from '@/components/layouts/admin-sidebar-nav'

const adminLinks: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' as IconKey },
    { label: 'Users', href: '/admin/users', icon: 'users' as IconKey },
    { label: 'Products', href: '/admin/products', icon: 'products' as IconKey },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 border-r p-4">
                <AdminSidebarNav navLinks={adminLinks} />
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}