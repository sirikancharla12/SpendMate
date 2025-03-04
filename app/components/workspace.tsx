import { useEffect, useState } from "react";
import Expenses from "./expensescomponent";
import Overview from "./greetinguser";
import Overviewboxes from "./overviewboxes";
import axios from "axios";
import ChartComponent from "./Chartcomponent";
import Mostexpenses from "./Mostexpenses";
import MostIncome from "./MostIncome";
import Savings from "./Savings";
import ExpensesChart from "./Chartcomponent";


interface WorkspaceProps {
  isSidebarOpen: boolean;
}
const Workspace = ({ isSidebarOpen }: WorkspaceProps)  => {
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
    <div className=" p-4 flex flex-col lg:flex-row w-full gap-4">
      {/* Left Section - Overview & Charts */}
      <div className="w-full lg:w-3/5">
        <div className="w-full">
          <Overviewboxes transactions={transactions} />
        </div>
        <div className="w-full">
          <h2 className="text-lg font-bold mt-4">Sales Over Time</h2>
          <ExpensesChart transactions={transactions} />
        </div>
      </div>

      <div className="w-full lg:w-2/5  flex flex-col gap-4 mt-4 lg:mt-0">
       
        <div>
          <Mostexpenses transactions={transactions} />
        </div>
        <div>
          <MostIncome transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
