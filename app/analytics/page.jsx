"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsComp from "app/components/AnalyticsComp";

export default function Analysis() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get("/api/expenses");
                setTransactions(res.data);
            } catch (err) {
                console.error("Failed to fetch transactions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <p className="text-white p-6">Loading analytics...</p>;

    return (
        <div className="p-6">
            <AnalyticsComp transactions={transactions} />

        </div>
    );
}
