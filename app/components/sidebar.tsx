"use client";

import { useRouter } from "next/navigation";

// import { useRouter } from "next/router";  // Correct import for routing

const Sidebar = () => {
  const router = useRouter(); 

  return (
    <div className="bg-neutral-900 h-full p-10 flex flex-col justify-center items-center">
      <button className="m-2" onClick={() => router.push("/users")}> {/* Fixed typo here */}
        Home
      </button>
      <button className="m-2" onClick={() => router.push("/expenses")}>
        Transactions
      </button>
      <button className="m-2" onClick={() => router.push("/settings")}>
        Settings
      </button>
    </div>
  );
};

export default Sidebar;
