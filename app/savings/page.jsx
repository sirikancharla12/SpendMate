// "use client"

// import Expenses from "app/components/expensescomponent";
// import Navbar from "app/components/navbar";
// import SavingsTable from "app/components/savingstable";
// import Sidebar from "app/components/sidebar";
// import { useState } from "react";

// const SavingsPage=()=>{
//  const [isSidebarOpen, setIsSidebarOpen] = useState(false);   // return(
//     //     <div className="display flex ">
//     //     <div className="w-1/5">
//     //      <Sidebar isOpen={false} />
            
//     //         </div>
//     //         <hr className="line bg-white w-0.5 h-screen" />
        
        
//     //     <div className="flex-1">
            
//     //     <div className=" ">
//     // <Navbar setIsSidebarOpen={() => { } } isSidebarOpen={false} /> 
        
            
//     //         </div> 
//     //         <hr className="line bg-white w-full h-0.5" />
//     //         <SavingsTable/>
        
//     //       {/* <Expenses transactions={transactions} setTransactions={setTransactions} /> */}
    
        
//     //         </div>    
//     //         </div>
//     //       );
        
//     return (
//       <div className="flex flex-col h-screen">
     
//         <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
  
       
//         <div className="flex flex-1 flex-col sm:flex-row overflow-hidden mt-[64px] sm:mt-[70px]">
         
       
  
//   <div
//     className={`absolute top-[64px] left-0 h-[calc(100vh-64px)] bg-[#181C3B] transition-all duration-300 overflow-hidden ${
//       isSidebarOpen ? "w-64" : "w-0"
//     }`}
//   >
//     <Sidebar isOpen={isSidebarOpen} />
//   </div>
  
  
//   <div
//         className={`sm:overflow-hidden overflow-auto  flex-1 flex flex-col p-4 transition-all duration-300 ${
//           isSidebarOpen ? "sm:ml-64 ml-0" : "sm:ml-0 "
//         } mt-[60px] sm:mt-0`}>
// <SavingsTable/>
//       </div>
//         </div>
//       </div>
//     );
// }

// export default SavingsPage
