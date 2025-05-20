import { apiBaseUrlV1, originalApiBaseUrl } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { ChangeInfomationRequest, ProfileResponse } from "@/lib/type/profile.interface";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const body: ProfileResponse = await req.json()
        const data_request: ChangeInfomationRequest = {
            first_name: body.first_name,
            last_name: body.last_name,
            username: body.username,
            phone: body.phone_number,
            address: body.address,
            bio: body.bio
        }
        const url = new URL(`${apiBaseUrlV1}/auth/profile/change-infomation`)
        const response = await fetchWithToken(url.toString(), {
            method: 'PATCH',
            body: JSON.stringify(data_request)
        })

        if (!response.ok) {
            const error = await response.json();
            console.error('API error:', error);
            return NextResponse.json({ message: error?.message || 'Profile failed' }, { status: response.status });
        }

        const { data } = await response.json();
        return NextResponse.json({
            data: {
                ...data,
                avatar: originalApiBaseUrl + data.avatar,
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}