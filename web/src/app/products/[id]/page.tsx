'use client';
import ProductDetailClient from '@/components/section/product/detail';
import { ProductDetailResponse } from '@/lib/type/product.interface';
import { use, useEffect, useState } from 'react';

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${params.id}`);

      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        console.error('Failed to fetch product');
      }
    };

    fetchProduct();
  }, [params.id]);

  if(!product) {
    return <div>Product not found</div>
  }

  return <ProductDetailClient product={product}/>
}