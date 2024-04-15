import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { getServerSession } from "next-auth";
import { isUserWhitelisted } from "./api/auth/auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]";
import momentTz from 'moment-timezone';

momentTz.tz.setDefault('Asia/Singapore');

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }

  if (session && !(await isUserWhitelisted(session))) {
    redirect('/api/auth/signout');
  }
  return (
    <html lang="en">
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}
