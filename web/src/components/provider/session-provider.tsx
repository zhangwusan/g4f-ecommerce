'use client';

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth"; // add this if you want correct typing

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

export default function NextAuthSessionProvider({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}