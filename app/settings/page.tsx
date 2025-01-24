"use client"

import Navbar from "app/components/navbar";
import Sidebar from "app/components/sidebar";

const Settings=()=>{
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
    
Settings
    
        </div>    
        </div>
      );
    
};
  

export default Settings