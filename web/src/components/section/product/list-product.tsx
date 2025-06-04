'use client';


import { originalApiBaseUrl } from '@/lib/constants/env';
import { ProductDisplayResponse } from '@/lib/type/product.interface';
import { resolveImageUrl } from '@/lib/xutils/image';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ProductCardProps = {
    product: ProductDisplayResponse;
    orientation?: 'vertical' | 'horizontal' | 'none';
};

export default function ProductCard({
    product,
    orientation = 'vertical',
}: ProductCardProps) {
    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    const isVertical = orientation === 'vertical';
    const isHorizontal = orientation === 'horizontal';
    const isFree = orientation === 'none';

    const mainImage = resolveImageUrl(product?.images[0], originalApiBaseUrl) || '/images/default-image.jpg'; // 👈 fallback in case images array is empty
    return (
        <Link href={`/products/${product.id}`}>
            <div
                className={`relative overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition ${isVertical
                    ? 'flex flex-col'
                    : isHorizontal
                        ? 'flex items-center gap-4'
                        : ''
                    }`}
            >
                <div
                    className={`relative ${isVertical ? 'w-full h-40' : isHorizontal ? 'w-24 h-24' : 'w-full h-40'
                        } flex-shrink-0`}
                >
                    <Image
                        src={mainImage}
                        alt={product.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-t-xl"
                    />
                </div>

                <div className={`${isFree ? '' : isVertical ? 'p-3' : 'flex-1 p-2'}`}>
                    <div className="w-48">
                        <h3 className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">
                            {product.title}
                        </h3>
                    </div>
                    <div className="mt-1 text-sm">
                        {product.discount !== 0 ? (
                            <>
                                <span className="line-through">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                <span className="ml-2 text-blue-600 font-bold">
                                    ${discountedPrice.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-blue-600 font-semibold">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}
                        <div className="text-yellow-500 text-xs mt-1 min-h-[1.25rem]">
                            {product.rating !== 0 ? (
                                <>
                                    {'⭐'.repeat(Math.floor(product.rating))}
                                    <span className="text-gray-500 ml-1">
                                        ({Number(product.rating).toFixed(2)})
                                    </span>
                                </>
                            ) : (
                                <span className="invisible">No rating</span>
                            )}
                        </div>
                    </div>
                </div>

                {product.discount !== 0 && isVertical && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-xs px-2 py-1 rounded-full font-semibold z-10">
                        -{product.discount}%
                    </span>
                )}
            </div>
        </Link>
    );
}