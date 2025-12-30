import React, { useEffect, useState } from "react";

const MostExpenses = ({ transactions }) => {
    const [topExpenses, setTopExpenses] = useState([]);

    const categoryImages = {
        food: "/food.svg",
        housing: "/house.svg",
        entertainment: "/entertainment.svg",
        shopping: "/shopping.svg",
        groceries: "/groceries.svg",
        salary: "/salary.svg",
        others: "/others.svg",
    };

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            const totalIncome = transactions
                .filter((transaction) => transaction.type === "Income")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            const expenseMap = {};
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
        <div className="bg-[#181C3B] py-2 px-2 rounded ">
            <h2 className=" font-semibold">Top 3 Expense Categories</h2>
            {topExpenses.map((expense, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "2px",
                        borderRadius: "5px",
                        padding: "10px",
                    }}
                >
                    <img
                        src={categoryImages[expense.category] || "/money.svg"}
                        alt={expense.category}
                        style={{
                            width: "30px",
                            height: "30px",
                            marginRight: "8px",
                        }}
                    />

                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "2px",
                                // width:"full"
                            }}
                        >
                            <span>{capitalize(expense.category)}</span>
                        </div>

                        <div
                            style={{
                                height: "5px",
                                width: "100%",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "5px",
                                overflow: "hidden",
                            }}
                        >
                            <div className="bg-yellow-500"
                                style={{
                                    height: "100%",
                                    width: `${expense.percentage}%`,
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
