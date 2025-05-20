import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrlV1, originalApiBaseUrl } from "@/lib/constants/env";
import { DataEventResponse, ProductDisplayResponse } from "@/lib/type/product.interface";


export async function GET(req: NextRequest) {

    const url = new URL(`${apiBaseUrlV1}/products/event`);
    // Fetch products from api
    const response = await fetchWithToken(url.toString(), { method: 'GET' });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('API error:', errorResponse);
        return NextResponse.json({ message: errorResponse?.message || 'Failed to fetch products' }, { status: response.status });
    }
    const { data }: { data: DataEventResponse } = await response.json();

    const attachImageBase = (products: ProductDisplayResponse[]) =>
        products.map((product) => ({
            ...product,
            images: product.images.map((image) => originalApiBaseUrl + image),
        }));

    return NextResponse.json({
        data: {
            top_rating: attachImageBase(data.top_rating),
            trending: attachImageBase(data.trending),
            recommended: attachImageBase(data.recommended),
            best_deal: attachImageBase(data.best_deal),
            three_row_listing_product: attachImageBase(data.three_row_listing_product)
        },
    });
}