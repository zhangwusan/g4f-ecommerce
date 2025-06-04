import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const apiUrl = new URL(`${apiBaseUrlV1}/products/care-instructions/${id}`);

        const response = await fetchWithToken(apiUrl.toString(), {
            method: 'GET'
        })

        if (!response.ok) {
            const error = await response.json()
            console.log(error);
            return NextResponse.json({ error: error.message || 'Failed' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        console.error('Error : ', error)
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const apiUrl = new URL(`${apiBaseUrlV1}/products/care-instructions/${id}`);

        const response = await fetchWithToken(apiUrl.toString(), {
            method: 'PUT',
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const error = await response.json()
            console.log(error);
            return NextResponse.json({ error: error.message || 'Failed' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        console.error('Error : ', error)
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        const { id } = await context.params;
        const apiUrl = new URL(`${apiBaseUrlV1}/products/care-instructions/${id}`);

        const response = await fetchWithToken(apiUrl.toString(), {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error:', error);
            return NextResponse.json({ error: error.message || 'Failed' }, { status: response.status });
        }

        const { message } = await response.json();
        return NextResponse.json({ message }, { status: 200 });

    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}