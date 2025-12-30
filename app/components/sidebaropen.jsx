"use client";

import { Menu } from "lucide-react";

export default function SidebarToggle({
    isSidebarOpen,
    setIsSidebarOpen,
}) {
    return (
        <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-black border"
        >
            <Menu size={22} />
        </button>
    );
}
