import { Facebook, Twitter, Instagram } from 'lucide-react'
import Link from 'next/link';

interface FooterSocialsProps {
  socials?: { label: string; href: string; icon: React.ReactNode }[]
  className?: string
}

const defaultSocials = [
  { label: 'Facebook', href: '#', icon: <Facebook size={18} /> },
  { label: 'Twitter', href: '#', icon: <Twitter size={18} /> },
  { label: 'Instagram', href: '#', icon: <Instagram size={18} /> },
]

export default function FooterSocials({ socials = defaultSocials, className = '' }: FooterSocialsProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {socials.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          aria-label={s.label}
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          {s.icon}
        </Link>
      ))}
    </div>
  )
}