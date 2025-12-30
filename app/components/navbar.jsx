"use client";

import { useSession } from "next-auth/react";
import SidebarToggle from "./sidebaropen";

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
    const { data: session } = useSession();

    if (!session?.user) return null;

    const firstLetter =
        (session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center px-4 py-3  text-white h-14">

            {/* MENU BUTTON */}
            <SidebarToggle
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />


        </nav>
    );
}
