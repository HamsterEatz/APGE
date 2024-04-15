import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Calendar",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}</>
  );
}
