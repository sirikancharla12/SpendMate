"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import Expenses from "app/components/expensescomponent";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/expenses");
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Transactions
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage your financial records.
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                <Expenses transactions={transactions} setTransactions={setTransactions} />
            </div>
        </div>
    );
};

export default Transactions;
