"use client";
import React, { useState, useEffect } from "react";
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


const doughnutCenterText = {
    id: "doughnutCenterText",
    afterDraw(chart) {
        const { ctx, chartArea, data } = chart;
        const activeElements = chart.getActiveElements();

        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        if (!activeElements.length) {
            const total = data.datasets[0].data.reduce(
                (sum, val) => sum + val,
                0
            );

            ctx.font = "500 14px Inter";
            ctx.fillStyle = "#9ca3af";
            ctx.fillText("Total", centerX, centerY - 10);

            ctx.font = "700 20px Inter";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`₹${total}`, centerX, centerY + 14);

            ctx.restore();
            return;
        }

        const { index, datasetIndex } = activeElements[0];
        const label = data.labels[index];
        const value = data.datasets[datasetIndex].data[index];

        ctx.font = "500 14px Inter";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(label, centerX, centerY - 10);

        ctx.font = "700 20px Inter";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`₹${value}`, centerX, centerY + 14);

        ctx.restore();
    },
};

const ExpensesChart = ({ transactions }) => {
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
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.25)",
                    fill: true,
                    tension: 0.45,
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    label: "Expenses",
                    data: expenseData,
                    borderColor: "rgba(59,130,246,0.4)",
                    backgroundColor: "rgba(59,130,246,0.15)",
                    fill: true,
                    tension: 0.45,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    borderWidth: 2,
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
                backgroundColor: "#0f172a",
                titleColor: "#e5e7eb",
                bodyColor: "#ffffff",
                borderColor: "#334155",
                borderWidth: 1,
                displayColors: false,
                padding: 10,
                callbacks: {
                    label: (ctx) => `₹${ctx.parsed.y}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                },
                grid: { display: false },
            },
            y: {
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    callback: (v) => `₹${v}`,
                },
                grid: {
                    color: "rgba(255,255,255,0.06)",
                },
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
                    "#6366f1",
                    "#60a5fa",
                ],
                borderColor: "#0f172a",
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
            tooltip: {
                enabled: false,
            },
            legend: {
                position: "bottom",
                labels: {
                    color: "#9ca3af",
                    font: { size: 12 },
                },
            },
        },
    };





    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">

            <div className="lg:col-span-2 bg-[#161d2f] border border-[#1f2a44] p-6 rounded-xl shadow-md">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <h2 className="text-white text-xl font-semibold">
                            Monthly Expenses
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Your spending pattern over the last 6 months
                        </p>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                        <button
                            className="px-2.5 py-1 text-xs rounded-md bg-[#3b82f6] text-white"
                            onClick={() => setSelectedFilter("This Month")}
                        >
                            This Month
                        </button>
                        <button
                            className="px-2.5 py-1 text-xs rounded-md bg-[#101622] border border-[#1f2a44] text-gray-400"
                            onClick={() => setSelectedFilter("Last 6 Months")}
                        >
                            Last 6 Months
                        </button>
                        <button
                            className="px-2.5 py-1 text-xs rounded-md bg-[#101622] border border-[#1f2a44] text-gray-400"
                            onClick={() => setSelectedFilter("This Year")}
                        >
                            This Year
                        </button>
                    </div>
                </div>

                <div className="h-[300px]">
                    {chartData ? (
                        <Line data={chartData} options={options} />
                    ) : (
                        <p className="text-gray-400 text-sm">Loading chart...</p>
                    )}
                </div>

            </div>

            <div className="bg-[#161d2f] border border-[#1f2a44] p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                <h3 className="text-white text-sm font-medium mb-4">
                    Expense Breakdown
                </h3>

                <div className="w-[300px] h-[300px]">
                    <Doughnut
                        data={doughnutData}
                        options={doughnutOptions}
                        plugins={[doughnutCenterText]}
                    />

                </div>
            </div>

        </div>
    );
}

export default ExpensesChart;
