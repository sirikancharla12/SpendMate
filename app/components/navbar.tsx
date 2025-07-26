


import { signOut, useSession } from "next-auth/react";
import Greeting from "./greetinguser";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const Logout = () => {
    signOut({ callbackUrl: "/" });
  };

  const getRandomColor = () => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // const userName = session.user.name || "U"; // Default to "U" if name is missing
  // const firstLetter = userName.charAt(0).toUpperCase();
const firstLetter = (session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase();

  const randomColor = getRandomColor();
  

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center px-4 py-3 bg-[#181C3B] text-white shadow-md h-14 md:h-16 lg:h-20">
      
      {/* Sidebar Toggle Button */}
      <button
        className="md:block px-3 py-1 md:px-4 md:py-2 lg:px-5 lg:py-2 text-sm md:text-base lg:text-lg rounded-md transition-all"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <img src="/menubtn.svg" alt="Menu" />
      </button>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src="/logowhite.png" alt="Logo" className="w-[200px]" />
      </div>

      <div className="ml-auto flex items-center space-x-3 md:space-x-4">
        <Greeting />
       
<div className={`w-10 h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 ${randomColor} border rounded-full flex items-center justify-center text-white font-bold`}>
  {firstLetter}
</div>

        <button
          className="md:px-4 md:py-2 lg:px-2 lg:py-2 rounded-md transition-all transform hover:scale-105 cursor-pointer"
          onClick={Logout}
        >
          <img src="/logout.svg" alt="Logout" width="30px" />
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
