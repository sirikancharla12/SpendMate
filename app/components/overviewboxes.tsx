
    "use client"
    import { useEffect, useState } from "react"
    interface Transaction {
        type: 'Income' | 'Expense';
        amount: number;
    }

    const Overviewboxes=({transactions}:{transactions:Transaction[]})=>{
        
    const [income,setincome]=useState(0)
    const [expense,setexpense]=useState(0)
    const [balance,setbalance]=useState(0)

    useEffect(()=>{
        const totalIncome=transactions
        .filter((transaction)=>transaction.type==='Income')
        .reduce((sum,transaction)=>sum+transaction.amount,0)

        const totalExpense=transactions
        .filter((transaction)=>transaction.type==='Expense')
        .reduce((sum,transaction)=>sum+transaction.amount,0)

        const totalBalance=totalIncome-totalExpense

        setincome(totalIncome)
        setexpense(totalExpense)
        setbalance(totalBalance)
    },[transactions])

        return (
            <div className=" display flex justify-between">
                <div className=" display flex border rounded p-2 ">
            <div>
    

            <div>
                Total Income  
                    </div>
                    <div>{income}</div> 
            </div>
            <div className=" flex justify-end ">
    <img src="/free_icon_1.svg" alt=""  className="w-15 h-10"/>
            </div>
            
                    </div>
                    <div className=" display flex border rounded p-2 ">
            <div>
    

            <div>
                Total Expenses  
                    </div>
                    <div >{expense}</div> 
            </div>
            <div className=" flex justify-end ">
    <img src="/down.svg" alt=""  className="w-15 h-10"/>
            </div>
            
                    </div>
                    <div className=" display flex border rounded p-2 ">
            <div>
    

            <div>
            Available  Balance  
                    </div>
                    <div>{balance}</div> 
            </div>
            <div className=" flex justify-end ">
    <img src="/balanceamount.svg" alt=""  className="w-10 h-10 "/>
            </div>
                </div>
            </div>
        )
    } 

    export default Overviewboxes