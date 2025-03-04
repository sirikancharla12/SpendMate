// import { useSession } from "next-auth/react";



// const Greeting = () => {
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (!session || !session.user) {
//     return <div>Please sign in to access your workspace.</div>;
//   }

//   return (
//     <div className=" flex justify-between items-center bg-gray-800 text-white">
//       {/* Sidebar Toggle Button */}
      
//       {/* Greeting Message */}
//       <div className="text-center">
//         <h2 className="text-lg font-semibold">Hello, {session.user.name || "User"}!</h2>
//         <p>Let's manage your expenses smartly!</p>
//       </div>
//     </div>
//   );
// };

// export default Greeting;


import { useSession } from "next-auth/react";

const Greeting = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>Please sign in to access your workspace.</div>;
  }

  return (
    <div className="text-center">
      <h2 className="text-sm md:text-lg lg:text-xl font-medium hidden md:block">
         {session.user.name || "User"}
      </h2>
      
    </div>
  );
};

export default Greeting;
