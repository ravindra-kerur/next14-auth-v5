import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Auth v5 Demo",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className + " bg-sky-500"}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}

// https://www.youtube.com/watch?v=1MTyCvS05V4&t=9796s
// https://github.com/Hombre2014/nextjs-14-auth-v5-tutorial/blob/main/middleware.ts
