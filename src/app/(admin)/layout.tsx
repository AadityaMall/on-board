import "../globals.css";
import { AppSidebar } from "@/components/Admin/Sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import AdminRoute from "@/middleware/AuthorizedRoutes";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminRoute allowedRoles={["Admin"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-2xl font-bold text-brandColor">
                OnBoard Admin Panel.
              </h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="w-full flex justify-center items-start h-full">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminRoute>
  );
}
