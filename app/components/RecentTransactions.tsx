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
       <svg viewBox="0 0 24 24" width={30} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.25 4.00003C10.25 3.69074 10.0602 3.41317 9.77191 3.30105C9.48366 3.18892 9.15614 3.26524 8.94715 3.49324L3.44715 9.49324C3.24617 9.71248 3.19374 10.0298 3.3135 10.302C3.43327 10.5743 3.70259 10.75 4.00002 10.75H20C20.4142 10.75 20.75 10.4142 20.75 10C20.75 9.58582 20.4142 9.25003 20 9.25003L10.25 9.25003V4.00003Z" fill="#6e87d8"></path> <path opacity="0.5" d="M13.75 20L13.75 14.75H4C3.58579 14.75 3.25 14.4142 3.25 14C3.25 13.5858 3.58579 13.25 4 13.25L20 13.25C20.2974 13.25 20.5667 13.4258 20.6865 13.698C20.8063 13.9703 20.7538 14.2875 20.5529 14.5068L15.0529 20.5068C14.8439 20.7348 14.5164 20.8111 14.2281 20.699C13.9399 20.5869 13.75 20.3093 13.75 20Z" fill="#6e87d8"></path> </g></svg>
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
