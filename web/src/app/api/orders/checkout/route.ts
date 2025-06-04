import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { shippingAddress, paymentMethod, transactionId, amount, paymentStatus } = body;
        console.log({ shippingAddress, paymentMethod, transactionId, amount, paymentStatus })

        // Validate required fields
        if (!shippingAddress || !paymentMethod || !transactionId || !amount || !paymentStatus) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const url = new URL(`${apiBaseUrlV1}/orders/checkout`)

        const response = await fetchWithToken(url.toString(), {
            method: 'POST',
            body: JSON.stringify({
                shippingAddress,
                paymentMethod,
                transactionId,
                amount,
                paymentStatus,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || 'Failed to create order' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);


    } catch (error) {
        console.error('Error ', error);
        return NextResponse.json({ message: 'Server error.' }, { status: 500 });
    }
}