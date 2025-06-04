'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImageGallery from '../image-gallery';
import RelatedProducts from './related';
import { useCart } from '@/context/cart';
import { AddCartItem } from '@/lib/type/cart.interface';
import { ProductDetailResponse } from '@/lib/type/product.interface';
import { successToast } from '@/components/layouts/toast';
import { BackButton } from '../back-btn';

type Props = {
  product: ProductDetailResponse | null;
};

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!product) {
    return <>Product not found</>;
  }

  const initialColor = searchParams.get('color') || product.variants[0]?.color.name || '';
  const initialSize = searchParams.get('size') || product.variants[0]?.size.name || '';
  const initialQty = parseInt(searchParams.get('quantity') || '1');

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedColor, setSelectedColor] = useState<{ id: number; name: string } | null>(() =>
    product.variants.find((va) => va.color.name === initialColor)?.color || null
  );
  const [selectedSize, setSelectedSize] = useState<{ id: number; name: string } | null>(() =>
    product.variants.find((va) => va.size.name === initialSize)?.size || null
  );
  const [quantity, setQuantity] = useState(initialQty);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const { addToCart } = useCart();

  const updateQuery = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, String(value));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = async () => {
    const body: AddCartItem = {
      product_id: product.id,
      discount: product.discount || 0,
      quantity,
      color: selectedColor?.id || 0,
      size: selectedSize?.id || 0,
    };

    await addToCart(body);
    successToast('Added to cart!')
  };

  const handleCheckoutNow = async () => {
    await handleAddToCart();
    router.push('/cart/checkout');
  };

  const handleColorChange = (color: { id: number; name: string }) => {
    setSelectedColor(color);
    updateQuery('color', color.name);
  };

  const handleSizeChange = (size: { id: number; name: string }) => {
    setSelectedSize(size);
    updateQuery('size', size.name);
  };

  useEffect(() => {
    const matchingVariant = product.variants.find(
      (v) =>
        v.color.id === selectedColor?.id &&
        v.size.id === selectedSize?.id
    );
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [selectedColor, selectedSize, product.variants]);

  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.color.id, v.color])).values()
  );

  const uniqueSizes = Array.from(
    new Map(product.variants.map((v) => [v.size.id, v.size])).values()
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <BackButton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <ImageGallery images={product?.images || []} />

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="text-xl font-semibold mb-2">
            {product.discount ? (
              <>
                <span className="line-through text-gray-500 mr-2">${product.price}</span>
                <span className="text-green-600">${discountedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-blue-500">${product.price}</span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="text-sm text-yellow-500 mb-2">
              ⭐ {product.rating.toFixed(1)} ({product.rating_count} reviews)
            </div>
          )}

          <p className="mb-4">{product.short_description}</p>

          {product.brand_name && (
            <p className="text-sm mb-2">
              <span className="font-medium">Brand:</span> {product.brand_name}
            </p>
          )}

          <p className="text-sm mb-4">
            <span className="font-medium">Availability:</span>{' '}
            {selectedVariant?.availability_status || 'N/A'}
          </p>

          {uniqueColors.length > 0 && (
            <div className="mb-4">
              <label className="font-medium block mb-1">Color:</label>
              <div className="flex gap-2">
                {uniqueColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`px-3 py-1 rounded-full border text-sm ${selectedColor?.id === color.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {uniqueSizes.length > 0 && (
            <div className="mb-4">
              <label className="font-medium block mb-1">Size:</label>
              <div className="flex gap-2">
                {uniqueSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-1 rounded-full border text-sm ${selectedSize?.id === size.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  const newQty = Math.max(1, quantity - 1);
                  setQuantity(newQty);
                  updateQuery('quantity', newQty);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => {
                  const newQty = quantity + 1;
                  setQuantity(newQty);
                  updateQuery('quantity', newQty);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleCheckoutNow}
              className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <ul className="text-sm space-y-2">
          {product.ingredients?.length > 0 && (
            <li>
              <span className="font-medium">Ingredients:</span>{' '}
              {product.ingredients.map((i) => i.name).join(', ')}
            </li>
          )}
          {product.usage_instructions?.length > 0 && (
            <li>
              <span className="font-medium">Usage:</span>{' '}
              {product.usage_instructions.map((u) => u.instruction).join(', ')}
            </li>
          )}
          {product.care_instructions?.length > 0 && (
            <li>
              <span className="font-medium">Care Instructions:</span>{' '}
              {product.care_instructions.map((c) => c.instruction).join(', ')}
            </li>
          )}
          {product.dimensions && (
            <li>
              <span className="font-medium">Dimensions:</span>{' '}
              {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} ({product.dimensions.dimension_label})
            </li>
          )}
          {product.dimensions?.weight && (
            <li>
              <span className="font-medium">Weight:</span> {product.dimensions.weight}
            </li>
          )}
          {product.return_policy && (
            <li>
              <span className="font-medium">Return Policy:</span> {product.return_policy}
            </li>
          )}
          {product.manufacturing_date && (
            <li>
              <span className="font-medium">Manufactured:</span> {product.manufacturing_date}
            </li>
          )}
          {product.expiry_date && (
            <li>
              <span className="font-medium">Expiry Date:</span> {product.expiry_date}
            </li>
          )}
        </ul>
      </div>

      <RelatedProducts productId={product.id} category={product.category} />
    </div>
  );
}