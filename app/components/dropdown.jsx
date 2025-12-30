"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, startOfMonth, subMonths, startOfYear } from "date-fns";

const Transactions = ({
    transactions,
    setTransactions,
}) => {
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const originalTransactionsRef = useRef([]);
    const [searchItem, setSearchItem] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterDateRange, setFilterDateRange] = useState("");

    useEffect(() => {
        setFilteredTransactions(transactions);
        if (originalTransactionsRef.current.length === 0) {
            originalTransactionsRef.current = transactions;
        }
    }, [transactions]);

    useEffect(() => {
        let updated = originalTransactionsRef.current;

        if (searchItem) {
            updated = updated.filter((t) =>
                t.description.toLowerCase().includes(searchItem.toLowerCase())
            );
        }

        if (filterType) {
            updated = updated.filter((t) => t.type === filterType);
        }

        if (filterCategory) {
            updated = updated.filter(
                (t) => t.category.toLowerCase() === filterCategory.toLowerCase()
            );
        }

        if (filterDateRange) {
            const today = new Date();
            let startDate = new Date(0);
            if (filterDateRange === "monthly") startDate = startOfMonth(today);
            if (filterDateRange === "6months") startDate = subMonths(today, 6);
            if (filterDateRange === "yearly") startDate = startOfYear(today);

            updated = updated.filter((t) => new Date(t.date) >= startDate);
        }

        setFilteredTransactions(updated);
    }, [searchItem, filterType, filterCategory, filterDateRange]);

    const deleteAction = async (id) => {
        await fetch(`/api/expenses/${id}`, { method: "DELETE" });
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    return (

        <div>

            <div className="flex flex-wrap gap-3 items-center justify-between mb-6 bg-[#1c1f27] p-2 border border-gray-800 rounded-lg">
                <input
                    type="text"
                    placeholder="Search by merchant, category..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="bg-[#111318] border border-gray-700 text-sm text-gray-300 
                     px-4 py-2 rounded-lg w-full md:w-64 outline-none
                     focus:ring-2 focus:ring-blue-600"
                />

                <div className="flex gap-2">
                    <select
                        value={filterDateRange}
                        onChange={(e) => setFilterDateRange(e.target.value)}
                        className="bg-[#0f172a] border border-gray-700 text-gray-300 text-sm px-3 py-2 rounded-lg"
                    >
                        <option value="">Date Range</option>
                        <option value="monthly">This Month</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="yearly">This Year</option>
                    </select>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-[#0f172a] border border-gray-700 text-gray-300 text-sm px-3 py-2 rounded-lg"
                    >
                        <option value="">Category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Salary">Salary</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Investment">Investment</option>
                        <option value="Retirement">Retirement Benefits</option>
                        <option value="Savings">Savings</option>
                        <option value="Education">Education</option>
                        <option value="Business">Business</option>
                        <option value="Cashbacks">Cashbacks</option>
                        <option value="Housing">Housing</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Debt">Debt</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Subscriptions">Subscriptions</option>
                        <option value="Travel">Travel</option>
                        <option value="Pets">Pets</option>
                        <option value="Others">Others</option>

                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-[#0f172a] border border-gray-700 text-gray-300 text-sm px-3 py-2 rounded-lg"
                    >
                        <option value="">Status</option>
                        <option value="Income">Completed</option>
                        <option value="Expense">Pending</option>
                    </select>
                </div>
            </div>




            {/* TABLE */}
            {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    No transactions found
                </div>
            ) : (
                <div className="overflow-x-auto bg-[#1c1f27] rounded-xl border border-gray-800 ">

                    <table className="w-full text-sm text-gray-300 ">
                        <thead className="text-xs uppercase text-gray-500 border-b border-gray-800 bg-[#111318] ">
                            <tr className="">
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Category</th>
                                <th className="py-3 px-4 text-left">Merchant</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTransactions.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-gray-800  hover:bg-[#0f172a] transition"
                                >
                                    <td className="py-4 px-4">
                                        {format(new Date(t.date), "MMM dd, yyyy")}
                                    </td>

                                    <td className="py-4 px-4 font-medium text-white">
                                        {t.description}
                                    </td>

                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-900/40 text-blue-400">
                                            {t.category}
                                        </span>
                                    </td>

                                    <td className="py-4 px-4 ">
                                        <span
                                            className={`text-xs font-medium ${t.type === "Income"
                                                ? "text-green-400"
                                                : "text-yellow-400"
                                                }`}
                                        >
                                            ● {t.type === "Income" ? "Completed" : "Pending"}
                                        </span>
                                    </td>

                                    <td
                                        className={`py-4 px-4 text-right font-semibold ${t.type === "Income"
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {t.type === "Income" ? "+" : "-"}₹
                                        {t.amount.toLocaleString()}
                                    </td>

                                    <td className="py-4 px-4 text-right flex gap-3 justify-end">
                                        <button onClick={() => deleteAction(t.id)}>
                                            <img
                                                src="/icons8-trash.svg"
                                                className="w-4 h-4 opacity-70 hover:opacity-100"
                                            />
                                        </button>
                                    </td>

                                </tr>


                            ))}

                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-4 bg-[#111318] text-gray-500 text-sm"
                                >
                                    Showing results
                                    <span className="text-white ml-1">
                                        {filteredTransactions.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="text-white">
                                        {filteredTransactions.length}
                                    </span>
                                </td>

                                <td
                                    colSpan={2}
                                    className="px-4 py-4 bg-[#111318]"
                                >
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:bg-[#1c1f27]">
                                            Prev
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:bg-[#1c1f27]">
                                            Next
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            )}
        </div>

    );
};

export default Transactions;
