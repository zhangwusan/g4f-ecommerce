'use client';
import { useState } from 'react';
import Image from 'next/image';

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const validImages = images.filter(img => typeof img === 'string' && img.startsWith('http'));
  const [mainImage, setMainImage] = useState(validImages[0] || '');

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        {mainImage && (
          // <Image
          //   src={mainImage}
          //   alt="Main product image"
          //   fill
          //   className="object-cover"
          //   sizes="100vw"
          // />
          <Image
            src={mainImage}
            alt="Main product image"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-t-xl"
          />
        )}
      </div>

      {/* Scrollable Thumbnail List */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-1">
        {validImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setMainImage(img)}
            className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-md ${img === mainImage ? 'border-blue-600' : 'border-transparent'
              }`}
          >
            <Image
              src={mainImage}
              alt={`Thumbnail ${idx + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-t-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}