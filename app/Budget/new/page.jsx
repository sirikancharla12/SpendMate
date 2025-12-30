"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function NewBudget() {
    const router = useRouter();
    const [category, setcategory] = useState("");
    const [spendinglimit, setspendinglimit] = useState(0);
    const [Frequency, setfrequency] = useState("");


    const handleSubmit = async () => {

        if (!category || !spendinglimit || !Frequency) {
            alert("All the fields are required");
            return
        }

        const payload = {
            category,
            spendinglimit: Number(spendinglimit),
            frequency: Frequency
        }

        try {
            const res = await axios.post("/api/budget", payload)
            if (res.status === 201 || res.status === 200) {
                router.push("/Budget")
            }
        }

        catch (err) {
            console.error(err);
            alert("Something went wrong");
        }

    }
    return (
        <div className="max-w-3xl mx-auto mt-8 text-white">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Create New Budget</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Define a new spending limit to keep your finances on track.
                </p>
            </div>

            <div className="bg-[#161d2f] border border-gray-700 rounded-xl p-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <div>
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setcategory(e.target.value)}
                                className="mt-1 w-full bg-[#101622] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="">Select a category</option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Transport">Transport</option>
                                <option value="Groceries">Groceries</option>
                                <option value="Education">Education</option>
                                <option value="Business">Business</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Travel">Travel</option>
                                <option value="Pets">Pets</option>
                                <option value="Others">Others</option>
                            </select>

                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                            Limits & Frequency
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">
                                    Spending Limit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={spendinglimit}
                                    onChange={(e) => setspendinglimit(Number(e.target.value))}
                                    placeholder="₹ 0.00"
                                    className="mt-1 w-full bg-[#101622] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    The maximum amount you plan to spend.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    Frequency <span className="text-red-500">*</span>
                                </label>
                                <select className="mt-1 w-full bg-[#101622] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                                    value={Frequency}
                                    onChange={(e) => setfrequency(e.target.value)}>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Yearly">Yearly</option>

                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    Resets automatically at the start of the period.
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
                        >
                            Save Budget
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
