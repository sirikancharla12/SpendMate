"use client";

import { useSession } from "next-auth/react";
import { Download } from "lucide-react";
import Image from "next/image";
import Workspace from "app/components/workspace";

const UserPage = () => {
    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {session.user.name?.split(' ')[0] || "User"}. Here's your financial overview.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium border border-border">
                        <span className="text-muted-foreground uppercase text-xs">Period</span>
                        <span className="text-foreground">This Month</span>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Content Workspace */}
            <Workspace />
        </div>
    );
};

export default UserPage;
