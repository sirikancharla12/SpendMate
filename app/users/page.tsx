


"use client";

import { useState } from "react";
import Navbar from "app/components/navbar";
import Sidebar from "app/components/sidebar";
import Workspace from "app/components/workspace";
import { useSession } from "next-auth/react";
import Image from "next/image"; // Import Image component

const UserPage = () => {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show an image while loading
  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image 
          src="/girlloading.gif" // Replace with your actual image path
          alt="Loading..."
          width={500} 
          height={500}
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 flex-col sm:flex-row overflow-hidden mt-[64px] sm:mt-[70px]">
        <div
          className={`absolute top-[64px] left-0 h-[calc(100vh-64px)] bg-[#181C3B] transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        <div
          className={`sm:overflow-hidden overflow-auto flex-1 flex flex-col p-4 transition-all duration-300 ${
            isSidebarOpen ? "sm:ml-64 ml-0" : "sm:ml-0"
          } mt-[60px] sm:mt-0`}
        >
          <Workspace isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
