"use client"; // Mark this as a Client Component

import { SessionProvider } from "next-auth/react"; // Ensure this is imported
import "./globals.css";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<body>
<Head>
<link rel="icon" type="image/png" href="/favicon.PNG" />
<title>My App</title>
  </Head>      
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
