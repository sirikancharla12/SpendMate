"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, BarChart3, Wallet, Settings, Home } from "lucide-react";
import clsx from "clsx";

const Sidebar = ({ isOpen }) => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", path: "/home", icon: LayoutDashboard },
        { label: "Transactions", path: "/expenses", icon: Receipt },
        { label: "Analytics", path: "/analytics", icon: BarChart3 },
        { label: "Budgets", path: "/Budget", icon: Wallet },
        { label: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside
                className={clsx(
                    "fixed top-16 left-0 h-[calc(100vh-64px)] bg-background/50 backdrop-blur-sm border-r border-border",
                    "hidden md:block w-64 transition-all duration-300 z-40"
                )}
            >
                <nav className="flex flex-col gap-2 p-4 h-full">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* MOBILE SIDEBAR (Slide Over) */}
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                aria-hidden="true"
            />

            <aside
                className={clsx(
                    "fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-background border-r border-border shadow-xl z-50 transition-transform duration-300 md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <nav className="flex flex-col gap-2 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
