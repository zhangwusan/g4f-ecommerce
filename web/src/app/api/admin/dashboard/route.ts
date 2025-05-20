import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { DashboardResponse } from "@/lib/type/dashboad.interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await fetchWithToken(`${apiBaseUrlV1}/dashboard`, {
            method: 'GET',
        });

        if(!response.ok) {
            const error = await response.json();
            console.log(error)
            return NextResponse.json({ error: error || 'Error fetching...'})
        }

        const { data }: { data: DashboardResponse } = await response.json();

        return NextResponse.json(data);

    } catch (error) {
        console.error(error);
        // Return an error response
        return NextResponse.json({ error: 'An error occurred while get data statistic' }, { status: 500 });
    }
}