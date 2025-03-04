import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Filler } from "chart.js";

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
  const [selectedFilter, setSelectedFilter] = useState<string>("This Month");
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const currentDate = new Date();
    let startDate = new Date();
    let labels: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    if (selectedFilter === "This Month") {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= lastDateOfMonth;
      });

      // Aggregate income and expenses for the month
      const dayData: { [key: string]: { income: number; expense: number } } = {};
      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const dayOfMonth = transactionDate.getDate().toString();

        if (!dayData[dayOfMonth]) {
          dayData[dayOfMonth] = { income: 0, expense: 0 };
        }

        if (transaction.type === "Income") {
          dayData[dayOfMonth].income += transaction.amount;
        } else {
          dayData[dayOfMonth].expense += transaction.amount;
        }
      });

      labels = Object.keys(dayData);
      incomeData = Object.values(dayData).map(data => data.income);
      expenseData = Object.values(dayData).map(data => data.expense);
    }

    else if (selectedFilter === "Last 6 Months") {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
      labels = Array.from({ length: 6 }, (_, i) => {
        let month = new Date();
        month.setMonth(currentDate.getMonth() - (5 - i));
        return `${month.toLocaleString("default", { month: "short" })} ${month.getFullYear()}`;
      });
      incomeData = Array(6).fill(0); // Initialize data array for 6 months
      expenseData = Array(6).fill(0); // Initialize data array for 6 months

      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= currentDate;
      });

      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthLabel = `${transactionDate.toLocaleString("default", { month: "short" })} ${transactionDate.getFullYear()}`;
        const index = labels.indexOf(monthLabel);
        if (index !== -1) {
          if (transaction.type === "Income") {
            incomeData[index] += transaction.amount;
          } else {
            expenseData[index] += transaction.amount;
          }
        }
      });
    }

    // This Year
    else if (selectedFilter === "This Year") {
      const currentYear = new Date().getFullYear(); // Get current year
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === currentYear;
      });

      console.log("Filtered Transactions for This Year:", filteredTransactions);

      incomeData = new Array(12).fill(0); // Initialize income data array for 12 months
      expenseData = new Array(12).fill(0); // Initialize expense data array for 12 months

      filteredTransactions.forEach((transaction) => {
        const monthIndex = new Date(transaction.date).getMonth(); // Get month index (0-indexed)
        if (transaction.type === "Income") {
          incomeData[monthIndex] += transaction.amount;
        } else if (transaction.type === "Expense") {
          expenseData[monthIndex] += transaction.amount;
        }
      });

      labels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#4caf50",
          backgroundColor: "rgba(0, 128, 0, 0.5)",
          fill: false,
          tension: 0.3,
        },
        {
          label: "Expenses",
          data: expenseData,
          borderColor: "#ea580c",
          backgroundColor: "rgba(234, 88, 12, 0.8)",
          fill: true,
          tension: 0.3,
        },
      ],
    });
  }, [selectedFilter, transactions]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.7)", // Light white color
          font: {
            weight: "normal" as const, // No bold effect
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.7)", // Light white text for X-axis
          font: {
            weight: "normal" as const, // No bold effect
            family: "Arial, sans-serif" as const, // Optional for consistency
          },
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.7)", // Light white text for Y-axis
          font: {
            weight: "normal" as const, // No bold effect
            family: "Arial, sans-serif",
          },
        },
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
        <Line data={chartData} options={options} />
      </div>
    )}
  </div>
);
};

export default ExpensesChart;
