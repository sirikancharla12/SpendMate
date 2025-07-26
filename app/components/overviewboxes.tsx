

    "use client"
import { useEffect, useState } from "react"

interface Transaction {
    type: 'Income' | 'Expense';
    amount: number;
}

const Overviewboxes = ({ transactions }: { transactions: Transaction[] }) => {
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        const totalIncome = transactions
            .filter((transaction) => transaction.type === 'Income')
            .reduce((sum, transaction) => sum + transaction.amount, 0)

        const totalExpense = transactions
            .filter((transaction) => transaction.type === 'Expense')
            .reduce((sum, transaction) => sum + transaction.amount, 0)

        const totalBalance = totalIncome - totalExpense

        setIncome(totalIncome)
        setExpense(totalExpense)
        setBalance(totalBalance)
    }, [transactions])

    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Total Income */}
            <div className="flex justify-between items-center  border rounded p-2 w-full sm:w-1/3">
                <div>
                    <div>Total Income</div>
                    <div className="text-green-500">{income}</div>
                </div>
                <div className="flex justify-end">
                    <img src="/free_icon_1.svg" alt="income" className="w-15 h-10" />
                </div>
            </div>

            {/* Total Expenses */}
            <div className="flex justify-between items-center border rounded p-2 w-full sm:w-1/3">
                <div>
                    <div>Total Expenses</div>
                    <div className="text-red-500">{expense}</div>
                </div>
                <div className="flex justify-end">
                    <img src="/down.svg" alt="expenses" className="w-15 h-10" />
                </div>
            </div>

            {/* Available Balance */}
            <div className="flex justify-between items-center border rounded p-2 w-full sm:w-1/3">
                <div>
                    <div>Available Balance</div>
                    <div className="text-blue-500">{balance}</div>
                </div>
                <div className="flex justify-end">
                    <img src="/balanceamount.svg" alt="balance" className="w-10 h-10" />
                </div>
            </div>
        </div>
    )
}

export default Overviewboxes
