"use client";

import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BudgetPage() {
    const router = useRouter();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Fetch budgets
    const getBudgetItems = async () => {
        try {
            const res = await axios.get("/api/budget");
            setBudgets(res.data || []);
        } catch (err) {
            console.error("Failed to fetch budgets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBudgetItems();
    }, []);

    // 🔹 Calculations
    const totalBudget = budgets.reduce(
        (sum, b) => sum + b.spendinglimit,
        0
    );

    const totalSpent = budgets.reduce(
        (sum, b) => sum + (b.spent || 0),
        0
    );

    const remaining = totalBudget - totalSpent;

    if (loading) {
        return <p className="text-gray-400 p-6">Loading budgets...</p>;
    }

    return (
        <div className="p-6 text-white">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Budgets</h1>
                <p className="text-sm text-gray-400">
                    Manage your monthly spending limits and track progress.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <SummaryCard title="Total Budget" value={`₹${totalBudget}`} />
                <SummaryCard title="Total Spent" value={`₹${totalSpent}`} />
                <SummaryCard title="Remaining" value={`₹${remaining}`} highlight />
            </div>

            {/* Budget Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {budgets.map((b) => {
                    const spent = b.spent || 0;
                    const percent = Math.min(
                        (spent / b.spendinglimit) * 100,
                        100
                    );

                    return (
                        <div
                            key={b.id || b.category}
                            className="bg-[#161d2f] border border-gray-700 rounded-xl p-5"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">{b.category}</h3>
                                <span className="text-xs text-gray-400">
                                    ₹{spent} / ₹{b.spendinglimit}
                                </span>
                            </div>

                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                {Math.round(percent)}% spent
                            </p>
                        </div>
                    );
                })}

                {/* Create New Budget */}
                <div
                    onClick={() => router.push("/Budget/new")}
                    className="flex items-center justify-center border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-blue-500 cursor-pointer transition"
                >
                    <div className="flex flex-col items-center gap-2 py-10">
                        <Plus />
                        <span className="text-sm">Create New Category</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- Summary Card ---------- */

function SummaryCard({
    title,
    value,
    highlight,
}) {
    return (
        <div
            className={`rounded-xl border border-gray-700 p-5 ${highlight ? "bg-[#0f172a]" : "bg-[#161d2f]"
                }`}
        >
            <p className="text-sm text-gray-400">{title}</p>
            <h2 className="text-2xl font-semibold mt-1">{value}</h2>
        </div>
    );
}
