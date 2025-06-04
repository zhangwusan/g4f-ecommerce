'use client';

import React, { useEffect, useState } from 'react';
import Banner from '@/components/layouts/banner';
import HorizontalProductSection from '@/components/layouts/products/horizontal-product-section';
import ThreeRowProductGrid from '@/components/layouts/products/three-row-listing-product';
import { DataEventResponse } from '@/lib/type/product.interface';


const Home: React.FC = () => {
  const [data, setData] = useState<DataEventResponse>({
    top_rating: [],
    trending: [],
    recommended: [],
    best_deal: [],
    three_row_listing_product: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products/listing');
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error('Failed to load product data:', err);
        setError('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <div className="text-center py-10">
          Loading products...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="text-center py-10 text-red-500 dark:text-red-400">
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Banner direction="horizontal" interval={3000} styleType="bounce">
        <Banner.Item>🔥 Hot Deal 1</Banner.Item>
        <Banner.Item>🎁 Free Shipping</Banner.Item>
        <Banner.Item>💥 Limited Time Offer</Banner.Item>
      </Banner>
      
      <HorizontalProductSection
        title="🔥 Best Deals"
        icon="🔥"
        href="/products/best-deal"
        products={data.best_deal}
      />

      <HorizontalProductSection
        title="⭐ Top Rated"
        icon="⭐"
        href="/products/top-rated"
        products={data.top_rating}
      />

      <HorizontalProductSection
        title="🎯 Recommended"
        icon="🎯"
        href="/products/recommended"
        products={data.recommended}
      />

      <HorizontalProductSection
        title="📈 Trending"
        icon="📈"
        href="/products/trending"
        products={data.trending}
      />

      <ThreeRowProductGrid products={data.three_row_listing_product} />
    </>
  );
};

export default Home;