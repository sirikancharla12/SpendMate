"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { AlertProvider } from "./context/AlertContext"; // Import AlertContext
import AlertPopup from "./components/AlertPopup"; // Import AlertPopup

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
    children,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Define public routes where sidebar/navbar should be hidden
    const isPublicPage = pathname === "/" || pathname.startsWith("/auth/");

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontSans.variable} font-sans antialiased min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}>
                <SessionProvider>
                    <Providers>
                        <AlertProvider>
                            {!isPublicPage && (
                                <>
                                    {/* NAVBAR */}
                                    <Navbar
                                        isSidebarOpen={isSidebarOpen}
                                        setIsSidebarOpen={setIsSidebarOpen}
                                    />

                                    {/* SIDEBAR */}
                                    <Sidebar isOpen={isSidebarOpen} />
                                </>
                            )}

                            {/* PAGE CONTENT */}
                            <main
                                className={!isPublicPage ? `
                            transition-all duration-300 min-h-screen
                            pt-20 pb-8 px-4 md:px-8
                            ${isSidebarOpen ? "md:pl-[17rem]" : "md:pl-[17rem]"}
                          ` : "min-h-screen"}
                            >
                                {!isPublicPage ? (
                                    <div className="max-w-7xl mx-auto">
                                        {children}
                                    </div>
                                ) : (
                                    children
                                )}
                            </main>
                            <AlertPopup />
                        </AlertProvider>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
