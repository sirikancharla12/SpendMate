import { useEffect, useRef } from "react";
import { BarController, BarElement, Chart, Filler } from "chart.js";
import { LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";


Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale,Filler ,BarController,BarElement );

interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    type: "Income" | "Expense";
    date: string;
  }

  interface TransactionData {
    description: string;
    amount: number;
    category: string;
    transactionType: "Income" | "Expense";
    date: string;
  }

const MostIncome = ({ transactions }: { transactions: Transaction[] }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
  
    const incomelabels = ({ transactions }: { transactions: Transaction[] }) => {
      const incomeCategories = [
        "salary",
        "freelance",
        "investment",
        "retirement benefits",
        "business",
        "cashbacks",
        "rent",
        "healthcare",
        "debt",
        "utilities",
        "subscriptions",
        "travel",
        "pets",
        "others",
      ];
  
      const incomeData = incomeCategories.reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {} as { [key: string]: number });
  
      transactions.forEach((transaction) => {
        const category = transaction.category.toLowerCase();
        if (transaction.type === "Income" && incomeCategories.includes(category)) {
          incomeData[category] += transaction.amount;
        }
      });
      return incomeData;
    };
  
    const incomeData = incomelabels({ transactions: transactions || [] });
    const incomeCategories = Object.keys(incomeData);
    const incomeAmounts = incomeCategories.map((category) => incomeData[category]);
  
    useEffect(() => {
      if (chartRef.current) {
        const chartInstance = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: incomeCategories,
            datasets: [
              {
                label: "Income",
                data: incomeAmounts,
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                borderColor: "rgba(0, 123, 255, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            // indexAxis: "y",
            responsive: true,
            scales: {
              x: {
                beginAtZero: true,
                ticks: { color: "#ffffff" },
              },
              y: {
                beginAtZero: true,
                ticks: { color: "#ffffff" },
              },
            },
          },
        });
  
        return () => {
          if (chartInstance) {
            chartInstance.destroy();
          }
        };
      }
    }, [incomeCategories, incomeAmounts]);
  
    return (
      <div className=" ">
        <h1 className="font-semibold">Income Bar Chart</h1>
        <canvas ref={chartRef} width={400} height={200}></canvas>
      </div>
    );
  };
  
  export default MostIncome;
  