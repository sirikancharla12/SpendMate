import { useSession } from "next-auth/react";
import Greeting from "./greetinguser";


const Navbar=()=>{
    const { data: session } = useSession();

    if (!session || !session.user) {
      return <div>Loading...</div>;
    }
    return (
  <div >

<div className="display flex justify-between pl-3 pr-3">
<Greeting/>

<div className="display flex  items-center">
             <button className="m-2">Logout</button>

          <div className="w-10 h-10 border rounded-full"></div>
             {/* <p>Email: {session.user.email}</p> */}
        </div>
      </div>
  </div>
      
    )
}

export default Navbar;