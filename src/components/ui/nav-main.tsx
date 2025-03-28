"use client";

import { useRouter } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    icon: LucideIcon;
    url: string;
    isActive?: boolean;
  }[];
}) {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarMenu className="my-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="my-2">
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => router.push(item.url)}
              className="hover:cursor-pointer bg-gray-200 hover:bg-gray-300 text-lg"
            >
              {item.icon && <item.icon className="!h-[20px] !w-[20px]"/>}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
