import { useEffect, useState } from "react";
import Expenses from "./expensescomponent";
import Overview from "./greetinguser";
import Overviewboxes from "./overviewboxes";
import axios from "axios";
import ChartComponent from "./Chartcomponent";
import Mostexpenses from "./Mostexpenses";
import MostIncome from "./MostIncome";

const Workspace = () => {
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
    <div className="p-2  display flex  w-full">
     <div className="w-3/5">
     <div className=" w-full">
        <Overviewboxes transactions={transactions}/>
      </div>
      <div className="w-full ">
      <h2>Sales Over Time</h2>
        <ChartComponent transactions={transactions}/> 
      </div>
     </div>
   <div className="">
   <div >
    Subcriptions
      </div>
      <div>
        <Mostexpenses transactions={transactions}/> 
      </div>
      <div>
      <MostIncome transactions={transactions}/>
      </div>
   </div>
    </div>
  );
};

export default Workspace;
