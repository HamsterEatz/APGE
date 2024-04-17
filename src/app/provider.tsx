"use client";
import {SessionProvider} from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export default function Providers({ session, children}: {session: any, children: React.ReactNode}) {
   useEffect(() => {
    getUserWhitelist();
  }, [session]);

  const router = useRouter();
  
  async function getUserWhitelist() {
    if (session) {
      const res = await fetch('/api/whitelist', {
        method: 'GET'
      });
      const data = await res.json();
      if (!data) {
        throw new Error('Unable to get whitelisted users');
      }
      const users = data.users;
      const currentUserEmail = session.user?.email;
      const ownerEmail = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
      if (currentUserEmail && !(currentUserEmail === ownerEmail || users.find((v: any) => v === currentUserEmail))) {
        router.replace('/api/auth/signout');
      }
    }
  }

  return <SessionProvider>{children}</SessionProvider>;
}