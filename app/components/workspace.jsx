
import { useEffect, useState } from "react";
import axios from "axios";

import Overviewboxes from "./overviewboxes";
import ExpensesChart from "./Chartcomponent";
import MostIncome from "./MostIncome";
import RecentTransaction from "./RecentTransactions";
import SpendingActivty from "./SpendingActivity";

const Workspace = ({ isSidebarOpen }) => {
    const [transactions, setTransactions] = useState([]);
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
        <div className="p-4 w-full flex flex-col gap-4  bg-[#101622]">
            <Overviewboxes transactions={transactions} />

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                <div className="lg:col-span-3 w-full h-auto   ">
                    <SpendingActivty />
                    {/* <ExpensesChart transactions={transactions} /> */}
                </div>

                <div className="lg:col-span-1 w-full">
                    <RecentTransaction transactions={transactions} />
                </div>

            </div>


        </div>


    );
};

export default Workspace;
