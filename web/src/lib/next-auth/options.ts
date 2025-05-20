import { apiBaseUrlV1 } from "@/lib/constants/env";
import { LoginResponse } from "@/lib/type/login.interface";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "../fetch/refresh-token";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password", placeholder: "Your password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("MissingCredentials"); // ⚡ Custom error
        }

        const { email, password } = credentials;
        const response = await fetch(`${apiBaseUrlV1}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const errorResponse = await response.json();
          if (errorResponse.error === "InvalidCredentials") {
            throw new Error("InvalidCredentials"); // ⚡ Custom error
          }
          throw new Error("An error occurred while logging in");
        }

        const data: LoginResponse = await response.json();
        const { user, token, access_expires_in } = data;
        console.log("Data : ", data)

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          access_token: token.access,
          refresh_token: token.refresh,
          access_expires_in: access_expires_in
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.role = user.role;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.access_expires_in = user.access_expires_in ? new Date(user.access_expires_in).getTime() : null;
      }

      if (token.access_expires_in && Date.now() < token.access_expires_in) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
        session.user.role = token.role as number;
        session.user.access_token = token.access_token as string;
        session.user.refresh_token = token.refresh_token as string;
        session.user.access_expires_in = token.access_expires_in?.toString();
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },

  debug: false
};