import { JWT } from "next-auth/jwt";
import { apiBaseUrlV1 } from "../constants/env";

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = new URL(`${apiBaseUrlV1}/auth/refresh-token`);
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'x-refresh-token': `Refresh ${token.refresh_token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const refreshed = await response.json();

    return {
      ...token,
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token ?? token.refresh_token,
      access_expires_in: refreshed.expires_in
        ? new Date(refreshed.expires_in).getTime()
        : Date.now() + 60 * 60 * 1000, // fallback: 1h
    };
  } catch (error) {
    console.error("Error refreshing token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}