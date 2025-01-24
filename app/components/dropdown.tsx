import React, { useState } from "react";

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

const MultiLevelDropdown = ({ transactions, setTransactions }: ExpensesProps) => {
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isOrderByDropdownOpen, setIsOrderByDropdownOpen] = useState(false);
  const [isDateByDropdownOpen, setIsDateByDropdownOpen] = useState(false);

  const toggleMainDropdown = () => setIsMainDropdownOpen(!isMainDropdownOpen);
  const toggleOrderByDropdown = () =>
    setIsOrderByDropdownOpen(!isOrderByDropdownOpen);
  const toggleDateByDropdown = () =>
    setIsDateByDropdownOpen(!isDateByDropdownOpen);

  const filtertonew = () => {
    setTransactions((newTransactions) =>
      [...newTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };
  
  const filtertoold = () => {
    setTransactions((newTransactions) =>
      [...newTransactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
  };

  return (
    <div className="relative">
      {/* Main Dropdown Button */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={toggleMainDropdown}
      >
        Filters
      </button>

      {/* Main Dropdown Menu */}
      {isMainDropdownOpen && (
        <div className="absolute mt-2 w-50 bg-white shadow-lg border rounded-lg">
          {/* Order By Section */}
          <div className="relative group">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleOrderByDropdown}
            >
              Order 
            </button>
            {isOrderByDropdownOpen && (
              <div className="absolute left-full top-0 mt-0 ml-1 w-48 bg-white shadow-lg border rounded-lg group-hover:block">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={filtertonew}
                >
                  Newest
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={filtertoold}
                >
                  Oldest
                </button>
              </div>
            )}
          </div>

          {/* Date By Section */}
          <div className="relative group">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleDateByDropdown}
            >
              Date 
            </button>
            {isDateByDropdownOpen && (
              <div className="absolute left-full top-0 mt-0 ml-1 w-48 bg-white shadow-lg border rounded-lg group-hover:block">
                <button
                  className="block w-50 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => console.log("By Month")}
                >
                  By Month
                </button>
                <button
                  className="block w-50 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => console.log("By 6 Months")}
                >
                  By 6 Months
                </button>
                <button
                  className="block w-50 text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => console.log("Yearly")}
                >
                  Yearly
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiLevelDropdown;
