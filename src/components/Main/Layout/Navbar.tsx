import React from "react";
import Link from "next/link";
import { LoginSignup } from "./LoginSignup";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-5 md:px-[100px] pt-3 md:pt-7 ">
      <Link href="/">
        <h1 className="font-bold text-[27px] text-brandColor">OnBoard</h1>
      </Link>
      <div>
        <LoginSignup />
        {/* <Link
          href={"/login"}
          className="flex justify-center items-center w-[167px] h-[46px]  bg-white text-[16px] 
                text-[#25304B] rounded-full drop-shadow-xl"
        >
          Login / Signup
        </Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
