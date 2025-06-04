'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Package,
    LucideIcon,
    Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconKey = 'dashboard' | 'users' | 'products' | 'settings'

const icons: Record<IconKey, LucideIcon> = {
    dashboard: LayoutDashboard,
    users: Users,
    products: Package,
    settings: Settings
}

export type NavItem = {
    label: string
    href: string
    icon?: IconKey
}

type AdminSidebarNavProps = {
    navLinks: NavItem[]
    className?: string
}

export function AdminSidebarNav({ navLinks, className }: AdminSidebarNavProps) {
    const pathname = usePathname()

    return (
        <nav className={cn('flex flex-col space-y-1', className)}>
            <Link href="/" className="mb-6 flex items-center gap-2 px-3 py-4">
                {/* Optional: Icon or placeholder square */}
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                    G
                </div>
                <span className="text-lg font-semibold tracking-wide text-foreground text-nowrap">
                    G4F Admin
                </span>
            </Link>
            {navLinks.map(({ label, href, icon }) => {
                const isActive = pathname.startsWith(href)
                const Icon = icon ? icons[icon] : null
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
                            isActive
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4" />}
                        {label}
                    </Link>
                )
            })}
        </nav>
    )
}