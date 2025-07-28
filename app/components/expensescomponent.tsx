


"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import Transactions from "./dropdown";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
  date: string;
  userId: string;
}

interface TransactionData {
  description: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
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
    type: "Income",
    date: "",
  });
  const [id, setId] = useState<string | null>(null);
  const [searchitem, setsearchitem] = useState("");
  const [filteredtransactions, setfilteredtransactions] = useState(transactions);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    type: "Income",
      date: "",
    });
    setErrorMessage(null);
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
      // type  : transactionData.transactionType,
      type: transactionData.type,
      date: transactionData.date,
    };


    try {
      if (editingTransactionId) {
        const response = await axios.put(`/api/expenses/${editingTransactionId}`, requestData);
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction.id === editingTransactionId ? response.data : transaction
          )
        );
      } else {
        const response = await axios.post("/api/expenses", requestData);
        setTransactions((prevTransactions) => [...prevTransactions, response.data]);
      }
      closeForm();
    } catch (error) {
      setErrorMessage("There was an error processing your request");
    } finally {
      setIsSubmitting(false);
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

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setsearchitem(e.target.value);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionData({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
    setEditingTransactionId(transaction.id);
    setFormVisible(true);
  };
  

  

  return (
    <div>
      <div className="flex justify-between p-2 flex-col">
        <div className="flex justify-between">
          <div className="py-2 font-semibold text-purple-400 text-2xl">Transaction History</div>
          <button
            type="button"
            className="text-white bg-purple-600 font-semibold hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
            onClick={toggleVisibility}
          >
            Add
          </button>
        </div>
        <Transactions transactions={transactions} setTransactions={setTransactions}  
        />
      </div>

      {isFormVisible && (
 
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
  <div className="p-6 w-3/4 max-w-lg bg-white rounded-lg shadow-lg text-black relative my-10 max-h-screen overflow-y-auto">

            <h3 className="text-xl font-semibold mb-4 text-center text-purple-600">
              {editingTransactionId ? "Edit Transaction" : "Add New Transaction"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-purple-600">Transaction Name</label>
                <input
                  type="text"
                  name="description"
                  value={transactionData.description}
                  onChange={handleChange}
                  placeholder="Enter transaction name"
                  className="block w-full p-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-purple-600">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="block w-full p-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-purple-600">Category</label>
                <select
                  name="category"
                  value={transactionData.category}
                  onChange={handleChange}
                  className="block w-full p-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                  <option value="savings">Savings</option>
                  <option value="education">Education</option>
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
                <label className="block mb-1 font-semibold text-purple-600">Transaction Type</label>
                <select
                  name="type"
                  value={transactionData.type}
                  onChange={handleChange}
                  className="block w-full p-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-purple-600">Date</label>
                <input
                  type="date"
                  name="date"
                  value={transactionData.date}
                  onChange={handleChange}
                  className="block w-full p-2 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded ${
                    isSubmitting ? "bg-gray-400" : "bg-purple-600"
                  } text-white hover:bg-purple-700`}
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
