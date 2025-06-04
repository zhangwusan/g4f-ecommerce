import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Define default values
    const defaults: Record<string, string> = {
      name: '',
      sort: 'id',
      order: 'asc',
      page: '1',
      limit: '10',
      search: '',
    };

    // Build query with only non-default values
    const query = new URLSearchParams();

    for (const key in defaults) {
      const value = searchParams.get(key);
      if (value !== null && value !== defaults[key]) {
        query.set(key, value);
      }
    }

    const url = new URL(`${apiBaseUrlV1}/products/ingredients`);
    url.search = query.toString();

    const response = await fetchWithToken(url.toString(), { method: 'GET' });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        console.log("POST /ingredients payload:", payload);

        const url = new URL(`${apiBaseUrlV1}/products/ingredients`);
        const response = await fetchWithToken(url.toString(), {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("POST /ingredients error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}