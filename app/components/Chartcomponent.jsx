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

    useEffect(() => {
        const currentDate = new Date();
        let startDate = new Date();
        let labels = [];
        let incomeData = [];
        let expenseData = [];

        if (selectedFilter === "This Month") {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            startDate = new Date(year, month, 1);
            const lastDate = new Date(year, month + 1, 0).getDate();

            labels = Array.from({ length: lastDate }, (_, i) => (i + 1).toString());
            incomeData = new Array(lastDate).fill(0);
            expenseData = new Array(lastDate).fill(0);

            const filteredTransactions = transactions.filter((transaction) => {
                const date = new Date(transaction.date);
                return date.getFullYear() === year && date.getMonth() === month;
            });

            filteredTransactions.forEach((transaction) => {
                const day = new Date(transaction.date).getDate() - 1;
                if (transaction.type === "Income") {
                    incomeData[day] += transaction.amount;
                } else {
                    expenseData[day] += transaction.amount;
                }
            });
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

            const filteredTransactions = transactions.filter((transaction) => {
                const date = new Date(transaction.date);
                return date >= startDate && date <= currentDate;
            });

            filteredTransactions.forEach((transaction) => {
                const date = new Date(transaction.date);
                const label = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
                const index = labels.indexOf(label);
                if (index !== -1) {
                    if (transaction.type === "Income") {
                        incomeData[index] += transaction.amount;
                    } else {
                        expenseData[index] += transaction.amount;
                    }
                }
            });
        }
        else if (selectedFilter === "This Year") {
            const year = currentDate.getFullYear();
            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            incomeData = new Array(12).fill(0);
            expenseData = new Array(12).fill(0);

            const filteredTransactions = transactions.filter((transaction) => {
                const date = new Date(transaction.date);
                return date.getFullYear() === year;
            });

            filteredTransactions.forEach((transaction) => {
                const monthIndex = new Date(transaction.date).getMonth();
                if (transaction.type === "Income") {
                    incomeData[monthIndex] += transaction.amount;
                } else {
                    expenseData[monthIndex] += transaction.amount;
                }
            });
        }

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
                    borderColor: "#ef4444", // Fintech Red
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 2,
                },
            ],
        });
    }, [selectedFilter, transactions]);

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

    const doughnutData = {
        labels: ["Food", "Travel", "Shopping"],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                ],
                borderColor: isDark ? "#1e293b" : "#ffffff",
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
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
            const { ctx, chartArea, data } = chart;
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
            ctx.fillText(`₹450`, centerX, centerY + 10); // Mock total for now
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
                        key={theme + "-doughnut"}
                    />
                </div>
            </div>
        </div>
    );
}

export default ExpensesChart;
