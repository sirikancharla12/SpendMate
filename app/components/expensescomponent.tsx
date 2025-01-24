    "use client";

    import { useState, useEffect, FormEvent } from "react";
    import axios from "axios";
    import { format } from "date-fns";
import DropdownMenu from "./dropdown";
import MultiLevelDropdown from "./dropdown";

    // Define types for transaction data and transaction item
    interface Transaction {
      id: string;
      description: string;
      amount: number;
      category: string;
      type: "Income" | "Expense";
      date: string;
    }

    interface TransactionData {
      description: string;
      amount: number;
      category: string;
      transactionType: "Income" | "Expense";
      date: string;
    }

    interface ExpensesProps {
      transactions: Transaction[];
      setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    }

    const Expenses = ({ transactions, setTransactions }: ExpensesProps) => {
      const [isFormVisible, setFormVisible] = useState(false);
      const [transactionData, setTransactionData] = useState<TransactionData>({
        description: "",
        amount: 0,
        category: "Choose...",
        transactionType: "Income",
        date: "",
      });
      const [id, setId] = useState<string | null>(null);
      const [searchitem,setsearchitem]=useState("");
      const [filteredtransactions,setfilteredtransactions]=useState(transactions)
      const [loading, setLoading] = useState(false);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
      const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added error message state

      const toggleVisibility = () => {
        setFormVisible(!isFormVisible);
      };

      const closeForm = () => {
        setFormVisible(false);
        setEditingTransactionId(null);
        setTransactionData({
          description: "",
          amount: 0,
          category: "Choose...",
          transactionType: "Income",
          date: "",
        });
        setErrorMessage(null); // Clear error on close
      };

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
        setTransactionData((prevData) => ({
          ...prevData,
          [name]: name === "amount" ? parseFloat(value) : value,
        }));
      };

      

      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
      
        console.log('Form submission triggered');
        console.log('Transaction data:', transactionData);
        console.log('Transaction ID:', id);  // Using id instead of editingTransactionId
      
        // Validate input fields
        if (isNaN(transactionData.amount) || transactionData.amount <= 0 || !transactionData.description || !transactionData.category || transactionData.category === "Choose..." || !transactionData.date) {
          setErrorMessage("Please fill all required fields correctly.");
          return;
        }
      
        setIsSubmitting(true);
        setErrorMessage(null);
      
        const requestData = {
          description: transactionData.description,
          amount: transactionData.amount,
          category: transactionData.category,
          transactionType: transactionData.transactionType,
          date: transactionData.date,
        };
      
        try {
          if (id) {
            const response = await axios.put(`/api/expenses/${id}`, requestData);
            console.log('Response from PUT request:', response.data);
            setTransactions((prevTransactions) =>
              prevTransactions.map((transaction) =>
                transaction.id === id ? response.data : transaction
              )
            );
          } else {
            const response = await axios.post("/api/expenses", requestData);
            setTransactions((prevTransactions) => [...prevTransactions, response.data]);
          }
          closeForm();
        } catch (error) {
          console.error('Error:', error);
          setErrorMessage('There was an error processing your request');
        } finally {
          setIsSubmitting(false);
        }
      };
      
      const editAction = async (id: string) => {
        console.log('Edit action triggered for ID:', id);
        const transactionToEdit = await transactions.find((transaction) => transaction.id === id);
        if (transactionToEdit) {
          console.log('Transaction found:', transactionToEdit);
          setId(id); 
          setTransactionData({
            description: transactionToEdit.description,
            amount: transactionToEdit.amount,
            category: transactionToEdit.category,
            transactionType: transactionToEdit.type,
            date: transactionToEdit.date,
          });
          setFormVisible(true);
        } else {
          console.log('Transaction to edit not found');
        }
      };
      

      const deleteAction = async (id: string) => {
        try {
          console.log('Attempting to delete transaction with ID:', id);
      
          const response = await axios.delete(`/api/expenses/${id}`);
      
          console.log('Response from backend:', response.data);
          
          setTransactions((prevTransactions) =>
            prevTransactions.filter((transaction) => transaction.id !== id)
          );
      
        } catch (error) {
          console.error('Error deleting transaction:', error);
          
          
      
          setErrorMessage("An error occurred while deleting the transaction.");
        }
      };
      


useEffect(() => {
  const searchedTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchitem.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchitem.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchitem.toLowerCase()) 
  );
  setfilteredtransactions(searchedTransactions);
}, [transactions, searchitem]);


// Search handler
const handleSearch = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  setsearchitem(e.target.value);
};

    

    

      return (
        <div>
          <div className="flex justify-between p-2">
            <div className="py-2 font-semibold">Transaction History</div>
            <div className="flex space-x-2">
            <div className="w-full max-w-sm min-w-[200px]">
  <div className="relative flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
      <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
    </svg>
 
    <input onChange={handleSearch} value={searchitem }
    className="w-full bg-transparent placeholder:text-slate-400 text-blue-600 text-sm border border-white-800 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
    placeholder="Search..." 
    />
    
   
  </div>
</div>
              <button
                className="px-4 py-2 text-white rounded hover:bg-orange-600 border border-black"
                onClick={toggleVisibility}
              >
                Add
              </button>
              <MultiLevelDropdown transactions={transactions} setTransactions={setTransactions}/>
              {/* <button
                className="px-4 py-2 text-white rounded hover:bg-blue-500 border border-black"
                onClick={filtertonew}
              >
                Newest
              </button>  <button
                className="px-4 py-2 text-white rounded hover:bg-blue-500 border border-black"
                onClick={filtertoold}
              >
                Oldest
              </button> */}
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center py-2">{errorMessage}</div>
          )}

          <table className="w-full px-2 border-collapse table-fixed">
            <thead>
              <tr>
                <th className="flex-1 text-center p-2">Transaction</th>
                <th className="flex-1 text-center p-2">Amount</th>
                <th className="flex-1 text-center p-2">Category</th>
                <th className="flex-1 text-center p-2">Type</th>
                <th className="flex-1 text-center p-2">Date</th>
                <th className="flex-1 text-center p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : (
               filteredtransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="text-center p-2">{transaction.description}</td>
                    <td className="text-center p-2">{transaction.amount}</td>
                    <td className="text-center p-2">{transaction.category}</td>
                    <td className="text-center p-2">{transaction.type}</td>
                    <td className="text-center p-2">
                      {format(new Date(transaction.date), "yyyy-MM-dd")}
                    </td>
                    <td className="text-center p-2 flex justify-around ">
                      <button onClick={() => editAction(transaction.id)}>
                        <img src="/editimggg.svg" alt="" className="w-7 h-7" />
                      </button>
                      <button onClick={() => deleteAction(transaction.id)}>
                        <img src="/delete.svg" alt="" className="w-7 h-7" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {isFormVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="p-6 w-3/4 max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-lg shadow-lg text-gray-100 relative">
                <h3 className="text-xl font-semibold mb-4">
                  {editingTransactionId ? "Edit Transaction" : "Add New Transaction"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1">Transaction Name</label>
                    <input
                      type="text"
                      name="description"
                      value={transactionData.description}
                      onChange={handleChange}
                      placeholder="Enter transaction name"
                      className="block w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={transactionData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      className="block w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Category</label>
                    <select
                      name="category"
                      value={transactionData.category}
                      onChange={handleChange}
                      className="block w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
              <option value="">Choose...</option>
<option value="food">Food</option>
<option value="shopping">Shopping</option>
<option value="salary">Salary</option>
<option value="entertainment">Entertainment</option>
<option value="groceries">Groceries</option>
<option value="freelance">Freelance</option>
<option value="investment">Investment</option>
<option value="retirement">Retirement Benefits</option>
<option value="business">Business</option>
<option value="cashbacks">Cashbacks</option>
<option value="housing">Housing</option>
<option value="transportation">Transportation</option>
<option value="healthcare">Healthcare</option>
<option value="debt">Debt</option>
<option value="utilities">Utilities</option>
<option value="subscriptions">Subscriptions</option>
<option value="travel">Travel</option>
<option value="pets">Pets</option>
<option value="others">Others</option>

                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Transaction Type</label>
                    <select
                      name="transactionType"
                      value={transactionData.transactionType}
                      onChange={handleChange}
                      className="block w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={transactionData.date}
                      onChange={handleChange}
                      className="block w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting} 
                      
                      className={`px-4 py-2 rounded ${
                        isSubmitting ? "bg-gray-400" : "bg-green-500"
                      } text-white`}
                    >
                      {isSubmitting ? "Saving..." : editingTransactionId ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    };

    export default Expenses;
