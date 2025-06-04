'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './io-logo'
import RightItems from './io-right-item'
import NavLinks from './io-navbar'
import MobileMenu from './io-mobile-menu'
import SearchInput from './io-search-input'
import { useCart } from '@/context/cart'
import { useSession } from 'next-auth/react'

type NavLink = { label: string; href: string }

type HeaderProps = {
  logo?: string
  navLinks: NavLink[]
  showSearch?: boolean
}

export default function Header({ logo = 'G4F', navLinks, showSearch = true }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart } = useCart()
  const { data: session } = useSession()

  return (
    <header className="w-full shadow px-4 py-4 md:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <Logo text={logo} />

        {showSearch && (
          <div className="flex-1 min-w-[200px] max-w-lg hidden md:block">
            <SearchInput />
          </div>
        )}

        {/* Desktop Right Menu */}
        <div className="hidden md:flex items-center gap-4">
          <RightItems session={session} cart={cart} />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-2 my-4">
        <NavLinks links={navLinks} />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <MobileMenu
          showSearch={showSearch}
          session={session}
          cart={cart}
          navLinks={navLinks}
        />
      )}
    </header>
  )
}