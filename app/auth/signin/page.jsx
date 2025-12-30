"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            img: "/sidepics.png",
            title: "Take Control of Your Finances!",
            text: "Track your income and expenses effortlessly. Gain insights, set budgets, and achieve your financial goals.",
        },
        {
            img: "/sidepics2.png",
            title: "Smart Budgeting for Everyone!",
            text: "Stay ahead of your expenses with easy-to-use budgeting tools.",
        },
        {
            img: "/sidepics-5.png",
            title: "Visualize Your Spending",
            text: "Interactive charts help you understand where your money goes.",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen items-center justify-around">
            {/* Sign-in Form */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
                <img src="/logowhite.png" alt="Logo" className="w-40 mb-4" />
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        signIn("credentials", { redirect: true, email, password, callbackUrl: "/home" });
                    }}
                    className="w-full"
                >
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <label className="mb-2 text-md text-gray-300">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Your Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-md bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="mt-4 mb-2 text-md text-gray-300">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Your Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-md bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-all"
                    >
                        Sign in
                    </button>
                </form>

                <div className="flex items-center my-4 w-full">
                    <hr className="flex-grow border-t border-gray-500" />
                    <p className="mx-3 text-gray-500 text-md font-medium">or</p>
                    <hr className="flex-grow border-t border-gray-500" />
                </div>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/home" })}
                    className="w-full flex items-center justify-center border border-gray-500 py-2 text-md text-white bg-gray-800 hover:bg-gray-700 rounded transition-all"
                >
                    <img src="https://docs.material-tailwind.com/icons/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                    Sign in with Google
                </button>
            </div>

            {/* Side Image Section with Animation */}
            <div className="hidden h-screen sm:flex w-2/5 bg-purple-200 border border-gray-800 flex-col items-center justify-center p-6">
                <motion.img
                    key={slides[currentIndex].img}
                    src={slides[currentIndex].img}
                    alt="Slide"
                    className="w-3/4 mb-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                />

                <div className="flex justify-center mt-4 mb-4">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`h-2 w-2 mx-1 rounded-full transition-all ${currentIndex === index ? "bg-purple-700 scale-125" : "bg-gray-400"
                                }`}
                            onClick={() => setCurrentIndex(index)}
                            style={{ cursor: "pointer" }}
                        ></span>
                    ))}
                </div>

                <motion.h1
                    key={slides[currentIndex].title}
                    className="text-lg font-bold text-purple-700 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    {slides[currentIndex].title}
                </motion.h1>
                <motion.h3
                    key={slides[currentIndex].text}
                    className="text-sm text-gray-500 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    {slides[currentIndex].text}
                </motion.h3>
            </div>
        </div>
    );
}
