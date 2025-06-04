'use client';

import { usePathname } from "next/navigation";
import Footer from "../footer";
import Header from "../header";


const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products/search' },
    { label: 'Categories', href: '/categories' },
    // { label: 'Deals', href: '/deals' },
    // { label: 'Contact', href: '/contact' },
];

const HIDE_LAYOUT_PATHS = ['/auth/login', '/auth/register', '/unauthorized', '/admin'];

export default function DefaultLayoutApp({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const shouldShowLayout = !HIDE_LAYOUT_PATHS.some((path) =>
        pathname === path || pathname.startsWith(`${path}/`)
    );
    return (
        <>
            {/* <TopBar /> */}
            {shouldShowLayout && <Header logo="G4F" navLinks={navLinks} showSearch={true} />}
            {shouldShowLayout ? (
                <main className="antialiased max-w-7xl mx-auto flex-1 overflow-auto px-4">{children}</main>
            ) : (
                <main>{children}</main>
            )}
            {shouldShowLayout && <Footer />}
        </>
    );
}