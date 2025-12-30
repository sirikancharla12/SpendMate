"use client";

import axios from "axios";
import { Plus, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function BudgetPage() {
    const router = useRouter();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const totalBudget = budgets.reduce((sum, b) => sum + b.spendinglimit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
    const remaining = totalBudget - totalSpent;
    const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Budgets
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track your spending limits and financial goals.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium shadow-sm">
                        Overall Status: <span className={remaining >= 0 ? "text-fintech-green" : "text-fintech-red"}>{remaining >= 0 ? "On Track" : "Over Budget"}</span>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Budget"
                    value={totalBudget}
                    icon={TrendingUp}
                    className="border-l-4 border-l-primary"
                />
                <SummaryCard
                    title="Total Spent"
                    value={totalSpent}
                    icon={AlertCircle}
                    className="border-l-4 border-l-fintech-red"
                />
                <SummaryCard
                    title="Remaining"
                    value={remaining}
                    icon={CheckCircle}
                    highlight
                    className="border-l-4 border-l-fintech-green"
                />
            </div>

            {/* Budget Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((b) => {
                    const spent = b.spent || 0;
                    const percent = Math.min((spent / b.spendinglimit) * 100, 100);
                    const isOverBudget = spent > b.spendinglimit;

                    return (
                        <div
                            key={b.id || b.category}
                            className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{b.category}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Monthly Limit</p>
                                </div>
                                <span className={clsx("text-xs font-medium px-2 py-1 rounded-full",
                                    isOverBudget ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                )}>
                                    {Math.round(percent)}%
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Spent</span>
                                    <span className="font-medium">₹{spent.toLocaleString()} <span className="text-muted-foreground">/ ₹{b.spendinglimit.toLocaleString()}</span></span>
                                </div>

                                <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full rounded-full transition-all duration-500",
                                            isOverBudget ? "bg-fintech-red" : "bg-primary"
                                        )}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Create New Budget Card */}
                <button
                    onClick={() => router.push("/Budget/new")}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[180px]"
                >
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3 text-foreground">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Create New Budget</span>
                </button>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, highlight, className, icon: Icon }) {
    return (
        <div className={clsx("bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm", className)}>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                    <Icon size={18} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
                ₹{value.toLocaleString()}
            </h2>
        </div>
    );
}
