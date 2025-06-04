'use client';

import { useEffect, useState } from 'react';
import HorizontalProductSection from '@/components/layouts/products/horizontal-product-section';
import { ProductDisplayResponse } from '@/lib/type/product.interface';

interface RelatedProductsProps {
    productId: number;
    category: string;
    className?: string;
}

export default function RelatedProducts({ productId, category, className }: RelatedProductsProps) {
    const [related, setRelated] = useState<ProductDisplayResponse[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
        };

        fetchRelated();
    }, [productId, category]);

    if (related.length === 0) return null;

    return (
        <div className={`${className ? className : 'mt-14' }`}>
            <HorizontalProductSection
                title="You Might Also Like"
                icon=""
                href="/products/top-rated"
                products={related}
                view='none'
            />
        </div>
    );
}