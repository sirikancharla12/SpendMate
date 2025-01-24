"use client"; // Mark this as a Client Component

import { SessionProvider } from "next-auth/react"; // Ensure this is imported
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app with the SessionProvider */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
