"use client";

import { useSession } from "next-auth/react";
import SidebarToggle from "./sidebaropen";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
    const { data: session } = useSession();

    if (!session?.user) return null;

    const firstLetter =
        (session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 py-3 h-16 bg-background/80 backdrop-blur-md border-b border-border transition-colors">

            <div className="flex items-center gap-4">
                {/* MENU BUTTON (Mobile) */}
                <div className="md:hidden">
                    <SidebarToggle
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </div>

                {/* LOGO */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
                        SpendMate
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                {/* USER PROFILE */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground leading-none">
                            {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {session.user.email}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt="Profile"
                                width={36}
                                height={36}
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-secondary-foreground font-semibold">
                                {firstLetter}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
