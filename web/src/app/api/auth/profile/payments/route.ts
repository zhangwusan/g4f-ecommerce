import { apiBaseUrlV1 } from "@/lib/constants/env";
import { fetchWithToken } from "@/lib/fetch/fetch-with-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Extract query params: page & limit (optional)
        const { searchParams } = req.nextUrl;
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";

        // Construct external API URL with query params
        const url = new URL(`${apiBaseUrlV1}/payment/get-transaction`);
        url.searchParams.set("page", page);
        url.searchParams.set("limit", limit);

        // Perform fetch with token
        const response = await fetchWithToken(url.toString(), { method: "GET" });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error("API error:", error);
            return NextResponse.json(
                { message: error?.message || "Failed to fetch payment history" },
                { status: response.status }
            );
        }

        // Parse and return response
        const { data, pagination } = await response.json();
        return NextResponse.json({ data, pagination });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}