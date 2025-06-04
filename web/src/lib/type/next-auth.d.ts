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
      role_name: string;
      is_2fa: boolean;
      is_2fa_verified?: boolean;
    };
    error?: string;
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
    role_name: string;
    is_2fa: boolean;
    is_2fa_verified?: boolean;
  }

  interface Profile extends DefaultProfile {
    sub: string;
    name: string;
    email: string;
    picture: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    email_verified?: boolean;
    user: User
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
    role_name: string;
    is_2fa: boolean;
    is_2fa_verified?: boolean;
    error?: string;
  }
}