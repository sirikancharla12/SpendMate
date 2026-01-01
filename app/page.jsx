"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";


const TextHoverEffect = dynamic(
  () => import("components/ui/text-hover-effect"),
  { ssr: false }
);

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    ChevronUp,
    PieChart,
    ShieldCheck,
    Smartphone,
    Zap,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import Image from "next/image";

const faqs = [
    {
        question: "Is SpendMate completely free?",
        answer: "Yes, our core features including expense tracking, budgeting, and basic analytics are 100% free for individual users.",
    },
    {
        question: "Is my financial data secure?",
        answer: "Security is our top priority. We use industry-standard encryption to protect your data and never sell your personal information.",
    },
    {
        question: "Can I export my data?",
        answer: "Absolutely. You can export your transaction history to CSV or PDF formats at any time for your records.",
    },
    {
        question: "Does it work on mobile?",
        answer: "SpendMate is fully responsive and works seamlessly on all modern smartphones, tablets, and desktops.",
    },
];

export default function Home() {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState(null);
    const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);


    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-background min-h-screen flex flex-col font-sans selection:bg-primary/20">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 text-foreground">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                            <Image src="/logo.png" alt="SpendMate Logo" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SpendMate</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
                        <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
                        <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/auth/signin")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                            Sign In
                        </button>
                        <button onClick={() => router.push("/auth/signin")} className="bg-primary text-primary-foreground text-sm font-medium px-5 py-2 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                            Master Your <br />
                            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Money Flow</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Track expenses, set smart budgets, and visualize your financial growth. The modern way to manage personal finance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button onClick={() => router.push("/auth/signin")} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                                Start Tracking Free
                                <ArrowRight size={20} />
                            </button>
                        </div>


                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                        <div className="relative rounded-2xl border border-border bg-card/50 shadow-2xl backdrop-blur-sm p-2">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 animate-tilt"></div>
                            <div className="relative rounded-xl overflow-hidden bg-background aspect-[4/3]">
                                {/* Using a placeholder gradient or the gif if it works well */}
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                                    <img src="/girlsave.gif" alt="App Dashboard" className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-secondary/30 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Everything you need to grow</h2>
                        <p className="text-lg text-muted-foreground">Powerhouse features packed into a simple, elegant interface.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: PieChart,
                                title: "Smart Analytics",
                                desc: "Visualize your spending habits with beautiful, interactive charts.",
                                color: "text-blue-500 bg-blue-500/10"
                            },
                            {
                                icon: Zap,
                                title: "Instant Tracking",
                                desc: "Log transactions in seconds. Fast, intuitive, and frictionless.",
                                color: "text-amber-500 bg-amber-500/10"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Bank-Grade Security",
                                desc: "Your data is encrypted and secure. We value your privacy.",
                                color: "text-green-500 bg-green-500/10"
                            },
                            {
                                icon: Smartphone,
                                title: "Cross-Platform",
                                desc: "Access your financial data from any device, anywhere, anytime.",
                                color: "text-purple-500 bg-purple-500/10"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-card border border-border hover:border-primary/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">Loved by thousands</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Finally, a finance app that doesn't feel like a spreadsheet. It's actually fun to use.",
                                author: "Alex Morgan",
                                role: "Freelancer",
                                img: "/male.png"
                            },
                            {
                                quote: "The budgeting feature helped me save for my dream vacation in just 6 months.",
                                author: "Sarah Chen",
                                role: "Product Designer",
                                img: "/female.png"
                            },
                            {
                                quote: "Clean, fast, and secure. Exactly what I was looking for to manage my daily expenses.",
                                author: "Michael Ross",
                                role: "Engineer",
                                img: "/sidepics.png"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                                <div className="flex gap-1 text-amber-500 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => <span key={star}>★</span>)}
                                </div>
                                <p className="text-lg mb-6 text-foreground font-medium">"{t.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                                        <img src={t.img} alt={t.author} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{t.author}</div>
                                        <div className="text-sm text-muted-foreground">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 mx-auto max-w-7xl">
                <div className="bg-primary rounded-3xl p-12 lg:p-20 text-center text-primary-foreground relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to take control?</h2>
                        <p className="text-primary-foreground/80 text-lg mb-10">
                            Join thousands of others who are mastering their money with SpendMate.
                        </p>
                        <button onClick={() => router.push("/auth/signin")} className="bg-background text-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-xl">
                            Get Started Now
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 bg-secondary/30">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border rounded-xl px-2"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-6 text-left font-semibold text-foreground"
                                >
                                    {faq.question}
                                    {openIndex === index ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-muted-foreground" />}
                                </button>
                                <div
                                    className={`px-6 text-muted-foreground overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="border-t border-border bg-background py-12 px-6">
                <div className="mx-auto max-w-7xl flex flex-col items-center gap-6 text-center overflow-visible">

                 {mounted && (
  <div className="w-full flex justify-center">
    <TextHoverEffect text="SpendMate" />
  </div>
)}


                    <p className="text-sm text-muted-foreground">
                        Track smarter. Spend better.
                    </p>

                    <p className="text-xs text-muted-foreground">
                        © 2025 SpendMate. All rights reserved.
                    </p>

                </div>
            </footer>


        </div>
    );
}
