// app/checkout/route.ts (or api/checkout.js in Next.js 13)

import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { amount } = await req.json();
    try {
        const response = await fetchWithToken(`${apiBaseUrlV1}/payment/create-payment-intent`, {
            method: 'POST',
            body: JSON.stringify({ amount })
        });

        // 2. Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }

        // 3. Parse the response from NestJS
        const data = await response.json();

        // 4. Send the data back to the client (e.g., returning clientSecret)
        return NextResponse.json({ clientSecret: data.clientSecret });

    } catch (error) {
        console.error(error);
        // Return an error response
        return NextResponse.json({ error: 'An error occurred while creating the payment intent' }, { status: 500 });
    }
}