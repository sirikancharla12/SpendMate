


"use client"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from "lucide-react"

interface Transaction {
  type: "Income" | "Expense"
  amount: number
}

const OverviewBoxes = ({ transactions }: { transactions: Transaction[] }) => {
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [balance, setBalance] = useState(0)
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const totalBalance = totalIncome - totalExpense

    setIncome(totalIncome)
    setExpense(totalExpense)
    setBalance(totalBalance)
  }, [transactions])

  const formatValue = (val: number) => {
    return `₹${val.toLocaleString()}`
  }

  const getIncomeChange = () => {
    return income > 0 ? "+8.2%" : "0%"
  }

  const getExpenseChange = () => {
    return expense > 0 ? "-3.1%" : "0%"
  }

  const getBalanceChange = () => {
    return balance > 0 ? "+12.5%" : balance < 0 ? "-5.2%" : "0%"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income Card */}
      <div className=" border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative rounded-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

        <div className="flex flex-col space-y-1.5 p-4 pb-2">
          <div className="text-white/90 text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Income
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="text-3xl font-bold mb-2">{formatValue(income)}</div>
          <p className="text-white/90 text-sm flex items-center gap-1">
            <span>↗ {getIncomeChange()}</span>
            from last month
          </p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden relative rounded-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

        <div className="flex flex-col space-y-1.5 p-4 pb-2">
          <div className="text-white/90 text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Total Expenses
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="text-3xl font-bold mb-2">{formatValue(expense)}</div>
          <p className="text-white/90 text-sm flex items-center gap-1">
            <span>↘ {getExpenseChange()}</span>
            from last month
          </p>
        </div>
      </div>

      {/* Available Balance Card */}
      <div className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative rounded-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

        <div className="flex flex-col space-y-1.5 p-4 pb-2 ">
          <div className="text-white/90 text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Available Balance
            </div>
       
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="text-3xl font-bold mb-2">{showBalance ? formatValue(balance) : "••••••"}</div>
          <p className="text-white/90 text-sm flex items-center gap-1">
            <span>
              {balance >= 0 ? "↗" : "↘"} {getBalanceChange()}
            </span>
            from last month
          </p>
        </div>
      </div>
    </div>
  )
}

export default OverviewBoxes
