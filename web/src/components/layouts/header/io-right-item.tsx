'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, User, ShoppingCart } from 'lucide-react'

type RightItem = {
  label: string
  href: string
  icon: React.ReactNode
  onClick?: () => void
}

type Props = {
  session: { user?: any } | null
  cart: any[]
  isMobile?: boolean
}

export default function RightItems({ session, cart, isMobile = false }: Props) {
  const { theme, setTheme } = useTheme()

  const rightItems: RightItem[] = [
    {
      label: session?.user ? 'Profile' : 'Account',
      href: session?.user ? '/auth/profile' : '/auth/login',
      icon: <User size={18} />,
    },
    {
      label: `Cart (${cart.length})`,
      href: '/cart',
      icon: <ShoppingCart size={18} />,
    },
    {
      label: theme === 'light' ? 'Light Mode' : 'Dark Mode',
      href: '#',
      icon: theme === 'light' ? <Moon size={18} /> : <Sun size={18} />,
      onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'),
    },
  ]

  return (
    <div className={isMobile ? 'space-y-2' : 'flex items-center gap-4'}>
      {rightItems.map((item, i) =>
        item.onClick ? (
          <button
            key={i}
            onClick={item.onClick}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ) : (
          <Link
            key={i}
            href={item.href}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      )}
    </div>
  )
}