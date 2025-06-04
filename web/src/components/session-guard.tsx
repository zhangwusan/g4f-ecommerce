'use client';
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/login" }); // Clears cookie and redirects
    }
  }, [session]);

  return <>{children}</>;
}