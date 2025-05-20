import FooterLinks from "./io-footer-links"
import FooterSocials from "./io-footer-socials"
import NewsletterForm from "./io-newsletter-form"

interface FooterProps {
  newsletter?: Partial<Parameters<typeof NewsletterForm>[0]>
  links?: Parameters<typeof FooterLinks>[0]['linkGroups']
  socials?: Parameters<typeof FooterSocials>[0]['socials']
}

export default function Footer({ newsletter, links, socials }: FooterProps) {
  return (
    <footer className="px-6 py-10 mt-12 border-t">
      <div className="max-w-7xl mx-auto space-y-10">
        <NewsletterForm {...newsletter} />
        <FooterLinks linkGroups={links} />
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm pt-6 border-t">
          <p>&copy; {new Date().getFullYear()} G4F Co. All rights reserved.</p>
          <FooterSocials socials={socials} />
        </div>
      </div>
    </footer>
  )
}