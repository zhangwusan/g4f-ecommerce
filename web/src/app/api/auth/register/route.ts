import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest } from '@/lib/type/register.interface';
import { apiBaseUrlV1 } from '@/lib/constants/env';


export async function POST(req: NextRequest) {
  try {
    const data: RegisterRequest = await req.json();
    const {
      email,
      password,
      username,
      first_name,
      last_name,
      phone_number,
      address,
      confirm_password,
    } = data;

    // Basic required field validation
    if (!email || !password || !username || !first_name || !last_name) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const response = await fetch(`${apiBaseUrlV1}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username,
        first_name,
        last_name,
        phone_number,
        address,
        confirm_password,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API error:', errorResponse);
      return NextResponse.json({ message: errorResponse?.message || 'Registration failed' }, { status: response.status });
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}