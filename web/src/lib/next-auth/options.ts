import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "../fetch/refresh-token";
import { apiBaseUrlV1 } from "../constants/env";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" },
        token: { label: "Temp Token", type: "text" },
      },
      authorize: async (credentials): Promise<any> => {
        if (!credentials?.email || !credentials.password) {
          throw new Error("MissingCredentials");
        }

        const { email, password, code, token } = credentials;
        let response;

        if (password === "__from_google__" || password === "__from_credentials__") {
          response = await fetch(`${apiBaseUrlV1}/auth/2fa/verify-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code }),
          });
        } else {
          response = await fetch(`${apiBaseUrlV1}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Authentication failed");

        if (data.requires2FA && data.tempToken) {
          throw new Error(`2FA_REQUIRED::${data.tempToken}::${email}`);
        }
        return {
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          avatar: data.user.avatar,
          role: data.user.role,
          role_name: data.user.role_name,
          is_2fa: data.user.is_2fa,
          is_2fa_verified: data.user.is_2fa_verified,
          access_token: data.token.access,
          refresh_token: data.token.refresh,
          access_expires_in: data.access_expires_in?.toString(),
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email_verified) {
          return false; // or return "/unauthorized" if using redirect
        }

        const body = {
          sub: profile.sub,
          username: user.name,
          email: user.email,
          avatar: user.image,
          first_name: profile.given_name ?? "",
          last_name: profile.family_name ?? "",
        }

        try {
          const res = await fetch(`${apiBaseUrlV1}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          console.log("Res : ", res)

          if (!res.ok) {
            console.error("Failed to sync with backend:");
            return false;
          }

          const data = await res.json();

          console.log(data)

          if (data.requires2FA && data.tempToken) {
            console.log("2FA required for Google user");
            // ⚠️ Must use redirect flow if you return a URL
            return `/auth/2fa?token=${data.tempToken}&email=${user.email}&provider=google`;
          }

          if (account) {
            (account as any).backendUser = data.user;
            (account as any).backendToken = data.token;
            (account as any).accessExpiresIn = data.access_expires_in;
          }

          return true;
        } catch (error) {
          console.error("Error in Google signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // First time login
      if (account?.provider === "google" && (account as any).backendUser) {
        const backendUser = (account as any).backendUser;
        const backendToken = (account as any).backendToken;
        const accessExpiresIn = (account as any).accessExpiresIn;

        token.id = backendUser.id;
        token.email = backendUser.email;
        token.username = backendUser.username;
        token.avatar = backendUser.avatar;
        token.role = backendUser.role;
        token.role_name = backendUser.role_name;
        token.is_2fa = backendUser.is_2fa;
        token.is_2fa_verified = backendUser.is_2fa_verified;
        token.access_token = backendToken.access;
        token.refresh_token = backendToken.refresh;
        token.access_expires_in = accessExpiresIn
          ? new Date(accessExpiresIn).getTime()
          : Date.now() + 60 * 60 * 1000;
      } else if (user) {
        // For CredentialsProvider login
        token.id = user.id as number;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.role = user.role;
        token.role_name = user.role_name;
        token.is_2fa = user.is_2fa;
        token.is_2fa_verified = user.is_2fa_verified;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.access_expires_in = user.access_expires_in
          ? new Date(user.access_expires_in).getTime()
          : Date.now() + 60 * 60 * 1000;
      }

      // If token is still valid, return it
      if (token.access_expires_in && Date.now() < token.access_expires_in) {
        return token;
      }

      // Otherwise, refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
        session.user.role_name = token.role_name;
        session.user.is_2fa = token.is_2fa;
        session.user.is_2fa_verified = token.is_2fa_verified;
        session.user.access_token = token.access_token;
        session.user.refresh_token = token.refresh_token;
        session.user.access_expires_in = token.access_expires_in?.toString();
      }

      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },

  debug: false,
};