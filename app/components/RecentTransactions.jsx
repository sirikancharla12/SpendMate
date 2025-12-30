"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

export default function RecentTransaction({ transactions }) {
    const sortedTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5); // Get last 5

    const getIcon = (type) => {
        return type === "Income" ? (
            <div className="bg-fintech-green/10 p-2 rounded-full text-fintech-green">
                <ArrowDownLeft size={16} />
            </div>
        ) : (
            <div className="bg-fintech-red/10 p-2 rounded-full text-fintech-red">
                <ArrowUpRight size={16} />
            </div>
        );
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold tracking-tight">Recent Transactions</h2>
                <p className="text-sm text-muted-foreground">Your latest financial activities</p>
            </div>

            <div className="p-6 flex-1">
                {sortedTransactions.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">No recent transactions found.</p>
                ) : (
                    <ul className="space-y-4">
                        {sortedTransactions.map((txn) => (
                            <li key={txn.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    {getIcon(txn.type)}
                                    <div>
                                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                            {txn.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(txn.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={clsx(
                                        "text-sm font-semibold",
                                        txn.type === "Income" ? "text-fintech-green" : "text-fintech-red"
                                    )}>
                                        {txn.type === "Income" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                                    </p>
                                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full inline-block mt-1">
                                        {txn.category}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
