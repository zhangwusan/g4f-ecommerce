import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { ChangePasswordRequest } from "@/lib/type/profile.interface";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Change Password")
    const body: ChangePasswordRequest = await req.json();
    const url = new URL(`${apiBaseUrlV1}/auth/profile/password-change`);

    const response = await fetchWithToken(url.toString(), {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: result.message || 'Password change failed' }, { status: response.status });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}