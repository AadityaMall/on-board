"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LoginSignup } from "./LoginSignup";
import { NavbarUser } from "@/components/ui/nav-user";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const { user,logout } = useAuth();
  const [authenticated, isAuthenticated] = useState(false);
  useEffect(() => {
    if (user) {
      isAuthenticated(true);
      console.log(user);
    }
  }, [user]);
  return (
    <nav className="flex justify-between items-center px-5 md:px-[100px] pt-3 md:pt-7 ">
      <Link href="/">
        <h1 className="font-bold text-[27px] text-brandColor">OnBoard</h1>
      </Link>
      <div>
        {authenticated && user? (
          <NavbarUser user={user} logout={()=>  logout(toast)}/>
        ) : (
          <LoginSignup />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
