import ProductCard from "@/components/section/product/list-product";
import { ProductDisplayResponse } from "@/lib/type/product.interface";
import Link from "next/link";

type Props = {
    title: string;
    icon?: string;
    href: string;
    products: ProductDisplayResponse[];
    view?: 'true' | 'none';
};

export default function HorizontalProductSection({
    title,
    icon,
    href,
    products = [],
    view = 'true'
}: Props) {
    return (
        <section className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    {icon && <span className="mr-1">{icon}</span>} {title}
                </h2>
                {view === 'true' && (
                    <Link href={href} className="text-sm text-blue-500 hover:underline">
                        View All →
                    </Link>
                )}

            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scroll-smooth snap-x snap-mandatory">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="snap-start min-w-[70%] sm:min-w-[240px] md:min-w-[220px] lg:min-w-[200px] flex-shrink-0"
                    >
                        <ProductCard product={product} orientation="vertical" />
                    </div>
                ))}
            </div>
        </section>
    );
}