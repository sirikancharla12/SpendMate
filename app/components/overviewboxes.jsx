"use client"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import clsx from "clsx"

const OverviewBoxes = ({ transactions }) => {
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        const totalIncome = transactions
            .filter((transaction) => transaction.type === "Income")
            .reduce((sum, transaction) => sum + transaction.amount, 0)

        const totalExpense = transactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce((sum, transaction) => sum + transaction.amount, 0)

        setIncome(totalIncome)
        setExpense(totalExpense)
        setBalance(totalIncome - totalExpense)
    }, [transactions])

    const formatValue = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    }

    const StatCard = ({ title, value, type, icon: Icon }) => {
        const isPositive = type === "income" || (type === "balance" && value >= 0);

        const colors = {
            income: "text-fintech-green bg-fintech-green/10 border-fintech-green/20",
            expense: "text-fintech-red bg-fintech-red/10 border-fintech-red/20",
            balance: "text-fintech-blue bg-fintech-blue/10 border-fintech-blue/20"
        };

        return (
            <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    <div className={clsx("p-2 rounded-lg", colors[type])}>
                        <Icon size={20} />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-3xl font-bold tracking-tight">
                        {formatValue(value)}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                        {type === "expense" ? (
                            <span className="text-fintech-red flex items-center">
                                <ArrowUpRight size={16} className="mr-1" /> +2.5%
                            </span>
                        ) : (
                            <span className="text-fintech-green flex items-center">
                                <ArrowUpRight size={16} className="mr-1" /> +12.5%
                            </span>
                        )}
                        <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Total Income"
                value={income}
                type="income"
                icon={TrendingUp}
            />
            <StatCard
                title="Total Expenses"
                value={expense}
                type="expense"
                icon={TrendingDown}
            />
            <StatCard
                title="Total Balance"
                value={balance}
                type="balance"
                icon={Wallet}
            />
        </div>
    )
}

export default OverviewBoxes
