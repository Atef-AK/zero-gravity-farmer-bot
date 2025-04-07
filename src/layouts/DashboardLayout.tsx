
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/MainSidebar";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container py-6 space-y-6 px-4">
              <div className="flex items-center justify-between mb-4">
                <SidebarTrigger />
              </div>
              <Outlet />
            </main>
            <footer className="border-t border-border/40 py-4">
              <div className="container flex items-center justify-between text-sm text-muted-foreground">
                <div>0G Labs Testnet Farming Bot</div>
                <div>v1.1.0</div>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
