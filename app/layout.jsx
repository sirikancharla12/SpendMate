"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import "./globals.css";

export default function RootLayout({
    children,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <html lang="en">
            <body className="">
                <SessionProvider>
                    {/* NAVBAR */}
                    <Navbar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />

                    {/* SIDEBAR */}
                    <Sidebar isOpen={isSidebarOpen} />

                    {/* PAGE CONTENT */}
                    <main className=" md:pl-64">
                        {children}
                    </main>
                </SessionProvider>
            </body>
        </html>
    );
}
