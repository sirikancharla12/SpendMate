"use client"; // Ensure the component is treated as a client-side component

import Greeting from "app/components/greetinguser";
import Navbar from "app/components/navbar";
import Sidebar from "app/components/sidebar";
import Workspace from "app/components/workspace";
import { useSession } from "next-auth/react";

const UserPage = () => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="display flex ">
<div className="w-1/5">
 <Sidebar />
    
    </div>
    <hr className="line bg-white w-0.5 h-screen" />


<div className="flex-1">
    
<div className=" ">

<Navbar /> 
    
    </div> 
    <hr className="line bg-white w-full h-0.5" />

   <Workspace/>

    </div>    
    </div>
  );
};

export default UserPage;
