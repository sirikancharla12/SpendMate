// "use client"
// import { signIn } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; 

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter(); 
//   const [currentIndex, setCurrentIndex] = useState(0);

  
//   const slides = [
//     {
//       img: "/sidepics.png",
//       title: "Take Control of Your Finances!",
//       text: "Track your income and expenses effortlessly. Gain insights, set budgets, and achieve your financial goals."
//     },
//     {
//       img: "/sidepics.png",
//       title: "Smart Budgeting for Everyone!",
//       text: "Stay ahead of your expenses with easy-to-use budgeting tools."
//     },
//     {
//       img: "/sidepics.png",
//       title: "Visualize Your Spending",
//       text: "Interactive charts help you understand where your money goes."
//     }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, 3000); // Change every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const handleCredentialsSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await signIn("credentials", {
//       redirect: true,
//       email,
//       password,
//       callbackUrl: "/users",
//     });

//     if (res?.error) {
//       setError("Invalid email or password.");
//     } else {
//       setError("");
//     }
//   };


//   return (
//     <div className="flex justify-around items-center h-screen">
//       <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "50px", 
//       }}

//       className="border border-gray-800 rounded p-4 bg-gray-800"
//     >
//       <img src="/logowhite.png" alt="" width="400px"/>
//       <form
//         onSubmit={handleCredentialsSignIn}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           width: "300px",
//           marginBottom: "20px",
//         }}
//       >
//         {error && (
//           <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
//         )}
      
//          <label  className="mb-2 text-lg text-start text-grey-900">Email</label>
//          <input id="email" type="email" placeholder="Your Email" required
//           onChange={(e) => setEmail(e.target.value)} className="flex items-center w-full px-3 py-2 mr-2 text-md font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-gray-400 rounded"/>
//                     <label  className="mb-2 text-lg text-start text-grey-900">Password</label>
//                     <input id="password" type="password" placeholder="Your Password" 
//           onChange={(e) => setPassword(e.target.value)} required
//           className="flex items-center w-full px-3 py-2 mb-5 mr-2 text-md font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-gray-400 rounded"/>
       

// <button
//   type="submit"
//   className="font-semibold"
//   style={{
//     padding: "10px 20px",
//     backgroundColor: "#0070f3",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "all 0.3s ease-in-out",
//     fontSize: "16px",
//   }}
//   onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#005bb5")}
//   onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#0070f3")}
//   onMouseDown={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(0.95)")}
//   onMouseUp={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(1)")}
// >
//   Sign in
// </button>

// <div className="flex items-center my-4 ">
//   <hr className="flex-grow border-t border-gray-500" />
//   <p className="mx-3 text-slate-500 text-md font-medium">or</p>
//   <hr className="flex-grow border-t border-gray-500" />
// </div>


//       <div style={{ display: "flex", gap: "10px" }}>
   

// <button   onClick={() => signIn("google", { callbackUrl: "/users" })} className="rounded-md flex items-center justify-center border w-full  border-slate-300 py-2 px-4 text-center text-md transition-all shadow-sm hover:shadow-lg  hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
//   <img
//     src="https://docs.material-tailwind.com/icons/google.svg"
//     alt="metamask"
//     className="h-5 w-5 mr-2 "
//   />
//   Sign in with Google
// </button>
//       </div>

//       </form>
    
//     </div>
//     <div className="border border-gray-800 bg-purple-200 rounded h-full w-2/5 p-4 flex justify-center flex-col items-center">
//       <img src={slides[currentIndex].img} alt="Slide" width="500px" />
//       <h1 className="font-bold text-lg text-purple-700 text-center">
//         {slides[currentIndex].title}
//       </h1>
//       <h3 className="font-normal text-sm text-gray-500 text-center">
//         {slides[currentIndex].text}
//       </h3>
//     </div>
//    </div>
//   );
// }


// "use client";
// import { signIn } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const slides = [
//     {
//       img: "/sidepics.png",
//       title: "Take Control of Your Finances!",
//       text: "Track your income and expenses effortlessly. Gain insights, set budgets, and achieve your financial goals.",
//     },
//     {
//       img: "/sidepics2.png",
//       title: "Smart Budgeting for Everyone!",
//       text: "Stay ahead of your expenses with easy-to-use budgeting tools.",
//     },
//     {
//       img: "/sidepics-5.png",
//       title: "Visualize Your Spending",
//       text: "Interactive charts help you understand where your money goes.",
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex h-screen items-center justify-around">
//     {/* Sign-in Form - Now in a centered box */}
//     <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
//       <img src="/logowhite.png" alt="Logo" className="w-40 mb-4" />
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           signIn("credentials", { redirect: true, email, password, callbackUrl: "/users" });
//         }}
//         className="w-full"
//       >
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
  
//         <label className="mb-2 text-md text-gray-300">Email</label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Your Email"
//           required
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-3 py-2 text-md bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
  
//         <label className="mt-4 mb-2 text-md text-gray-300">Password</label>
//         <input
//           id="password"
//           type="password"
//           placeholder="Your Password"
//           required
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-3 py-2 text-md bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
  
//         <button
//           type="submit"
//           className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-all"
//         >
//           Sign in
//         </button>
//       </form>
  
//       <div className="flex items-center my-4 w-full">
//         <hr className="flex-grow border-t border-gray-500" />
//         <p className="mx-3 text-gray-500 text-md font-medium">or</p>
//         <hr className="flex-grow border-t border-gray-500" />
//       </div>
  
//       <button
//         onClick={() => signIn("google", { callbackUrl: "/users" })}
//         className="w-full flex items-center justify-center border border-gray-500 py-2 text-md text-white bg-gray-800 hover:bg-gray-700 rounded transition-all"
//       >
//         <img src="https://docs.material-tailwind.com/icons/google.svg" alt="Google" className="h-5 w-5 mr-2" />
//         Sign in with Google
//       </button>
//     </div>
  
//     {/* Side Image Section - Hidden on small screens */}
//     <div className="hidden h-screen sm:flex w-2/5 bg-purple-200 border border-gray-800 flex-col items-center justify-center p-6">
//       <img src={slides[currentIndex].img} alt="Slide" className="w-3/4 mb-4" />
//       <div className="flex justify-center mt-4 mb-4">
//         {slides.map((_, index) => (
//           <span
//             key={index}
//             className={`h-2 w-2 mx-1 rounded-full transition-all ${
//               currentIndex === index ? "bg-purple-700 scale-125" : "bg-gray-400"
//             }`}
//             onClick={() => setCurrentIndex(index)}
//             style={{ cursor: "pointer" }}
//           ></span>
//         ))}
//       </div>
//       <h1 className="text-lg font-bold text-purple-700 text-center">{slides[currentIndex].title}</h1>
//       <h3 className="text-sm text-gray-500 text-center">{slides[currentIndex].text}</h3>
//     </div>
//   </div>
  
//   );
// }


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
            signIn("credentials", { redirect: true, email, password, callbackUrl: "/users" });
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
          onClick={() => signIn("google", { callbackUrl: "/users" })}
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
              className={`h-2 w-2 mx-1 rounded-full transition-all ${
                currentIndex === index ? "bg-purple-700 scale-125" : "bg-gray-400"
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
