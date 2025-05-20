import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      avatar: string;
      role: number;
      access_token?: string;
      refresh_token?: string;
      access_expires_in?: string;
    };
  }

  interface User {
    id: number;
    username: string;
    email: string;
    avatar: string;
    role: number;
    access_token?: string;
    refresh_token?: string;
    access_expires_in?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    email: string;
    avatar: string;
    role: number;
    access_token?: string;
    refresh_token?: string;
    access_expires_in?: number | null;
  }
}