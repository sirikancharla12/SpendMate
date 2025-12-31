"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Doughnut, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Filler } from "chart.js";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SpendingActivity = ({ transactions = [] }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [doughnutData, setDoughnutData] = useState({
        labels: [],
        datasets: [],
    });
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // --- Line Chart Logic (Weeks) ---
        const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
        const incomeData = [0, 0, 0, 0, 0];
        const expenseData = [0, 0, 0, 0, 0];

        // --- Doughnut Logic (Categories) ---
        const categoryTotals = {};
        let totalExp = 0;

        const filteredTransactions = transactions.filter((transaction) => {
            const date = new Date(transaction.date);
            return date.getFullYear() === year && date.getMonth() === month;
        });

        filteredTransactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            const day = date.getDate();
            const amount = Number(transaction.amount) || 0;
            const type = transaction.type ? transaction.type.toLowerCase() : "expense";

            // Determine week index (0-based)
            let weekIndex = Math.floor((day - 1) / 7);
            if (weekIndex > 4) weekIndex = 4;

            if (type === "income") {
                incomeData[weekIndex] += amount;
            } else {
                expenseData[weekIndex] += amount;

                // Aggregate for Doughnut
                const cat = transaction.category || "Uncategorized";
                categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
                totalExp += amount;
            }
        });

        setTotalExpense(totalExp);

        setChartData({
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    borderColor: "#10b981", // Fintech Green
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 2,
                },
                {
                    label: "Expenses",
                    data: expenseData,
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 2,
                },
            ],
        });

        // --- Prepare Doughnut Data ---
        // Sort descending
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a);

        // Take top 3
        const top3 = sortedCategories.slice(0, 3);
        const others = sortedCategories.slice(3);

        const dLabels = top3.map(([cat]) => cat.charAt(0).toUpperCase() + cat.slice(1));
        const dValues = top3.map(([, amt]) => amt);

        if (others.length > 0) {
            const othersTotal = others.reduce((sum, [, amt]) => sum + amt, 0);
            dLabels.push("Others");
            dValues.push(othersTotal);
        }

        if (dValues.length === 0) {
            setDoughnutData({
                labels: ["No Expenses"],
                datasets: [{
                    data: [1],
                    backgroundColor: ["#e2e8f0"],
                    borderColor: isDark ? "#1e293b" : "#ffffff",
                    borderWidth: 2,
                }]
            });
        } else {
            setDoughnutData({
                labels: dLabels,
                datasets: [
                    {
                        data: dValues,
                        backgroundColor: [
                            "#3b82f6", 
                            "#10b981", 
                            "#f59e0b", 
                            "#6366f1", 
                        ],
                        borderColor: isDark ? "#1e293b" : "#ffffff",
                        borderWidth: 2,
                        hoverOffset: 6,
                    },
                ],
            });
        }

    }, [transactions, isDark]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                titleColor: isDark ? "#f8fafc" : "#0f172a",
                bodyColor: isDark ? "#cbd5e1" : "#334155",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: isDark ? "#9ca3af" : "#64748b",
                    font: { size: 11 },
                },
                grid: { display: false },
            },
            y: {
                ticks: {
                    color: isDark ? "#9ca3af" : "#64748b",
                    font: { size: 11 },
                    callback: (v) => `₹${v}`,
                },
                grid: {
                    color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    borderDash: [4, 4],
                },
                border: { display: false }
            },
        },
    };

   

 

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-3 bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Spending Activity
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Weekly Overview
                        </p>
                    </div>
                </div>

                <div className="h-[300px]">
                    <Line data={chartData} options={options} key={theme} />
                </div>
            </div>

        
        </div>
    );
}

export default SpendingActivity;
