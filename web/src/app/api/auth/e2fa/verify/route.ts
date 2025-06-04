import { apiBaseUrlV1 } from "@/lib/constants/env";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${apiBaseUrlV1}/auth/2fa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.token}`
      },
      body: JSON.stringify({ code: body.code })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error:', errorResponse);
      return NextResponse.json({ message: errorResponse?.message || 'Registration failed' }, { status: response.status });
    }

    const data = await response.json()

    return NextResponse.json({ data: data, message: '2FA verify successfully' }, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}