import { FetchUserParams } from "@/lib/type/api-response.interface";
import { CreateProductPayload } from "@/lib/type/product.interface";


export const fetchProducts = async ({
  limit = 8,
  page = 1,
  sort,
  order,
  search,
  filter,
}: FetchUserParams) => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('page', page.toString());
  if (sort) params.append('sort', sort);
  if (order) params.append('order', order);
  if (search) params.append('search', search);

  if (filter) {
    const filterString = Object.entries(filter)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');
    params.append('filter', filterString);
  }
  const res = await fetch(`/api/admin/products?${params.toString()}`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to load products.');

  return res.json();
}


export const fetchSetups = async () => {
  const res = await fetch(`/api/admin/products/setup`, {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to load setup.');

  return res.json();
}

export const addProduct = async (payload: CreateProductPayload) => {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Failed to load products.');
  return res.json();
}

export const viewProduct = async (id: number) => {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'GET',
  })
  if (!res.ok) throw new Error('Failed to load products.');
  return res.json();
}

export const updateProduct = async (id: number, payload: CreateProductPayload) => {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Failed to load products.');
  return res.json();
}

export const deleteProduct = async (id: number) => {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete product.');
  return res.json();
}


// mapping product 