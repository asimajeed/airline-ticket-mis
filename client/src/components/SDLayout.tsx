import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";

export default function SDLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-bold text-lg">User Management</h1>
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
