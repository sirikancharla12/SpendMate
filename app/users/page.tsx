


"use client";

import { useState } from "react";
import Navbar from "app/components/navbar";
import Sidebar from "app/components/sidebar";
import Workspace from "app/components/workspace";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Fixed Navbar */}
      <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

      {/* Scrollable Content Area */}
      <div className="flex-1 flex overflow-hidden pt-[64px] sm:pt-[70px]">
        {/* Sidebar */}
        <div
          className={`fixed top-[64px] sm:top-[70px] left-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-70px)] bg-[#181C3B] transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        <div
          className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${
            isSidebarOpen ? "sm:ml-64 ml-0" : "sm:ml-0"
          }`}
          style={{ maxHeight: "calc(100vh - 70px)" }} 
        >
          <Workspace isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
