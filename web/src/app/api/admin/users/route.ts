import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { Pagination } from "@/lib/type/api-response.interface";
import { HeadersDisplay, UserDisplayResponse } from "@/lib/type/user.interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams: params } = req.nextUrl;

    const query = new URLSearchParams();
    if (params.get('limit')) query.append('limit', params.get('limit')!);
    if (params.get('page')) query.append('page', params.get('page')!);
    if (params.get('sort')) query.append('sort', params.get('sort')!);
    if (params.get('order')) query.append('order', params.get('order')!);
    if (params.get('search')) query.append('search', params.get('search')!);
    if (params.get('filter')) query.append('filter', params.get('filter')!);

    const apiUrl = `${apiBaseUrlV1}/users${query.toString() ? `?${query.toString()}` : ''}`;

    const response = await fetchWithToken(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: response.status });
    }

    const { data, pagination, headers }: { data: UserDisplayResponse[], pagination: Pagination, headers: HeadersDisplay[] } = await response.json();

    return NextResponse.json({ data, pagination, headers }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching user data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiUrl = `${apiBaseUrlV1}/users`;
    const response = await fetchWithToken(apiUrl, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: response.status });
    }

    const { message } = await response.json();

    return NextResponse.json({ message }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 })
  }
}
