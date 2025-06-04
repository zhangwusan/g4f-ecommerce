import { apiBaseUrlV1, originalApiBaseUrl } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { ProductDetailResponse } from "@/lib/type/product.interface";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const backendUrl = new URL(`${apiBaseUrlV1}/products/detail/${id}`);

  try {
    const response = await fetchWithToken(backendUrl.toString(), { method: "GET" });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch product" }, { status: response.status });
    }

    const { data }: { data: ProductDetailResponse } = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
