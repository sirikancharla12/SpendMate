"use client";

import React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinnaker } from "next/font/google";

interface User {
  image?: string | null;
  name?: string | null;
  email?: string;
}




const ProfileCard: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
        <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const user: User = session?.user || { name: "Guest", email: "No email provided" };
  const userName = user.name || "U";
  const firstLetter = userName.charAt(0).toUpperCase();
  const isValidImage = user.image && user.image.trim() !== "";

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-80 p-4 flex flex-col items-center justify-center shadow-lg rounded-2xl bg-white">
        <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-300 mb-4 bg-gray-200 text-gray-700 text-3xl font-bold">
          {firstLetter}
        </div>
        <h2 className="text-xl font-semibold text-gray-700">{user.name}</h2>
        <p className="text-gray-500 mb-4">{user.email}</p>
        <button onClick={() => router.push("/")} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 p-2 rounded text-white">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
