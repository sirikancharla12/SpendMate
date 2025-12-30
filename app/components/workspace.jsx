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

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/expenses");
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="flex flex-col gap-8 w-full">
            <Overviewboxes transactions={transactions} />

            {/* Charts section */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 w-full">
                    <SpendingActivty />
                </div>

                <div className="xl:col-span-1 w-full">
                    <RecentTransaction transactions={transactions} />
                </div>
            </div>
        </div>
    );
};

export default Workspace;
