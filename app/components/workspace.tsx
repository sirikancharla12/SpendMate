

import { useEffect, useState } from "react";
import axios from "axios";

import Overviewboxes from "./overviewboxes";
import ExpensesChart from "./Chartcomponent";
import MostIncome from "./MostIncome";
import RecentTransaction from "./RecentTransactions";

interface WorkspaceProps {
  isSidebarOpen: boolean;
}

const Workspace = ({ isSidebarOpen }: WorkspaceProps) => {
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
    <div className="p-4 w-full flex flex-col gap-4 ">
      {/* Overview Boxes at the top */}
      <Overviewboxes transactions={transactions} />

      {/* Charts section */}
      <div className="flex flex-col lg:flex-row gap-6 ">
  <div className="w-full lg:w-2/3 bg-[#fcfdff] p-6 pb-6 md:pb-15  rounded-lg shadow-md">
  
    <h2 className="text-black text-xl font-semibold mb-2">Monthly Expenses</h2>
    <p className="text-gray-500 mb-4 text-sm">Your spending pattern over the last 6 months</p>
    <ExpensesChart transactions={transactions} />
  </div>

        <div className="w-full lg:w-1/2">
         <RecentTransaction transactions={transactions} />
          {/* <h2 className="text-lg font-bold mb-2">Most Income</h2> */}
          {/* <MostIncome transactions={transactions} /> */}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
