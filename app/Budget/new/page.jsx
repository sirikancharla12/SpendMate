"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function NewBudget() {
    const router = useRouter();
    const [category, setCategory] = useState("");
    const [spendingLimit, setSpendingLimit] = useState("");
    const [frequency, setFrequency] = useState("Monthly");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        "Food", "Transport", "Entertainment", "Shopping", "Groceries",
        "Education", "Business", "Healthcare", "Utilities", "Travel", "Others"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category || !spendingLimit || !frequency) {
            alert("All fields are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/budget", {
                category,
                spendinglimit: Number(spendingLimit),
                frequency
            });
            if (res.status === 201 || res.status === 200) {
                router.push("/Budget");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ChevronLeft size={16} className="mr-1" /> Back to Budgets
            </button>

            <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-secondary/30">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Budget</h1>
                    <p className="text-sm text-muted-foreground mt-1">Set a spending limit for a specific category.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Spending Limit (₹)</label>
                            <input
                                type="number"
                                value={spendingLimit}
                                onChange={(e) => setSpendingLimit(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reset Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Budget"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
