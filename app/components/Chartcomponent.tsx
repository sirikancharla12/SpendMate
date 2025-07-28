

"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { ChartOptions, Filler } from "chart.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
  date: string;
}

interface ExpensesChartProps {
  transactions: Transaction[];
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ transactions }) => {
  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const currentDate = new Date();
    let startDate = new Date();
    let labels: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    if (selectedFilter === "This Month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      startDate = new Date(year, month, 1);
      const lastDate = new Date(year, month + 1, 0).getDate();

      // Initialize data with 0 for every day
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
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.4)",
          fill: false,
          tension: 0.4,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.4)",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  }, [selectedFilter, transactions]);

  const options: ChartOptions<'line'> =  {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        
        ticks: {
          color: "#4B5563",
          font: {
            family: "Inter, sans-serif",
            // weight: "500",
          },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#4B5563",
          font: {
            family: "Inter, sans-serif",
            // weight: "500",
          },
        },
        grid: { display: false },
      },
    },
  };

  return (
  <div className="h-[300px] w-full ">
      <div className="flex gap-4 mb-4">
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 hover:shadow-lg focus:ring-0 text-white rounded transition-all" onClick={() => setSelectedFilter("This Month")}>
          This Month
        </button>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 hover:shadow-lg focus:ring-0 text-white rounded transition-all" onClick={() => setSelectedFilter("Last 6 Months")}>
          Last 6 Months
        </button>
        <button 
  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 hover:shadow-lg focus:ring-0 text-white rounded transition-all"
  onClick={() => setSelectedFilter("This Year")}
>
  This Year
</button>

      </div>

      {!chartData ? (
      <p className="text-gray-400 text-lg">Loading...</p>
    ) : (
      <div className="w-full h-[300px]">
        <Line data={chartData} options={options}/>
      </div>
    )}
  </div>
  );
};

export default ExpensesChart;
