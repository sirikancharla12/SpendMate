


"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { Playfair_Display } from 'next/font/google';
import { useRouter } from "next/navigation";
const playfair = Playfair_Display({ subsets: ['latin'], weight: '700' });

const faqs = [
  {
    question: "How does SpendMate help me track expenses?",
    answer:
      "SpendMate lets you record transactions, set budgets, and visualize spending trends.",
  },
  {
    question: "Is SpendMate free to use?",
    answer:
      "Yes! You can use the core features for free.",
  },
  {
    question: "Can I access my data on multiple devices?",
    answer:
      "Absolutely! SpendMate syncs your data securely across all your devices.",
  },
  {
    question: "How can i set my savings goal?",
    answer:
      "You can set a savings goal by specifying the amount and the target date.",
  },
  {
    question: "Do I need to link my bank account?",
    answer:
      "No, you can manually enter transactions if you prefer not to link your bank account.",
  },
];






export default function Home() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-purple-600 p-4 shadow-md">
        <div>
          <Image src="/logowhite.png" alt="Logo" width={180} height={80} />
        </div>
        <ul className="flex items-center space-x-6 text-white">
          <li><Link href="#home" className="font-semibold hover:text-purple-300">Home</Link></li>
          <li><Link href="#features" className="font-semibold hover:text-purple-300">Features</Link></li>
          <li><Link href="#reviews" className="font-semibold hover:text-purple-300">Reviews</Link></li>
          <li><Link href="#faq" className="font-semibold hover:text-purple-300">FAQ's</Link></li>
          <li>
            <button onClick={() => router.push("/auth/signin")}  className="border bg-white text-purple-600 font-semibold px-4 py-2 rounded-md hover:bg-purple-700 hover:border-white hover:text-white transition">
              Signup
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div id="home" className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-center bg-purple-50 px-6">
  {/* Left Content */}
  <div className="text-center md:text-left lg:ml-5 max-w-2xl">
  <h1 className={`${playfair.className} text-5xl font-extrabold text-purple-700 leading-tight italic`}>
  Take Control of Your Finances
</h1>
    <p className="mt-4 text-xl text-gray-700">
      Simplify money management. Track your expenses, set budgets, and gain insights to achieve financial freedom—effortlessly.
    </p>

    {/* Dynamic Text Animation */}
    <p className="mt-4 text-2xl font-semibold text-purple-600">
      <span className="animate-pulse">Track.</span>{" "}
      <span className="animate-pulse delay-200">Save.</span>{" "}
      <span className="animate-pulse delay-400">Grow.</span>
    </p>

    <div className="mt-6 space-x-4">
      <button onClick={() => router.push("/auth/signin")} className="bg-purple-600 text-white px-8 py-3 text-lg rounded-md hover:bg-purple-700 transition">
        Get Started
      </button>
      <button className="border border-purple-600 text-purple-600 px-8 py-3 text-lg rounded-md hover:bg-purple-600 hover:text-white transition">
        Learn More
      </button>
    </div>
  </div>

  {/* Right Image */}
  <div className="mt-8 md:mt-0 md:ml-12">
    <img src="/girlsave.gif" alt="Expense Tracker" className="w-96 md:w-[800px] lg:w-[1000px]" />
  </div>
</div>


      {/* Features Section */}
      <div id="features" className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700"> Why Choose Us?</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Say goodbye to financial stress! Easily track your spending, set budgets, and take charge of your money.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold text-purple-700">Real-Time Tracking</h3>
            <p className="mt-2 text-gray-600">Monitor your expenses in real-time and stay on top of your finances.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold text-purple-700">Smart Budgeting</h3>
            <p className="mt-2 text-gray-600">Set budgets and get insights to improve your spending habits.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold text-purple-700">Goal Tracking</h3>
            <p className="mt-2 text-gray-600">Set financial goals and track your progress towards achieving them.</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-md">
            <h3 className="text-xl font-semibold text-purple-700">Visual Insights</h3>
            <p className="mt-2 text-gray-600">View spending trends with interactive charts and graphs.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="reviews" className="py-16 bg-purple-50 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Testimonial 1 */}
          <div className="p-6 bg-gray-900 text-white shadow-lg rounded-xl flex items-center space-x-4">
            <img src="/female.png" alt="Sarah" className="w-16 h-16 rounded-full border-2 border-yellow-400" />
            <div className="text-left">
              <h3 className="text-yellow-400 font-semibold">Sarah</h3>
              <p className="text-purple-500 text-sm">Belgrade</p>
              <p className="mt-2 italic text-lg">“I love how simple it is!”</p>
            </div>
            <span className="text-yellow-400 text-4xl">”</span>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-gray-900 text-white shadow-lg rounded-xl flex items-center space-x-4">
            <img src="/male.png" alt="Ron Rizzly" className="w-16 h-16 rounded-full border-2 border-yellow-400" />
            <div className="text-left">
              <h3 className="text-yellow-400 font-semibold">Ron Rizzly</h3>
              <p className="text-purple-500 text-sm">London</p>
              <p className="mt-2 italic text-lg">“This is the best money tracker ever!”</p>
            </div>
            <span className="text-yellow-400 text-4xl">”</span>
          </div>
        </div>
      </div>

      {/* Call to Action (CTA) */}
    

 
      <div id="faq" className="text-center py-12 bg-purple-100 text-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">
          FAQ
        </h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src="/ques.png"
              alt="FAQ Illustration"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* FAQ Content */}
          <div className="md:w-1/2 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="text-left bg-white p-5 rounded-lg shadow-md cursor-pointer border border-purple-300"
                onClick={() => toggleFAQ(index)}
              >
                <div
                  className="flex justify-between items-center text-purple-700 font-semibold text-lg"
                >
                  {faq.question}
                  <span className="text-gray-500">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>




      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-center text-white">
        <p>© 2025 <i className="text-purple-600">SpendMate</i>. All rights reserved.</p>
      </footer>
    </div>
  );
}
