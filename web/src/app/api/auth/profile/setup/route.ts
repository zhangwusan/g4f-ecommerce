import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(`${apiBaseUrlV1}/auth/profile/setup`)
        const response = await fetchWithToken(url.toString(), { method: 'GET' })

        if (!response.ok) {
            const error = await response.json();
            console.error('API error:', error);
            return NextResponse.json({ message: error?.message || 'Profile failed' }, { status: response.status });
        }

        const { data } = await response.json();
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}