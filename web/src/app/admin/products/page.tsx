'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import MuiPagination from '@/components/layouts/pagination-section'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'

import { ProductManagementDisplay } from '@/lib/type/product.interface'
import { HeadersDisplay } from '@/lib/type/user.interface'
import {
  deleteProduct, fetchProducts
} from '@/services/products/product.service'
import Image from 'next/image'
import { originalApiBaseUrl } from '@/lib/constants/env'
import { toast } from '@/hooks/use-toast'
import { resolveImageUrl } from '@/lib/xutils/image'
import { errorToast, successToast } from '@/components/layouts/toast'
import { useDebounce } from '@/hooks/use-debounce'


export default function ProductManagementPage() {
  const [products, setProducts] = useState<ProductManagementDisplay[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [headers, setHeaders] = useState<HeadersDisplay[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<'id' | 'name' | 'category' | 'price' | 'created_at' | 'updated_at'>('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, pagination, headers } = await fetchProducts({
        limit: 10,
        page,
        search: debouncedSearchTerm,
        order: sortOrder,
        sort: sortKey,
      })
      setHeaders(headers)
      setProducts(data)
      setTotalPages(pagination.total_pages)
    } catch (err: any) {
      setError(err.error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [page, debouncedSearchTerm, sortKey, sortOrder])

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setLoading(true)
    try {
      await deleteProduct(id)
      successToast('Product deleted successfully')
      loadProducts()
    } catch (err: any) {
      errorToast(err.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={sortKey} onValueChange={(value) => setSortKey(value as typeof sortKey)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="created_at">Created At</SelectItem>
              <SelectItem value="updated_at">Updated At</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as typeof sortOrder)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Link href={'/admin/products/add'}>Add</Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead key={h.id}>{h.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>
                  <div className="w-[50px] h-[50px] relative">
                    <Image
                      src={resolveImageUrl(product.images[0].image_url, originalApiBaseUrl)}
                      alt="Product"
                      fill
                      className="object-cover rounded"
                      sizes="50px"
                    />
                  </div>
                </TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell>{product.rating_count}</TableCell>
                <TableCell>{product.expiry_date}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Link href={`/admin/products/edit/${product.product_id}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.product_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4">
          <MuiPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}