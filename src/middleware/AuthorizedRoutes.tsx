"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AuthorizedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // List of roles allowed to access
}

export default function AuthorizedRoute({ children, allowedRoles }: AuthorizedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("You need to login to access this page");
      router.replace("/");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      toast.error("You do not have permission to access this page");
      router.replace("/");
      return;
    }

    setIsAllowed(true); // Allow rendering if the user has the correct role
  }, [user, router, allowedRoles]);

  if (!isAllowed) return null; // Prevent rendering unauthorized content

  return <>{children}</>;
}
