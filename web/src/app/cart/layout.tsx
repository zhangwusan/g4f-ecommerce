import { CheckoutProvider } from "@/context/checkout";

export default async function CartLayout({ children }: { children: React.ReactNode }) {

    return (
        <CheckoutProvider>
            {children}
        </CheckoutProvider>
    );
}