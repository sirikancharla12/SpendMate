"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Loader2, X, Trash2, ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { useAlert } from "../context/AlertContext"; // Import useAlert

const Expenses = ({ transactions, setTransactions }) => {
    const router = useRouter();

    const [isFormVisible, setFormVisible] = useState(false);
    const [transactionData, setTransactionData] = useState({
        description: "",
        amount: 0,
        category: "",
        type: "Income",
        date: new Date().toISOString().split("T")[0],
    });
    const [searchitem, setsearchitem] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null); // Track which ID is deleting
    const { showAlert } = useAlert(); // Hook

    const toggleVisibility = () => setFormVisible(!isFormVisible);

    const closeForm = () => {
        setFormVisible(false);
        setEditingTransactionId(null);
        setTransactionData({
            description: "",
            amount: 0,
            category: "",
            type: "Income",
            date: new Date().toISOString().split("T")[0],
        });
        setErrorMessage(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prevData) => ({
            ...prevData,
            [name]: name === "amount" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(transactionData.amount) || transactionData.amount <= 0 || !transactionData.description || !transactionData.category) {
            setErrorMessage("Please fill all required fields correctly.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        const requestData = {
            ...transactionData,
            date: new Date(transactionData.date).toISOString(),
        };

        try {
            if (editingTransactionId) {
                const response = await axios.put(`/api/expenses/${editingTransactionId}`, requestData);
                setTransactions((prev) =>
                    prev.map((t) => t.id === editingTransactionId ? response.data : t)
                );
            } else {
                const response = await axios.post("/api/expenses", requestData);
                setTransactions((prev) => [response.data, ...prev]);
            }
            router.refresh();
            closeForm();
        } catch (error) {
            setErrorMessage("There was an error processing your request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditTransaction = (transaction) => {
        setTransactionData({
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            type: transaction.type,
            date: new Date(transaction.date).toISOString().split("T")[0],
        });
        setEditingTransactionId(transaction.id);
        setFormVisible(true);
    };

    const handleDeleteTransaction = async (e, id) => {
        e.stopPropagation();

        showAlert(
            "Are you sure you want to delete this transaction?",
            "warning",
            "Confirm Deletion",
            async () => {
                setIsDeleting(id);
                try {
                    await axios.delete(`/api/expenses/${id}`);
                    setTransactions((prev) => prev.filter((t) => t.id !== id));
                    router.refresh();
                } catch (error) {
                    console.error("Failed to delete transaction", error);
                } finally {
                    setIsDeleting(null);
                }
            }
        );
    };

    const filteredTransactions = transactions.filter((t) =>
        t.description.toLowerCase().includes(searchitem.toLowerCase()) ||
        t.category.toLowerCase().includes(searchitem.toLowerCase())
    );

    const categories = [
        "Food", "Shopping", "Entertainment", "Groceries", "Transport",
        "Housing", "Utilities", "Healthcare", "Education", "Travel",
        "Salary", "Freelance", "Investment", "Business", "Others"
    ];

    return (
        <div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-card">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchitem}
                        onChange={(e) => setsearchitem(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent focus:border-primary/50 text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors w-full sm:w-auto border border-border">
                        <Filter size={16} /> <span className="hidden sm:inline">Filter</span>
                    </button>
                    <button
                        onClick={toggleVisibility}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                        <Plus size={18} /> Add New
                    </button>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-secondary/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-2">Date</div>
                <div className="col-span-4">Description</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1 text-right">Action</div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto bg-card">
                {filteredTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <div className="p-4 rounded-full bg-secondary mb-3">
                            <Search size={24} className="opacity-50" />
                        </div>
                        <p>No transactions found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredTransactions.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => handleEditTransaction(t)}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/40 transition-colors cursor-pointer group"
                            >
                                <div className="col-span-2 text-sm text-muted-foreground font-medium">
                                    {new Date(t.date).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric'
                                    })}
                                </div>
                                <div className="col-span-4 text-sm font-medium text-foreground truncate pr-4">
                                    {t.description}
                                </div>
                                <div className="col-span-3">
                                    <span className={clsx(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                        "bg-secondary/50 text-secondary-foreground border-transparent"
                                    )}>
                                        <div className={clsx("w-1.5 h-1.5 rounded-full",
                                            t.type === 'Income' ? "bg-fintech-green" : "bg-fintech-red"
                                        )} />
                                        {t.category}
                                    </span>
                                </div>
                                <div className={clsx(
                                    "col-span-2 text-right text-sm font-semibold tracking-tight",
                                    t.type === "Income" ? "text-fintech-green" : "text-fintech-red"
                                )}>
                                    {t.type === "Income" ? "+" : "-"}
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(t.amount)}
                                </div>
                                <div className="col-span-1 text-right">
                                    <button
                                        onClick={(e) => handleDeleteTransaction(e, t.id)}
                                        disabled={isDeleting === t.id}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                    >
                                        {isDeleting === t.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isFormVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/30">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">
                                    {editingTransactionId ? "Edit Transaction" : "New Transaction"}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {editingTransactionId ? "Update your transaction details." : "Add a new record to your ledger."}
                                </p>
                            </div>
                            <button onClick={closeForm} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                            {errorMessage && (
                                <div className="p-4 bg-destructive/10 text-destructive text-sm font-medium rounded-lg flex items-center gap-2">
                                    <X size={16} /> {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">Sort Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={transactionData.description}
                                    onChange={handleChange}
                                    placeholder="e.g. Spotify Subscription"
                                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-foreground">Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={transactionData.amount}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block text-foreground">Type</label>
                                    <div className="flex p-1 bg-secondary rounded-lg">
                                        {['Income', 'Expense'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setTransactionData(prev => ({ ...prev, type }))}
                                                className={clsx(
                                                    "flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1",
                                                    transactionData.type === type
                                                        ? "bg-background text-foreground shadow-sm"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {type === 'Income' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">Category</label>
                                <select
                                    name="category"
                                    value={transactionData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block text-foreground">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={transactionData.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-border mt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 px-4 py-2.5 border border-border rounded-lg text-muted-foreground font-medium hover:bg-secondary transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                    {isSubmitting ? "Saving..." : "Save Transaction"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
