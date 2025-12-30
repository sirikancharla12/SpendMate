"use client"

import { useEffect, useState } from "react";
// import Expenses from "./expensescomponent";
import axios from "axios";
import Expenses from "app/components/expensescomponent";
import Sidebar from "app/components/sidebar";
import Navbar from "app/components/navbar";
import OverviewBoxes from "app/components/overviewboxes";

const Transactions = () => {
    // const [transactions, setTransactions] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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
        <div className="flex flex-col h-screen bg-[#101622]">

            <Navbar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />


            <div className="flex flex-1 flex-col sm:flex-row overflow-hidden ">
                <div
                    className={`absolute left-0 h-[calc(100vh-64px)] bg-[#101622] transition-all duration-300 overflow-hidden ${isSidebarOpen ? "w-64" : "w-0"
                        }`}
                >
                    <Sidebar isOpen={isSidebarOpen} />
                </div>


                <div
                    className={`sm:overflow-hidden overflow-auto  flex-1 flex flex-col p-4 transition-all duration-300 ${isSidebarOpen ? "sm:ml-64 ml-0" : "sm:ml-0 "
                        } mt-[60px] sm:mt-0`}>
                    <Expenses transactions={transactions} setTransactions={setTransactions} />

                </div>
            </div>
        </div>
    );

};

export default Transactions;
