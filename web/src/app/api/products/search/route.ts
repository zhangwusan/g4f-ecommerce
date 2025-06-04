import { apiBaseUrlV1, originalApiBaseUrl } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Define default values
    const defaults: Record<string, string> = {
      sort: 'id',
      order: 'asc',
      page: '1',
      limit: '10',
      search: '',
    };

    const query = new URLSearchParams();
    for (const key in defaults) {
      query.set(key, searchParams.get(key) || defaults[key]);
    }

    const url = new URL(`${apiBaseUrlV1}/products`);
    url.search = query.toString();

    const response = await fetchWithToken(url.toString(), { method: 'GET' });

    console.log(`Fetching products from: ${url.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: response.status });
    }

    const { data, pagination } = await response.json();;
    return NextResponse.json({
        data: data.map((item: any) => ({
            ...item,
            images: item.images.map((img: any) => (img))
        })),pagination});

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}