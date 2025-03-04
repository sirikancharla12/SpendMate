

 import axios, { AxiosResponse } from "axios";
 import { useEffect, useState } from "react"
 const SavingsTable = () => {
   const [displayInputs, setDisplayInputs] = useState(false);
   const [savingsList, setSavingsList] = useState<Saving[]>([]);
 const [savingsLimit, setSavingsLimit] = useState<number>(0); // Savings limit state
   const [warningMessage, setWarningMessage] = useState<string>("");
  const [newSaving, setNewSaving] = useState({
    description: "",
    amount: "",
    targetDate: "",
    amountSaved: "",
    percentageSaved: "",
  });
  const [salary, setSalary] = useState<number>(0);
  const [savingStatuses, setSavingStatuses] = useState<
    { percentage: number; isTargetMet: boolean }[]
  >([]);
  const [editSavingId, setEditSavingId] = useState<string | null>(null); // Track the saving being edited

  const percentageOptions = [5, 10, 15, 20, 25, 30]; // Predefined saving percentages

interface Saving {
  id: string;
  description: string;
  amount: number;
  targetDate: string;
  percentageSaved: number;
  amountSaved: number;
}

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setNewSaving({ ...newSaving, [e.target.name]: e.target.value });
  };

  const handleDateChange = () => {
    const targetDate = new Date(newSaving.targetDate);
    const currentDate = new Date();
    const monthsRemaining =
      (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (targetDate.getMonth() - currentDate.getMonth());

    const newStatuses = percentageOptions.map((percent) => {
      // Calculate the amount saved per month based on the percentage of salary
      const savingsPerMonth = (salary * percent) / 100;
      const totalSavingsPossible = savingsPerMonth * monthsRemaining;

      return {
        percentage: percent,
        isTargetMet: totalSavingsPossible >= parseFloat(newSaving.amount),
      };
    });

    setSavingStatuses(newStatuses);
  };

  const handlePercentageChange = (e: { target: { value: string } }) => {
    const percentage = parseFloat(e.target.value);
    const calculatedAmountSaved = ((salary * percentage) / 100).toFixed(2);

    const targetDate = new Date(newSaving.targetDate);
    const currentDate = new Date();
    const monthsRemaining =
      (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (targetDate.getMonth() - currentDate.getMonth());

    const projectedSavings = monthsRemaining * parseFloat(calculatedAmountSaved);

    setNewSaving({
      ...newSaving,
      percentageSaved: e.target.value,
      amountSaved: calculatedAmountSaved,
    });

    const newStatuses = percentageOptions.map((percent) => {
      const savingsPerMonth = (salary * percent) / 100;
      const totalSavingsPossible = savingsPerMonth * monthsRemaining;
      return {
        percentage: percent,
        isTargetMet: totalSavingsPossible >= parseFloat(newSaving.amount),
      };
    });

    setSavingStatuses(newStatuses);
  };

  const fetchSavings = async () => {
    try {
      const response = await axios.get("/api/savings"); // Assuming this API endpoint is valid
      setSavingsList(response.data);
    } catch (error) {
      console.error("Error fetching savings:", error);
    }
  };

  const fetchSalary = async () => {
    try {
      const response = await axios.get("/api/expenses"); // Assuming this API endpoint is valid
      const salaryExpense = response.data.find(
        (expense: any) => expense.category.toLowerCase() === "salary"
      );
      if (salaryExpense) {
        setSalary(salaryExpense.amount);
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
    }
  };

  useEffect(() => {
    fetchSavings();
    fetchSalary();
  }, []);

  const addSaving = async () => {
    if (!newSaving.description || !newSaving.amount || !newSaving.targetDate || !newSaving.percentageSaved) {
      console.error("All fields are required.");
      return;
    }
  
    if (salary === 0) {
      console.error("Salary not available.");
      return;
    }

    const currentTotalSavings = calculateTotalSavings();
    const newAmountSaved = parseFloat(newSaving.amountSaved || "0");
    const updatedTotalSavings = currentTotalSavings + newAmountSaved;
  
 

    if (updatedTotalSavings <= savingsLimit || savingsLimit === 0) {
      setWarningMessage("");  
    }
  
    if (updatedTotalSavings > savingsLimit && savingsLimit > 0) {
      setWarningMessage("⚠️ Warning: Total savings exceed the set limit!");
      
      setTimeout(() => {
        setWarningMessage(""); 
      }, 3000);
  
      return; 
    }

    const reqData = {
      description: newSaving.description,
      amount: parseFloat(newSaving.amount) || 0,
      targetDate: newSaving.targetDate,
      amountSaved: parseFloat(newSaving.amountSaved) || 0,
      percentageSaved: parseFloat(newSaving.percentageSaved) || 0,
    };
  
    try {
      let response: AxiosResponse<any>;
      if (editSavingId) {
        console.log(`Updating saving with ID: ${editSavingId}`);
        response = await axios.put(`/api/savings/${editSavingId}`, reqData);
        if (response.status === 200) {
          setSavingsList((prevSavings) =>
            prevSavings.map((saving) =>
              saving.id === editSavingId ? response.data : saving
            )
          );
          setEditSavingId(null); 
        }
      } else {
        console.log("Adding new saving");
        response = await axios.post("/api/savings", reqData);
        if (response.status === 200) {
          setSavingsList((prevSavings) => [...prevSavings, response.data]);
        }
      }
  
      setDisplayInputs(false);
      setNewSaving({
        description: "",
        amount: "",
        amountSaved: "",
        targetDate: "",
        percentageSaved: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleCancel = () => {
    setDisplayInputs(false); 
    setNewSaving({ description: "", amount: "", targetDate: "", amountSaved: "", percentageSaved: "" }); // Reset form values
    setEditSavingId(null); 
  };

  function handleDelete(id: string): void {
    axios.delete(`/api/savings/${id}`).then(() => {
      setSavingsList((prevSavings) => prevSavings.filter((saving) => saving.id !== id));
    });
  }

  const handleEdit = (saving: Saving) => {
    setNewSaving({
      description: saving.description,
      amount: saving.amount.toString(),
      targetDate: saving.targetDate,
      amountSaved: saving.amountSaved.toString(),
      percentageSaved: saving.percentageSaved.toString(),
    });
    setEditSavingId(saving.id); 
    setDisplayInputs(true); 
  };
  

const handleLimitChange = (e: { target: { value: string } }) => {
  setSavingsLimit(parseFloat(e.target.value));
};

const calculateTotalSavings = () => {
  return savingsList.reduce((acc, saving) => acc + saving.amountSaved, 0);
};

  return (
    <div>
<div className="overflow-x-auto ">
  <div className="flex flex-col sm:flex-row justify-between items-center ">
    <div className="py-2 font-semibold text-purple-400 text-2xl sm:mr-4">Savings History</div>



<div className="flex items-center space-x-2 items-center sm:flex-row">
  <label className="text-purple-400 font-semibold sm:text-sm">Set Savings Limit: </label>
  <input
    type="number"
    className="text-purple-500"
    value={savingsLimit}
    onChange={handleLimitChange}
    placeholder="Enter savings limit"
  />
</div>



<button
            type="button"
            className="text-white bg-purple-600 font-semibold hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
            onClick={()=>setDisplayInputs(true)}
          >
            Add
          </button>
          
        </div>
        {warningMessage && (
  <div className="text-red-500 mt-2">{warningMessage}</div>
)}
        <table className="min-w-full table-auto   mt-4 " >
          <thead>
            <tr className="bg-purple-600">
              <th className="text-center p-2 ">Savings</th>
              <th className="text-center p-2 ">Target</th>
              <th className="text-center p-2 ">Amount Saved</th>
              <th className="text-center p-2 ">Target Date</th>
              <th className="text-center p-2 ">Percentage Saved</th>
              <th className="text-center p-2 ">Amount per month</th>
              <th className="text-center p-2 ">Action</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {displayInputs && (
              <tr>
                <td className="text-center p-2 ">
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newSaving.description}
                    onChange={handleChange}
                    className=" p-2 bg-purple-600 text-center"
                  />
                </td>
                <td className="text-center p-2 ">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Target Amount"
                    value={newSaving.amount}
                    onChange={handleChange}
               className=" p-2 bg-purple-600 text-center"
                  />
                </td>
                <td className="text-center p-2  ">
                  <input
                    type="number"
                    name="amountSaved"
                    placeholder="Amount Saved"
                    value={newSaving.amountSaved}
                    onChange={handleChange}
                    className=" p-2 bg-purple-600 text-center"
                    readOnly
                  />
                </td>
                <td className="text-center p-2 ">
                  <input
                    type="date"
                    name="targetDate"
                    placeholder="Target Date"
                    value={newSaving.targetDate}
                    onChange={(e) => {
                      handleChange(e);
                      handleDateChange();
                    }}
                 className=" p-2 bg-purple-600 text-center"
                  />
                </td>
                <td className="text-center p-2 ">
                  <select
                    name="percentageSaved"
                    value={newSaving.percentageSaved}
                    onChange={handlePercentageChange}
                    className=" p-2 bg-purple-600 text-center"
                  >
                    <option value="">Select %</option>
                    {percentageOptions.map((percent) => {
                      const status = savingStatuses.find(
                        (status) => status.percentage === percent
                      );
                      const isTargetMet = status?.isTargetMet;

                      return (
                        <option
                          key={percent}
                          value={percent}
                          className={isTargetMet ? "text-green-500" : "text-red-500"}
                        >
                          {percent}% {isTargetMet ? "🟢" : "🔴"}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="">
                <input
  type="number"
  name="amountSaved"
  placeholder="Amount Saved"
  value={newSaving.amountSaved}
  onChange={handleChange}
  className=" bg-purple-600 text-center p-2"
  readOnly
/>
                </td>
                <td className="text-center    items-center justify-center justify-around">  
                   <button
                    className=" text-white  rounded hover:bg-blue-700"
                    onClick={addSaving}
                  >
                     {editSavingId ? (
                      <img src="/righttick.svg" alt="Update" className="h-7 w-7" />
                    ) : (
                      <img src="/righttick.svg" alt="Save" className="h-7 w-7" />
                    )}
                  </button>
                  <button
                    className=" text-white  rounded hover:bg-gray-700 "
                    onClick={handleCancel}
                  >
                    <img src="/wrongmark.svg" alt="" className="h-7 w-7"/>
                  </button>
                </td>
              </tr>
            )}
            {savingsList.map((saving) => (
              <tr key={saving.id}>
                <td className="text-center p-2 ">{saving.description}</td>
                <td className="text-center p-2 ">{saving.amount}</td>
                <td className="text-center p-2 ">{saving.amountSaved}</td>
                <td className="text-center p-2 ">{new Date(saving.targetDate).toISOString().split("T")[0]}</td>
                <td className="text-center p-2 ">{saving.percentageSaved}%</td>
                <td className="text-center p-2 ">
                  {saving.amountSaved && saving.amountSaved > 0 ? (
                    <span>{saving.amountSaved}</span>
                  ) : (
                    <span>Not Calculated</span>
                  )}
                </td>
                <td className="text-center p-2  flex items-center justify-center justify-around">
                  <button
                    onClick={() => handleEdit(saving)}
                    className="bg-yellow-500 rounded-full text-white rounded hover:bg-yellow-700  "
                  >
                    <img src="/editsavings.svg" alt="" className="w-10 h-10" />
                  </button>
                  <button
                    onClick={() => handleDelete(saving.id)}
                    className=" text-white rounded hover:bg-red-700"
                  >
                  <img src="/delete.svg" alt="Delete" className="w-7 h-7" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavingsTable;


// import axios, { AxiosResponse } from "axios";
// import { useEffect, useState } from "react";

// const SavingsTable = () => {
//   const [displayInputs, setDisplayInputs] = useState(false);
//   const [savingsList, setSavingsList] = useState<Saving[]>([]);
//   const [savingsLimit, setSavingsLimit] = useState<number>(0); // Savings limit state
//   const [warningMessage, setWarningMessage] = useState<string>("");
//   const [newSaving, setNewSaving] = useState({
//     description: "",
//     amount: "",
//     targetDate: "",
//     amountSaved: "",
//     percentageSaved: "",
//   });
//   const [salary, setSalary] = useState<number>(0);
//   const [savingStatuses, setSavingStatuses] = useState<
//     { percentage: number; isTargetMet: boolean }[]
//   >([]);
//   const [editSavingId, setEditSavingId] = useState<string | null>(null); // Track the saving being edited

//   const percentageOptions = [5, 10, 15, 20, 25, 30]; // Predefined saving percentages

//   interface Saving {
//     id: string;
//     description: string;
//     amount: number;
//     targetDate: string;
//     percentageSaved: number;
//     amountSaved: number;
//   }

//   const handleChange = (e: { target: { name: string; value: string } }) => {
//     setNewSaving({ ...newSaving, [e.target.name]: e.target.value });
//   };

//   const handleDateChange = () => {
//     const targetDate = new Date(newSaving.targetDate);
//     const currentDate = new Date();
//     const monthsRemaining =
//       (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
//       (targetDate.getMonth() - currentDate.getMonth());

//     const newStatuses = percentageOptions.map((percent) => {
//       // Calculate the amount saved per month based on the percentage of salary
//       const savingsPerMonth = (salary * percent) / 100;
//       const totalSavingsPossible = savingsPerMonth * monthsRemaining;

//       return {
//         percentage: percent,
//         isTargetMet: totalSavingsPossible >= parseFloat(newSaving.amount),
//       };
//     });

//     setSavingStatuses(newStatuses);
//   };

//   const handlePercentageChange = (e: { target: { value: string } }) => {
//     const percentage = parseFloat(e.target.value);
//     const calculatedAmountSaved = ((salary * percentage) / 100).toFixed(2);

//     const targetDate = new Date(newSaving.targetDate);
//     const currentDate = new Date();
//     const monthsRemaining =
//       (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
//       (targetDate.getMonth() - currentDate.getMonth());

//     const projectedSavings = monthsRemaining * parseFloat(calculatedAmountSaved);

//     setNewSaving({
//       ...newSaving,
//       percentageSaved: e.target.value,
//       amountSaved: calculatedAmountSaved,
//     });

//     const newStatuses = percentageOptions.map((percent) => {
//       const savingsPerMonth = (salary * percent) / 100;
//       const totalSavingsPossible = savingsPerMonth * monthsRemaining;
//       return {
//         percentage: percent,
//         isTargetMet: totalSavingsPossible >= parseFloat(newSaving.amount),
//       };
//     });

//     setSavingStatuses(newStatuses);
//   };

//   const fetchSavings = async () => {
//     try {
//       const response = await axios.get("/api/savings");
//       setSavingsList(response.data);
//     } catch (error) {
//       console.error("Error fetching savings:", error);
//     }
//   };

//   const fetchSalary = async () => {
//     try {
//       const response = await axios.get("/api/expenses");
//       const salaryExpense = response.data.find(
//         (expense: any) => expense.category.toLowerCase() === "salary"
//       );
//       if (salaryExpense) {
//         setSalary(salaryExpense.amount);
//       }
//     } catch (error) {
//       console.error("Error fetching salary:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSavings();
//     fetchSalary();
//   }, []);

//   const addSaving = async () => {
//     if (!newSaving.description || !newSaving.amount || !newSaving.targetDate || !newSaving.percentageSaved) {
//       console.error("All fields are required.");
//       return;
//     }

//     if (salary === 0) {
//       console.error("Salary not available.");
//       return;
//     }

//     const currentTotalSavings = calculateTotalSavings();
//     const newAmountSaved = parseFloat(newSaving.amountSaved || "0");
//     const updatedTotalSavings = currentTotalSavings + newAmountSaved;

//     if (updatedTotalSavings > savingsLimit && savingsLimit > 0) {
//       setWarningMessage("⚠️ Warning: Total savings exceed the set limit!");

//       setTimeout(() => {
//         setWarningMessage(""); // Clear the warning after 3 seconds
//       }, 3000);

//       return; // Prevent adding the saving
//     }

//     const reqData = {
//       description: newSaving.description,
//       amount: parseFloat(newSaving.amount) || 0,
//       targetDate: newSaving.targetDate,
//       amountSaved: parseFloat(newSaving.amountSaved) || 0,
//       percentageSaved: parseFloat(newSaving.percentageSaved) || 0,
//     };

//     try {
//       let response: AxiosResponse<any>;
//       if (editSavingId) {
//         response = await axios.put(`/api/savings/${editSavingId}`, reqData);
//         if (response.status === 200) {
//           setSavingsList((prevSavings) =>
//             prevSavings.map((saving) =>
//               saving.id === editSavingId ? response.data : saving
//             )
//           );
//           setEditSavingId(null); // Reset edit mode
//         }
//       } else {
//         response = await axios.post("/api/savings", reqData);
//         if (response.status === 200) {
//           setSavingsList((prevSavings) => [...prevSavings, response.data]);
//         }
//       }

//       setDisplayInputs(false);
//       setNewSaving({
//         description: "",
//         amount: "",
//         amountSaved: "",
//         targetDate: "",
//         percentageSaved: "",
//       });
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   };

//   const handleCancel = () => {
//     setDisplayInputs(false);
//     setNewSaving({
//       description: "",
//       amount: "",
//       targetDate: "",
//       amountSaved: "",
//       percentageSaved: "",
//     });
//     setEditSavingId(null);
//   };

//   function handleDelete(id: string): void {
//     axios.delete(`/api/savings/${id}`).then(() => {
//       setSavingsList((prevSavings) => prevSavings.filter((saving) => saving.id !== id));
//     });
//   }

//   const handleEdit = (saving: Saving) => {
//     setNewSaving({
//       description: saving.description,
//       amount: saving.amount.toString(),
//       targetDate: saving.targetDate,
//       amountSaved: saving.amountSaved.toString(),
//       percentageSaved: saving.percentageSaved.toString(),
//     });
//     setEditSavingId(saving.id);
//     setDisplayInputs(true);
//   };

//   const handleLimitChange = (e: { target: { value: string } }) => {
//     setSavingsLimit(parseFloat(e.target.value));
//   };

//   const calculateTotalSavings = () => {
//     return savingsList.reduce((acc, saving) => acc + saving.amountSaved, 0);
//   };

//   return (
//     <div>
//       <div className="overflow-x-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-center">
//           <div className="py-2 font-semibold text-purple-400 text-2xl sm:mr-4">Savings History</div>

//           <div className="flex items-center space-x-2 items-center sm:flex-row">
//             <label className="text-purple-400 font-semibold sm:text-sm">Set Savings Limit: </label>
//             <input
//               type="number"
//               className="text-purple-500"
//               value={savingsLimit}
//               onChange={handleLimitChange}
//               placeholder="Enter savings limit"
//             />
//           </div>

//           <button
//             type="button"
//             className="text-white bg-purple-600 font-semibold hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
//             onClick={() => setDisplayInputs(true)}
//           >
//             Add
//           </button>
//         </div>
//         {warningMessage && (
//           <div className="text-red-500 mt-2">{warningMessage}</div>
//         )}
//         <table className="min-w-full table-auto mt-4">
//           <thead>
//             <tr className="bg-purple-600">
//               <th className="text-center p-2">Savings</th>
//               <th className="text-center p-2">Target</th>
//               <th className="text-center p-2">Amount Saved</th>
//               <th className="text-center p-2">Target Date</th>
//               <th className="text-center p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {savingsList.map((saving) => (
//               <tr key={saving.id}>
//                 <td className="text-center p-2">{saving.description}</td>
//                 <td className="text-center p-2">{saving.amount}</td>
//                 <td className="text-center p-2">{saving.amountSaved}</td>
//                 <td className="text-center p-2">{saving.targetDate}</td>
//                 <td className="text-center p-2">
//                   <button onClick={() => handleEdit(saving)}>Edit</button>
//                   <button onClick={() => handleDelete(saving.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SavingsTable;
