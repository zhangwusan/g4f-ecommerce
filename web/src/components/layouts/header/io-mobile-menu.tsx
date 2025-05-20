import NavLinks from "./io-navbar"
import RightItems from "./io-right-item"
import SearchInput from "./io-search-input"

type Props = {
  showSearch: boolean
  session: any
  cart: any[]
  navLinks: any[]
}

export default function MobileMenu({ showSearch, session, cart, navLinks }: Props) {
  return (
    <div className="md:hidden mt-3 border-t pt-3 px-4 pb-6 space-y-4">
      {showSearch && <SearchInput />}
      <RightItems session={session} cart={cart} isMobile />
      <NavLinks links={navLinks} isMobile />
    </div>
  )
}