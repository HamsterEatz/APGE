"use client";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { session: any, children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}