


import React, { useState, useEffect, useRef } from "react";
import { format, startOfMonth, subMonths, startOfYear } from "date-fns";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
  date: string;
  userId: string
}

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions,  }) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const originalTransactionsRef = useRef<Transaction[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");

  const clearFilters = () => {
    setSearchItem("");
    setFilterType("");
    setFilterCategory("");
    setFilterDateRange("");
  };

  // useEffect(() => {
  //   setFilteredTransactions(transactions);
  //   originalTransactionsRef.current = transactions;
  // }, [transactions]);
  useEffect(() => {
    setFilteredTransactions(transactions);
    if (originalTransactionsRef.current.length === 0) {
      originalTransactionsRef.current = transactions;
    }
  }, [transactions]);
  
  const filterTransactions = () => {
    let updatedTransactions = originalTransactionsRef.current;
    if (searchItem) {
      updatedTransactions = updatedTransactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchItem.toLowerCase())
      );
    }
    if (filterType) {
      updatedTransactions = updatedTransactions.filter((transaction) => transaction.type === filterType);
    }
    if (filterCategory) {
      updatedTransactions = updatedTransactions.filter(
        (transaction) => transaction.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }
    if (filterDateRange) {
      const today = new Date();
      let startDate: Date = new Date(0);
      if (filterDateRange === "monthly") startDate = startOfMonth(today);
      if (filterDateRange === "6months") startDate = subMonths(today, 6);
      if (filterDateRange === "yearly") startDate = startOfYear(today);
      updatedTransactions = updatedTransactions.filter((transaction) => new Date(transaction.date) >= startDate);
    }
    setFilteredTransactions(updatedTransactions);
  };

  useEffect(() => {
    filterTransactions();
  }, [searchItem, filterType, filterCategory, filterDateRange]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Transaction>({
    id: "",
    description: "",
    amount: 0,
    category: "",
    type: "Income",
    date: "",
    userId:""
  });

  const startEditing = (id: string) => {
    const transactionToEdit = transactions.find((t) => t.id === id);
    if (transactionToEdit) {
      setEditingRowId(id);
      setEditValues(transactionToEdit);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

 
  const prepareDateForDB = (date: string) => {
    return new Date(date).toISOString();
  };
  
  const saveEdit = async () => {
    try {
      const updatedTransaction = {
        ...editValues,
        type: editValues.type || "Expense", 
        date: prepareDateForDB(editValues.date),
      };
  
      console.log("Sending payload:", updatedTransaction);
  
      const response = await fetch(`http://localhost:3000/api/expenses/${editingRowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === editingRowId ? updatedTransaction : transaction
        )
      );
setEditingRowId(null);  
      console.log("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };
  
  
  
  const cancelEdit = () => {
    setEditingRowId(null);
  };



  const deleteAction = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
  
      // If successful, update the state
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  
  

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap md:flex-nowrap gap-3 justify-center items-center w-full px-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-64 md:w-72 p-2 border rounded-md text-purple-600 
                     focus:border-purple-600 focus:ring-2 focus:ring-purple-300 
                     transition-all duration-300 ease-in-out transform focus:scale-105 outline-none"
          onChange={(e) => setSearchItem(e.target.value)}
          value={searchItem}
        />
        <select className="border p-2 rounded-md text-purple-600 sm:w-36 md:w-44" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select className="border p-2 rounded-md text-purple-600 sm:w-36 md:w-44" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <select className="border p-2 rounded-md text-purple-600 sm:w-36 md:w-44" value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)}>
          <option value="">All Time</option>
          <option value="monthly">This Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="yearly">This Year</option>
        </select>
        <button onClick={clearFilters} className="bg-red-500 text-white font-semibold px-4 py-2 rounded">
          Clear 
        </button>
      </div>

      

      <div className="mt-4">
  {filteredTransactions.length === 0 ? (
<div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl shadow-sm border border-purple-300">
  <h2 className="text-lg font-medium text-purple-400 mb-2 italic tracking-wide">
    Oops! Your wallet looks too quiet
  </h2>
  <p className="text-sm text-gray-500">
    Start by adding your first expense 
  </p>
</div>


  ) : (
    <div className="overflow-y-auto max-h-40">
      <table className="w-full table-auto table-fixed border-separate border-spacing-y-2 text-xs sm:text-sm md:text-base">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="p-2 w-1/4">Transaction</th>
            <th className="p-2 w-1/4">Amount</th>
            <th className="p-2 w-1/4">Category</th>
            <th className="p-2 w-1/4">Type</th>
            <th className="p-2 w-1/4">Date</th>
            <th className="p-2 w-1/4">Action</th>
          </tr>
        </thead>
        <tbody>
      {filteredTransactions.map((transaction) => (
        editingRowId === transaction.id ? (
          <tr
            key={transaction.id}
            className="text-center hover:bg-purple-300 transition duration-200"
          >
            <td className="p-2">
              <input
                type="text"
                name="description"
                value={editValues.description}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-md text-purple-600"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                name="amount"
                value={editValues.amount}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-md text-purple-600"
              />
            </td>
            <td className="p-2">
              <input
                type="text"
                name="category"
                value={editValues.category}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-md text-purple-600"
              />
            </td>
            <td className="p-2">
              <select
                name="type"
                value={editValues.type}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-md text-purple-600"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </td>
            <td className="p-2">
              <input
                type="date"
                name="date"
                value={editValues.date}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-md text-purple-600"
              />
            </td>
            <td className="p-2 flex justify-around space-x-2">
              <button onClick={saveEdit}>
                <img src="/correct.svg" alt="Save Edit" className="w-8 h-8 sm:w-8 sm:h-8" />
              </button>
              <button onClick={cancelEdit}>
                <img src="/x.svg" alt="Cancel Edit" className="w-8 h-8 sm:w-8 sm:h-8" />
              </button>
            </td>
          </tr>
        ) : (
          <tr
            key={transaction.id}
            className="text-center hover:bg-purple-300 transition duration-200"
          >
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.category}</td>
            <td>{transaction.type}</td>
            <td>{format(new Date(transaction.date), "dd-MM-yyyy")}</td>
            <td className="flex justify-around items-center">
              <button
                onClick={() => startEditing(transaction.id)}
                className="text-white px-2 py-2 rounded"
              >
                <img src="/editimggg.svg" alt="Edit" className="w-6 h-6 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => deleteAction(transaction.id)}
                className="text-white px-2 py-2 rounded"
              >
                <img src="/icons8-trash.svg" alt="Delete" className="w-6 h-6 sm:w-6 sm:h-6" />
              </button>
            </td>
          </tr>
        )
      ))}
        </tbody>
      </table>
    </div>
  )}
</div>

    </div>
  );
};

export default Transactions;
