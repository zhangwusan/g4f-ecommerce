import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrlV1, originalApiBaseUrl } from '@/lib/constants/env';
import { fetchWithToken } from '@/lib/fetch/fetch-with-token';
import { ApiResponse } from '@/lib/type/api-response.interface';
import { ProductDisplayResponse } from '@/lib/type/product.interface';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const category = searchParams.get('category_name');
    const sort = searchParams.get('sort') ?? 'price';
    const order = searchParams.get('order') ?? 'asc';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '15';
    const search = searchParams.get('search') ?? '';

    if (!category) {
      return NextResponse.json(
        { message: 'Missing required category_name.' },
        { status: 400 }
      );
    }

    const query = new URLSearchParams({
      category_name: category,
      limit,
      page,
      sort,
      order,
    });

    if (search) query.append('search', search);

    const url = `${apiBaseUrlV1}/categories/filter?${query.toString()}`;
    console.log('[GET] /api/categories ->', url);

    const response = await fetchWithToken(url, { method: 'GET' });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: 'Failed to fetch products.', error },
        { status: response.status }
      );
    }

    const { data, pagination }: ApiResponse<ProductDisplayResponse[]> = await response.json();

    return NextResponse.json<ApiResponse<ProductDisplayResponse[]>>({
      message: 'Categories fetched successfully.',
      data: data?.map(product => ({
        ...product,
        images: product.images.map(image => originalApiBaseUrl + image),
      })),
      pagination,
    }, { status: 200 });
  } catch (error) {
    console.error('[ERROR] /api/categories:', error);
    return NextResponse.json(
      { message: 'Failed to load products.' },
      { status: 500 }
    );
  }
}