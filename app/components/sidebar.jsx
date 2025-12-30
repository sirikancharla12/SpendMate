"use client";

import { useRouter } from "next/navigation";

const Sidebar = ({ isOpen }) => {
    const router = useRouter();

    return (
        <>
            {/* MOBILE NAVBAR */}
            <div className="fixed top-14 left-0 w-full bg-[#111318] p-2 flex justify-around text-white sm:hidden z-50">
                <button onClick={() => router.push("/users")}>Home</button>
                <button onClick={() => router.push("/expenses")}>Transactions</button>
                <button onClick={() => router.push("/analytics")}>Analytics</button>
                <button onClick={() => router.push("/budget")}>Budget</button>
                <button onClick={() => router.push("/settings")}>Settings</button>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside
                className={`
          fixed  left-0 h-full bg-[#111318] border-r border-gray-800
          text-white z-40 transition-all duration-300
          w-64 hidden sm:block
        `}
            >
                <nav className="flex flex-col gap-2 p-6">
                    {[
                        ["Home", "/home"],
                        ["Transactions", "/expenses"],
                        ["Analytics", "/analytics"],
                        ["Budget", "/Budget"],
                        ["Settings", "/settings"],
                    ].map(([label, path]) => (
                        <button
                            key={path}
                            onClick={() => router.push(path)}
                            className="px-4 py-3 rounded-md hover:bg-slate-950 text-left"
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* MOBILE SLIDE-IN SIDEBAR */}
            <aside
                className={`
          fixed top-14 left-0 h-full bg-[#111318] border-r border-gray-800
          text-white z-40 transition-all duration-300 sm:hidden
          ${isOpen ? "w-64 p-6" : "w-0 p-0 overflow-hidden"}
        `}
            >
                <nav className="flex flex-col gap-2">
                    <button onClick={() => router.push("/users")}>Home</button>
                    <button onClick={() => router.push("/expenses")}>Transactions</button>
                    <button onClick={() => router.push("/analytics")}>Analytics</button>
                    <button onClick={() => router.push("/budget")}>Budget</button>
                    <button onClick={() => router.push("/settings")}>Settings</button>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
