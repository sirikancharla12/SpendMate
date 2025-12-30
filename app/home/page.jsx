"use client";

import { useState } from "react";
import Navbar from "app/components/navbar";
import Sidebar from "app/components/sidebar";
import Workspace from "app/components/workspace";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SidebarToggle from "app/components/sidebaropen";


const UserPage = () => {
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Image
                    src="/girlloading.gif"
                    alt="Loading..."
                    width={500}
                    height={500}
                    priority
                />
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden flex flex-col bg-[#101622] pl-4">
            {/* Fixed Navbar */}
            <Navbar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <Sidebar isOpen={isSidebarOpen} />


            <div
                className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${isSidebarOpen ? "sm:ml-64 ml-0" : "sm:ml-0"
                    }`}
            >

                <div className="px-4 flex flex-col  md:flex-row md:items-center md:justify-between  gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Good evening, {session.user.name || session.user.email}. Here is your financial summary.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Current Period */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161d2f] border border-gray-700 text-sm text-gray-300">
                            <span className="uppercase text-xs text-gray-400">Current Period</span>
                            <span className="text-white font-medium">Oct 1 – Oct 30, 2023</span>
                        </div>

                        {/* Export Button */}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161d2f] border border-gray-700 text-sm text-white hover:bg-[#1e2740] transition">
                            ⬇ Export Report
                        </button>

                    </div>

                </div>
                <Workspace isSidebarOpen={isSidebarOpen} />
            </div>
        </div>
    );
};

export default UserPage;
