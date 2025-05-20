import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrlV1, originalApiBaseUrl } from '@/lib/constants/env';
import { fetchWithTokenFormData } from '@/lib/fetch/fetch-with-token';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // works with 'file'

    const res = await fetchWithTokenFormData(`${apiBaseUrlV1}/auth/profile/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ message: error.message || 'Upload failed' }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json({
        ...json,
        avatar: originalApiBaseUrl + json.avatar
    });
  } catch (err: any) {
    console.error('Proxy error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}