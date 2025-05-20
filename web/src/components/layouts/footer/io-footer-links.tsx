interface LinkItem {
    label: string
    href: string
  }
  
  interface LinkGroup {
    title: string
    links: LinkItem[]
  }
  
  interface FooterLinksProps {
    linkGroups?: LinkGroup[]
    className?: string
  }
  
  const defaultLinkGroups: LinkGroup[] = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'Support', href: '/support' },
        { label: 'FAQs', href: '/faq' },
      ],
    },
  ]
  
  export default function FooterLinks({ linkGroups = defaultLinkGroups, className = '' }: FooterLinksProps) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h4 className="font-semibold mb-2">{group.title}</h4>
            <ul className="space-y-1 ">
              {group.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }