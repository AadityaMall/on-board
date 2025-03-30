"use client"
import Link from "next/link"
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

export default function SidebarHeading({ className, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <div 
      className={cn(
        "flex h-fit items-center justify-start font-bold text-brandColor",
        className
      )}
      {...props}
    >
      <Link href="/">
        {isCollapsed ? (
          <span className="text-2xl py-1">OB</span>
        ) : (
          <span className="text-2xl py-1">OnBoard</span>
        )}
      </Link>
    </div>
  )
}