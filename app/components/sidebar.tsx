"use client";

import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const router = useRouter();

  return (
    <>
      {/* Small Screens (Horizontal Navbar) */}
      <div className="fixed top-[60px] left-0 w-full bg-[#181C3B] p-2  flex justify-around items-center text-white sm:hidden z-50">
        <button 
          onClick={() => router.push("/users")} 
          className="px-3 py-2 rounded-md hover:bg-slate-950 transition-all duration-200 ease-in-out"
        >
          Home
        </button>
        <button 
          onClick={() => router.push("/expenses")} 
          className="px-3 py-2 rounded-md hover:bg-slate-950 transition-all duration-200 ease-in-out"
        >
           Transactions
        </button>
        <button 
          onClick={() => router.push("/savings")} 
          className="px-3 py-2 rounded-md hover:bg-slate-950 transition-all duration-200 ease-in-out"
        >
           Savings
        </button>
        <button 
          onClick={() => router.push("/settings")} 
          className="px-3 py-2 rounded-md hover:bg-slate-950 transition-all duration-200 ease-in-out"
        >
           Settings
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div
        className={`absolute top-[64px] left-0 h-[calc(100vh-64px)] bg-[#181C3B] text-white transition-all duration-300 overflow-hidden ${
          isOpen ? "w-64 px-6 py-6" : "w-0 px-0 py-0"
        }`}
      >
        {isOpen && (
          <nav className="flex flex-col space-y-4 w-full">
            <button 
              onClick={() => router.push("/users")} 
              className="px-4 py-3 rounded-md font-semibold hover:bg-slate-950 transition-all duration-200 ease-in-out"
            >
              Home
            </button>
            <button 
              onClick={() => router.push("/expenses")} 
              className="px-4 py-3 rounded-md font-semibold hover:bg-slate-950 transition-all duration-200 ease-in-out"
            >
              Transactions
            </button>
            <button 
              onClick={() => router.push("/savings")} 
              className="px-4 py-3 rounded-md font-semibold hover:bg-slate-950 transition-all duration-200 ease-in-out"
            >
              Savings
            </button>
            <button 
              onClick={() => router.push("/settings")} 
              className="px-4 py-3 rounded-md font-semibold hover:bg-slate-950 transition-all duration-200 ease-in-out"
            >
              Settings
            </button>
          </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;
