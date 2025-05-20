import { apiBaseUrlV1 } from '@/lib/constants/env';
import { fetchWithToken } from '@/lib/fetch/fetch-with-token';
import { CategorySetupResponse } from '@/lib/type/categories.interface';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(`${apiBaseUrlV1}/categories/setup`);
    const response = await fetchWithToken(url.toString(), { method: 'GET' });

    if (!response.ok) {
      const errorBody = await response.json();
      return NextResponse.json(
        { message: 'Failed to fetch category setup', error: errorBody },
        { status: response.status }
      );
    }

    const { data } : { data: CategorySetupResponse } = await response.json();

    return NextResponse.json({
      message: 'Fetched category setup successfully',
      data,
    });
  } catch (error) {
    console.error('Error fetching category setup:', error);
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}