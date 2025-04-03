"use client";

import * as React from "react";
import { User, CalendarCheck, Plane, Settings2 } from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import SidebarHeading from "@/components/Admin/Sidebar/SidebarHeading";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: User,
      url: "/admin",
    },
    {
      title: "User",
      icon: User,
      isActive: true,
      url: "/admin/users",
    },
    {
      title: "Schedules",
      icon: CalendarCheck,
      url: "/admin/schedules",
    },
    {
      title: "Flights",
      icon: Plane,
      url: "/admin/flights",
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: Settings2,
    },
    {
      title: "Airports",
      icon: Plane,
      url: "/admin/airports",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeading />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={user ? user : { name: "", email: "" }}
            logout={() => logout(toast)}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
