


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
           {session.user.name || session.user.email?.split("@")[0] || "User"}
      </h2>
      
    </div>
  );
};

export default Greeting;
