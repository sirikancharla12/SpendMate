"use client";

import { useState } from "react";
import Navbar from "app/components/navbar";
import Sidebar from "app/components/sidebar";
import { useSession } from "next-auth/react";
import { format, lastDayOfMonth, startOfMonth } from "date-fns";
import { useRouter } from "next/navigation";

export default function BudgetPage() {
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const start = startOfMonth(new Date());
    const end = lastDayOfMonth(new Date());
    const router = useRouter();
    if (!session || !session.user) {
        return null;
    }

    return (

        <div className="flex flex-col h-screen bg-[#101622]">

            <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />


            <div className="flex flex-1 flex-col sm:flex-row overflow-hidden ">
                <div
                    className={`absolute left-0 h-[calc(100vh-64px)] bg-[#101622] transition-all duration-300 overflow-hidden ${isSidebarOpen ? "w-64" : "w-0"
                        }`}
                >
                    <Sidebar isOpen={isSidebarOpen} />
                </div>


                <div
                    className={`sm:overflow-hidden overflow-auto  flex-1 flex flex-col p-4 transition-all duration-300 ${isSidebarOpen ? "sm:ml-64 ml-0" : "sm:ml-0 "
                        } mt-[60px] sm:mt-0`}>

                    <div className="px-4  flex flex-col pl-10 md:flex-row md:items-center md:justify-between  gap-4">
                        <div className="px-2">
                            <h1 className="text-2xl  font-semibold text-white">
                                Budget
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Manage your monthly spending limits and track progess.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Current Period */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161d2f] border border-gray-700 text-sm text-gray-300">
                                <span className="uppercase text-xs text-gray-400">Current Period</span>
                                <span className="text-white font-medium">{format(start, "d MMM")}-{format(end, "d MMM")}</span>
                            </div>

                            {/* Export Button */}
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161d2f] border border-gray-700 text-sm text-white hover:bg-[#1e2740] transition"
                                onClick={() => {
                                    console.log("navigating");
                                    router.push("/Budget/new");
                                }}

                            >

                                Create Budget
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
