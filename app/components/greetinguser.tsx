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
    <div className="p-1" >
      
      <div >
        Hello, {session.user.name || "User"}!
      </div>
      <p >
        Let's manage your expenses smartly!
      </p>
    </div>
  );
};

export default Greeting;
