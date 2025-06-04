import { apiBaseUrlV1, originalApiBaseUrl } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { ProfileResponse } from "@/lib/type/profile.interface";
import { resolveImageUrl } from "@/lib/xutils/image";
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest) {
    try {
        const url = new URL(`${apiBaseUrlV1}/auth/profile`)
        const response = await fetchWithToken(url.toString(), { method: 'GET' })

        if (!response.ok) {
            const error = await response.json();
            console.error('API error:', error);
            return NextResponse.json({ message: error?.message || 'Profile failed' }, { status: response.status });
        }

        const json = await response.json();
        const data: ProfileResponse = json.data;

        return NextResponse.json({
            data: {
                ...data,
                avatar: data.avatar ? resolveImageUrl(data.avatar, originalApiBaseUrl) : '',
            },
        })
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}