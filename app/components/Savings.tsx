import { useState } from "react";

const Savings = () => {
  const [savings, setSavings] = useState("");
  const [amount, setAmount] = useState(0);
  const [savingsList, setSavingsList] = useState<
    { savings: string; amount: number; currentAmount: number }[]
  >([]);
  const [showForm, setShowForm] = useState(false);

  const addSavings = () => {
    if (savings && amount > 0) {
      setSavingsList([
        ...savingsList,
        { savings, amount, currentAmount: 0 },
      ]);
      setSavings("");
      setAmount(0);
      setShowForm(false); // Hide form after adding
    } else {
      alert("Please provide valid details.");
    }
  };

  const updateSavings = (index: number, value: number) => {
    setSavingsList((prevList) =>
      prevList.map((item, i) =>
        i === index ? { ...item, currentAmount: value } : item
      )
    );
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
<div className="flex justify-between items-center">
<h2 className="text-lg ">Savings</h2>
{!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          + Add
        </button>
      )}
</div>
    

      {showForm && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter savings name"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            className="py-1 px-2 border rounded text-sm bg-black text-white"
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="py-1 px-2 border rounded w-20 text-sm bg-black text-white"
            min="0"
          />
          <button
            onClick={addSavings}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      )}

      <div className="mt-4">
        {savingsList.length > 0 && (
          <ul>
            {savingsList.map((item, index) => {
              const progress = Math.min((item.currentAmount / item.amount) * 100, 100);
              return (
                <li key={index} className="py-3 border-b border-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">{item.savings}</span>
                    <span className="text-gray-400">Target: ₹{item.amount}</span>
                  </div>

                  {/* Input for entering saved amount */}
                  <div className="mt-2 flex items-center">
                    <label className="text-sm text-gray-500">Saved Amount:</label>
                    <input
                      type="number"
                      value={item.currentAmount}
                      onChange={(e) =>
                        updateSavings(index, Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="ml-2 py-1 px-2 border rounded w-20 text-sm bg-black text-white"
                      min="0"
                    />
                  </div>

                  {/* Progress Bar Styled Like Expense Bars */}
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2 relative">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Savings;
