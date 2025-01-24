import React, { useEffect, useState } from "react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "Income" | "Expense";
  date: string;
}

const MostExpenses = ({ transactions }: { transactions: Transaction[] }) => {
  const [topExpenses, setTopExpenses] = useState<
    { category: string; total: number; percentage: number }[]
  >([]);

  const categoryImages: { [key: string]: string } = {
    food: "/food.svg",
    housing: "/house.svg",
    entertainment: "/entertainment.svg",
    shopping: "/shopping.svg",
    groceries: "/groceries.svg",
    salary: "/salary.svg",
    others: "/others.svg",
  };

  const capitalize = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const totalIncome = transactions
        .filter((transaction) => transaction.type === "Income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const expenseMap: Record<string, number> = {};
      transactions
        .filter((transaction) => transaction.type === "Expense")
        .forEach((transaction) => {
          const normalizedCategory = transaction.category.toLowerCase();
          expenseMap[normalizedCategory] =
            (expenseMap[normalizedCategory] || 0) + transaction.amount;
        });

      const sortedExpenses = Object.entries(expenseMap)
        .map(([category, total]) => ({
          category,
          total,
          percentage: totalIncome > 0 ? parseFloat(((total / totalIncome) * 100).toFixed(2)) : 0,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      setTopExpenses(sortedExpenses);
    }
  }, [transactions]);

  return (
    <div>
      <h2>Top 3 Expense Categories</h2>
      {topExpenses.map((expense, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            borderRadius: "5px",
            // backgroundColor:"red",
            padding: "10px",
            // width:"2/5"
          }}
        >
          <img
            src={categoryImages[expense.category] || "/money.svg"}
            alt={expense.category}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "8px",
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
                // width:"full"
              }}
            >
              <span>{capitalize(expense.category)}</span>
              {/* <span>{`${expense.total.toFixed(2)} USD`}</span> */}
            </div>

            <div
              style={{
                height: "5px",
                width: "50%",
                backgroundColor: "#e0e0e0",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${expense.percentage}%`,
                  backgroundColor: "#4caf50",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MostExpenses;
