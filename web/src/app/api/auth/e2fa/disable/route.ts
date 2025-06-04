import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetchWithToken(`${apiBaseUrlV1}/auth/2fa/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error:', errorResponse);
      return NextResponse.json({ message: errorResponse?.message || 'Registration failed' }, { status: response.status });
    }

    const data = await response.json()

    return NextResponse.json({ data: data, message: '2FA disable successfully' }, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}