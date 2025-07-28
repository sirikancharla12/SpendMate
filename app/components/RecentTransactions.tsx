// "use client";

// import React from "react";

// interface Transaction {
//   id: string;
//   description: string;
//   amount: number;
//   category: string;
//   type: "Income" | "Expense";
//   date: string;
//   userId: string;
// }

// interface RecentTransactionProps {
//   transactions: Transaction[];
// }

// export default function RecentTransaction({ transactions }: RecentTransactionProps) {
//   const sortedTransactions = [...transactions]
//     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//     .slice(0, 5); // Get last 5 transactions

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-lg text-black font-semibold mb-4">Recent Transactions</h2>
//       {sortedTransactions.length === 0 ? (
//         <p>No recent transactions found.</p>
//       ) : (
        
//         <ul className="space-y-2">
          
//           {sortedTransactions.map((txn) => (
//             <li
//               key={txn.id}
//               className={`flex justify-between items-center p-2 rounded ${
//                 txn.type === "Income" ? "bg-green-100" : "bg-red-100"
//               }`}
//             >
//               <div>
//                 <p className="font-medium">{txn.description}</p>
//                 <p className="text-sm text-gray-600">{txn.category} • {new Date(txn.date).toLocaleDateString()}</p>
//               </div>
//               <span className="font-semibold">
//                 {txn.type === "Income" ? "+" : "-"}₹{txn.amount}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"; // Optional: You can replace icons

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
  date: string;
  userId: string;
}

interface RecentTransactionProps {
  transactions: Transaction[];
}

export default function RecentTransaction({ transactions }: RecentTransactionProps) {
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Get last 5

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "bg-gray-100 text-gray-700",
      Income: "bg-green-100 text-green-700",
      Entertainment: "bg-purple-100 text-purple-700",
      Transportation: "bg-blue-100 text-blue-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const getIcon = (type: "Income" | "Expense") => {
    return type === "Income" ? (
      <div className="bg-green-100 p-2 rounded-full text-green-600">
        <ArrowDownLeft size={16} />
      </div>
    ) : (
      <div className="bg-orange-100 p-2 rounded-full text-orange-600">
        <ArrowUpRight size={16} />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 011 1v1a7 7 0 105.546 11.032 1 1 0 011.415 1.415A9 9 0 119 2z"></path>
        </svg>
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">Your latest financial activities</p>

      {sortedTransactions.length === 0 ? (
        <p className="text-gray-500">No recent transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {sortedTransactions.map((txn) => (
            <li key={txn.id} className="flex items-center bg-[#f9fbfd] p-2 rounded justify-between">
              <div className="flex items-center gap-3">
                {getIcon(txn.type)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                  <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(txn.category)}`}>
                  {txn.category}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    txn.type === "Income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "Income" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
