"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            title: "Take Control of Your Finances",
            text: "Track your income and expenses effortlessly.",
            bg: "bg-gradient-to-br from-indigo-500 to-purple-600"
        },
        {
            title: "Smart Budgeting",
            text: "Stay ahead of your expenses with easy tools.",
            bg: "bg-gradient-to-br from-blue-500 to-teal-400"
        },
        {
            title: "Visualize Spending",
            text: "Interactive charts help you understand money flow.",
            bg: "bg-gradient-to-br from-rose-500 to-orange-400"
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Sign-in Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-2xl mb-4">S</div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                        <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            signIn("credentials", { redirect: true, email, password, callbackUrl: "/home" });
                        }}
                        className="space-y-6"
                    >
                        {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/home" })}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
                    >
                        <img src="https://docs.material-tailwind.com/icons/google.svg" alt="Google" className="h-4 w-4" />
                        Google
                    </button>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <a href="/auth/register" className="font-semibold text-primary hover:underline underline-offset-4">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            {/* Side Image Section */}
            <div className={`hidden lg:flex w-1/2 relative overflow-hidden transition-all duration-1000 ${slides[currentIndex].bg}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center"
                    >
                        <h2 className="text-4xl font-bold mb-4 drop-shadow-md">{slides[currentIndex].title}</h2>
                        <p className="text-lg opacity-90 max-w-md drop-shadow-sm">{slides[currentIndex].text}</p>
                    </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? "bg-white w-6" : "bg-white/50"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
