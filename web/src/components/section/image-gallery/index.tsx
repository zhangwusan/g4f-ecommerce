'use client';

import { originalApiBaseUrl } from "@/lib/constants/env";
import { resolveImageUrl } from "@/lib/xutils/image";
import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  images: { id: number; image_url: string; is_main: boolean }[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const validImages = images
    .filter(img => typeof img.image_url === 'string' && img.image_url.length > 0);

  const [mainImage, setMainImage] = useState<string>(
    images.find((img) => img.is_main)?.image_url || validImages[0]?.image_url || ''
  );

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        {mainImage && (
          <Image
            src={resolveImageUrl(mainImage, originalApiBaseUrl)}
            alt="Main product image"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-xl"
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-1">
        {validImages.map((img) => {
          const fullUrl = resolveImageUrl(img.image_url, originalApiBaseUrl); // <-- Fix here
          return (
            <div
              key={img.id}
              onClick={() => setMainImage(img.image_url)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ease-in-out cursor-pointer hover:shadow-md ${img.image_url === mainImage ? 'border-blue-600' : 'border-transparent'
                }`}
            >
              <Image
                src={fullUrl}
                alt={`Thumbnail ${img.id}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-xl"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}