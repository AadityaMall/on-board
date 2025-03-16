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
      </div>
    </nav>
  );
};

export default Navbar;
