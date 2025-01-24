"use client"

import { useEffect, useState } from "react";
// import Expenses from "./expensescomponent";
import axios from "axios";
import Expenses from "app/components/expensescomponent";
import Sidebar from "app/components/sidebar";
import Navbar from "app/components/navbar";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/expenses");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setErrorMessage("An error occurred while fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []); 

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
    
      <Expenses transactions={transactions} setTransactions={setTransactions} />

    
        </div>    
        </div>
      );
    
};

export default Transactions;
