'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Loader } from 'lucide-react';
import ProductCard from '@/components/section/product/list-product';
import MuiPagination from '@/components/layouts/pagination-section';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const search = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'id';
    const order = searchParams.get('order') || 'asc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        const params = new URLSearchParams({
            search,
            sort,
            order,
            page: page.toString(),
            limit: limit.toString(),
        });

        setLoading(true);
        console.log(`Fetching products with params: ${params.toString()}`);
        fetch(`/api/products/search?${params.toString()}`)
            .then((res) => res.json())
            .then((res) => {
                setProducts(res.data || []);
                setTotal(res.pagination?.total_items || 0);
            })
            .finally(() => setLoading(false));
    }, [search, sort, order, page, limit]);

    const updateParam = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set(key, value);
        if (key !== 'page') newParams.set('page', '1'); // Reset to first page
        router.push(`/products/search?${newParams.toString()}`);
    };

    return (
        <div className="p-6 space-y-6">
            {search && <h1 className="text-xl font-bold">Results for "{search}"</h1>}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                    {total} result{total !== 1 && 's'}
                </div>

                <div className="flex gap-2 items-center">
                    <Select value={sort} onValueChange={(val) => updateParam('sort', val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="id">ID</SelectItem>
                            <SelectItem value="created_at">Newest</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={order} onValueChange={(val) => updateParam('order', val)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={limit.toString()} onValueChange={(val) => updateParam('limit', val)}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="h-6 w-6 animate-spin" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}

            {totalPages > 1 && (
                <MuiPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateParam('page', newPage.toString())}
                />
            )}
        </div>
    );
}