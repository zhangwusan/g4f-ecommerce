'use client'
import React, { useEffect, useState } from 'react';
import AsideCategories from '@/components/layouts/aside-categories';
import ProductCard from '@/components/ui/product/list-product';
import { ProductDisplayResponse } from '@/lib/type/product.interface';
import { CategorySetupResponse } from '@/lib/type/categories.interface';
import { ApiResponse } from '@/lib/type/api-response.interface';
import MuiPagination from '@/components/layouts/pagination-section';
import { CircularProgress } from '@mui/material';

export default function Categories() {
  const [filters, setFilters] = useState<{ category_id: number; category_name: string }[]>([]);
  const [sortOptions, setSortOptions] = useState<{ value: string; label: string }[]>([]);
  const [orderOptions, setOrderOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<ProductDisplayResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch filters and sorting options
  useEffect(() => {
    const fetchFiltersAndSortOptions = async () => {
      try {
        const res = await fetch('/api/categories/setup');
        const { data }: { data: CategorySetupResponse } = await res.json();

        setFilters(data.categories);
        setSortOptions(data.sorts);
        setOrderOptions(data.order);
        setSelectedCategory(data.categories[0]?.category_name || '');
      } catch (error) {
        console.error('Error fetching categories or sort options:', error);
        setFilters([]);
        setSortOptions([]);
        setOrderOptions([]);
      }
    };

    fetchFiltersAndSortOptions();
  }, []);

  // Fetch products based on selected filters, sorting, and pagination
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/categories?category_name=${encodeURIComponent(selectedCategory)}&sort=${sortOption}&order=${sortOrder}&page=${currentPage}`
        );
        const { data, pagination }: ApiResponse<ProductDisplayResponse[]> = await res.json();

        setProducts(data ? data : []);
        setCurrentPage(pagination ? pagination.current_page : 1);
        setTotalPages(pagination ? pagination.total_pages : 1);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortOption, sortOrder, currentPage]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 min-h-screen">
      {/* Desktop sidebar */}
      {filters.length > 0 && (
        <div className="hidden lg:block w-full lg:w-1/4">
          <div className="sticky top-6">
            <AsideCategories
              categories={filters.map((cat) => cat.category_name)}
              selected_category={selectedCategory}
              on_select_category={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1); // Reset to first page when changing category
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile filters */}
      <div className="lg:hidden">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showMobileFilters && (
          <AsideCategories
            categories={filters.map((cat) => cat.category_name)}
            selected_category={selectedCategory}
            on_select_category={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Products section */}
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {selectedCategory}
          </h1>

          {/* Sort options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              <span>Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg border text-sm"
              >
                {sortOptions.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span>Order:</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-lg border text-sm"
              >
                {orderOptions.map((order) => (
                  <option key={order.value} value={order.value}>
                    {order.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <CircularProgress />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} orientation="vertical" />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <MuiPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}