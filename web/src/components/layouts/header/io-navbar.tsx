import Link from "next/link";

type NavLink = { label: string; href: string }

export default function NavLinks({
  links,
  isMobile = false,
}: {
  links: NavLink[]
  isMobile?: boolean
}) {
  return (
    <nav
      className={`${
        isMobile
          ? 'flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 text-base'
          : 'hidden md:flex items-center gap-6 text-sm font-medium'
      }`}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}