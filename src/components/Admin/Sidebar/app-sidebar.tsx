"use client"

import * as React from "react"
import {
  User,
  CalendarCheck,
  Plane,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import SidebarHeading from "@/components/Admin/Sidebar/SidebarHeading"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User",
      icon: User,
      isActive: true,
      items: [
        {
          title: "View All Users",
          url: "#",
        },
      ],
    },
    {
      title: "Schedules",
      icon: CalendarCheck,
      items: [
        {
          title: "View All Schedules",
          url: "#",
        },
        {
          title: "Create Schedule",
          url: "#",
        },
      ],
    },
    {
      title: "Flights",
      url: "#",
      icon: Plane,
      items: [
        {
          title: "View All Flights",
          url: "#",
        },
        {
          title: "Create FLight",
          url: "#",
        },
      ],
    },
    {
      title: "Bookings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "View All Bookings",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeading/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
