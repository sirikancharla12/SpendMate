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

const ExpensesChart = ({ transactions }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [selectedFilter, setSelectedFilter] = useState("This Month");
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    // State for Doughnut Chart
    const [doughnutData, setDoughnutData] = useState({
        labels: [],
        datasets: [],
    });
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const currentDate = new Date();
        let startDate = new Date();
        let labels = [];
        let incomeData = [];
        let expenseData = [];

        // Logic to determine filtered date range
        if (selectedFilter === "This Month") {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            startDate = new Date(year, month, 1);
            const lastDate = new Date(year, month + 1, 0).getDate();

            labels = Array.from({ length: lastDate }, (_, i) => (i + 1).toString());
            incomeData = new Array(lastDate).fill(0);
            expenseData = new Array(lastDate).fill(0);
        }
        else if (selectedFilter === "Last 6 Months") {
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
            labels = Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(currentDate.getMonth() - 5 + i);
                return `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
            });
            incomeData = Array(6).fill(0);
            expenseData = Array(6).fill(0);
        }
        else if (selectedFilter === "This Year") {
            const year = currentDate.getFullYear();
            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            incomeData = new Array(12).fill(0);
            expenseData = new Array(12).fill(0);
        }

        // Filter Transactions based on the selected time range
        const filteredTransactions = transactions.filter((transaction) => {
            const date = new Date(transaction.date);
            if (selectedFilter === "This Month") {
                return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth();
            } else if (selectedFilter === "Last 6 Months") {
                return date >= startDate && date <= currentDate;
            } else if (selectedFilter === "This Year") {
                return date.getFullYear() === currentDate.getFullYear();
            }
            return false;
        });

        // --- Doughnut Aggregation Logic ---
        const categoryTotals = {};
        let totalExp = 0;

        console.log("Processing transactions:", filteredTransactions.length);

        filteredTransactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            const amount = Number(transaction.amount) || 0;
            // Normalize type - API puts "Income" (PascalCase), checks were 'Income'. 
            // Robust check: .toLowerCase() === 'income'
            // Ensure transaction.type exists
            const type = transaction.type ? transaction.type.toLowerCase() : "expense";

            // Populate Line Chart Data (Expense/Income)
            if (selectedFilter === "This Month") {
                const day = date.getDate() - 1;
                if (type === "income") incomeData[day] += amount;
                else expenseData[day] += amount;
            } else if (selectedFilter === "Last 6 Months") {
                const label = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
                const index = labels.indexOf(label);
                if (index !== -1) {
                    if (type === "income") incomeData[index] += amount;
                    else expenseData[index] += amount;
                }
            } else if (selectedFilter === "This Year") {
                const monthIndex = date.getMonth();
                if (type === "income") incomeData[monthIndex] += amount;
                else expenseData[monthIndex] += amount;
            }

            // Populate Doughnut Data (Expenses Only)
            if (type !== "income") {
                const cat = transaction.category || "Uncategorized";
                categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
                totalExp += amount;
            }
        });

        console.log("Calculated Total Expense:", totalExp);

        setTotalExpense(totalExp);

        // Update Line Chart State
        setChartData({
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    borderColor: "#10b981",
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

        // Update Doughnut Chart State (Top 3 + Others)
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a);

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
                            "#3b82f6", // Blue
                            "#10b981", // Green
                            "#f59e0b", // Yellow
                            "#6366f1", // Indigo
                        ],
                        borderColor: isDark ? "#1e293b" : "#ffffff",
                        borderWidth: 2,
                        hoverOffset: 6,
                    },
                ],
            });
        }

    }, [selectedFilter, transactions, isDark]);

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

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            tooltip: { enabled: true },
            legend: {
                position: "bottom",
                labels: {
                    color: isDark ? "#9ca3af" : "#64748b",
                    font: { size: 12 },
                    usePointStyle: true,
                },
            },
        },
    };

    const doughnutCenterText = {
        id: "doughnutCenterText",
        afterDraw(chart) {
            const { ctx, chartArea } = chart;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "500 12px sans-serif";
            ctx.fillStyle = isDark ? "#9ca3af" : "#64748b";
            ctx.fillText("Total", centerX, centerY - 10);
            ctx.font = "700 16px sans-serif";
            ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
            ctx.fillText(`₹${totalExpense.toLocaleString()}`, centerX, centerY + 10);
            ctx.restore();
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            Monthly Cash Flow
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Income vs Expenses
                        </p>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0 p-1 bg-secondary rounded-lg">
                        {["This Month", "Last 6 Months", "This Year"].map(filter => (
                            <button
                                key={filter}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedFilter === filter
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                                onClick={() => setSelectedFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px]">
                    <Line data={chartData} options={options} key={theme} />
                </div>
            </div>

            <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-sm font-medium mb-6 text-foreground">
                    Expense Breakdown
                </h3>

                <div className="w-[240px] h-[240px] relative">
                    <Doughnut
                        data={doughnutData}
                        options={doughnutOptions}
                        plugins={[doughnutCenterText]}
                        key={`${theme}-doughnut-${totalExpense}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default ExpensesChart;
