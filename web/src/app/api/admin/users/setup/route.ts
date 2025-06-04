import { apiBaseUrlV1, originalApiBaseUrl } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { Pagination } from "@/lib/type/api-response.interface";
import { RoleDisplay, UserDisplayResponse } from "@/lib/type/user.interface";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {

    const apiUrl = `${apiBaseUrlV1}/users/setup`;

    const response = await fetchWithToken(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      return NextResponse.json({ error: error.message || 'Failed to fetch setup' }, { status: response.status });
    }

    const { data }: { data: RoleDisplay[]} = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching user data' }, { status: 500 });
  }
}