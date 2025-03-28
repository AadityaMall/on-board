"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
export function NavUser({
  user,
  logout,
}: {
  user: {
    name: string;
    email: string;
  };
  logout: () => void;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="h-8 min-w-8 rounded-lg bg-gray-500 flex justify-center items-center">
                <span className="text-white font-bold">
                  {user?.name[0].toUpperCase()}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem className="p-0 focus:outline-none focus:ring-0 focus:border-none">
              <Button
                className="w-full text-red-500 border-red-500 hover:text-red-500"
                variant={"outline"}
                onClick={logout}
              >
                <LogOut color="red" />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
export function NavbarUser({
  user,
  logout,
}: {
  user: {
    name: string;
    email: string;
    role: string;
  };
  logout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full w-fit h-[36px] bg-white text-[16px] text-[#25304B]">
          {user.name[0].toUpperCase()} <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        {user.role === "Admin" && (
          <DropdownMenuItem className="p-0 focus:outline-none focus:ring-0 focus:border-none">
            <Link
              href="/admin"
              className="w-full py-2 bg-brandColor my-1 rounded-md text-white text-center"
            >
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0 focus:outline-none focus:ring-0 focus:border-none">
          <Button
            className="w-full text-red-500 border-red-500 hover:text-red-500"
            variant={"outline"}
            onClick={logout}
          >
            <LogOut color="red" />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
