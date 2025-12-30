"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await axios.post("/api/auth/register", {
                name,
                email,
                password
            });

            if (res.status === 201 || res.status === 200) {
                router.push("/auth/signin");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Side Image Section (Swapped to Left for Register) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-fintech-blue to-purple-600 items-center justify-center p-12 text-center text-white">
                <div className="relative z-10 max-w-md space-y-4">
                    <h2 className="text-4xl font-bold drop-shadow-md">Join SpendMate</h2>
                    <p className="text-lg opacity-90 drop-shadow-sm">Start your journey towards financial freedom today.</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-2xl mb-4">S</div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h2>
                        <p className="text-sm text-muted-foreground mt-2">Enter your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/auth/signin" className="font-semibold text-primary hover:underline underline-offset-4">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
