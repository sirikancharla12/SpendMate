import { Chart,Filler } from "chart.js";
import { LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import { useEffect, useRef, useState } from "react";

// Register the required components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale,Filler);

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

  

const ChartComponent = ({ transactions }: { transactions: Transaction[] }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Calculate the total income and expense per month
  const calculateMonthlyData = (transactions: Transaction[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);

    transactions.forEach((transaction) => {
      const monthIndex = new Date(transaction.date).getMonth();
      if (transaction.type === "Income") {
        incomeData[monthIndex] += transaction.amount;
      } else {
        expenseData[monthIndex] += transaction.amount;
      }
    });

    return { months, incomeData, expenseData };
  };

  const [chartData, setChartData] = useState<{
    months: string[];
    incomeData: number[];
    expenseData: number[];
  }>({
    months: [],
    incomeData: [],
    expenseData: [],
  });

  useEffect(() => {
    const { months, incomeData, expenseData } = calculateMonthlyData(transactions);
    setChartData({ months, incomeData, expenseData });  

  }, [transactions]);

  useEffect(() => {
    if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");

        if(ctx){


        const expenseGradient = ctx.createLinearGradient(0, 0, 0, 400); 
        expenseGradient.addColorStop(0, "rgba(234, 88, 12, 0.8)"); 
        expenseGradient.addColorStop(0, "rgba(240, 149, 100, 0.86)"); 

      const chartInstance = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: chartData.months,
          datasets: [
            {
              label: "Income",
              data: chartData.incomeData,
              borderColor: "#4caf50", 
              backgroundColor: "rgba(0, 128, 0, 0.5)",
              tension: 0.3,
              pointBackgroundColor: "#4caf50", 
              pointBorderColor: "#388e3c", 
              borderDash: [10, 10],
              fill: false, 
            },
            {
              label: "Expenses",
              data: chartData.expenseData,
              borderColor: "#ea580c", 
              backgroundColor: expenseGradient, 
              tension: 0.3,
              fill: true, 
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks:{
                color:"#f8fafc",
                font:{
                    size:14,
                    weight:"normal"
                }
            },
        },
            y: {
              beginAtZero: true,
              ticks:{
                color:"#f8fafc",
                font:{
                    size:14,
                    weight:"normal"
                }
            },
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
}
  }, [chartData]);

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
