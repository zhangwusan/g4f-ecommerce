import Link from 'next/link';
import ProductCard from '@/components/section/product/list-product';
import { ProductDisplayResponse } from '@/lib/type/product.interface';

interface Props {
  products: ProductDisplayResponse[]
}

export default function ThreeRowProductGrid({ products } : Props) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">🧩 Featured Picks</h2>
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            orientation="vertical"
          />
        ))}
      </div>
    </section>
  );
}