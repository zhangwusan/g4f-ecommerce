import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(`${apiBaseUrlV1}/products/update_product_and_clean_cart`);

    const response = await fetchWithToken(url.toString(), { method: 'PUT' });

    if(!response.ok){
      const error = await response.json();
      console.log("Failed : ", error);
      return NextResponse.json({ message: error.message || 'Failed to update cart'})
    }
    const { message } = await response.json();
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error ', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}