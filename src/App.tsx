
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Wallets from "./pages/Wallets";
import Contracts from "./pages/Contracts";
import Tasks from "./pages/Tasks";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="wallets" element={<Wallets />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="statistics" element={<Statistics />} />
              {/* Additional routes for other pages */}
              <Route path="actions/upload" element={<Dashboard />} />
              <Route path="actions/domains" element={<Dashboard />} />
              <Route path="actions/nfts" element={<Dashboard />} />
              <Route path="settings" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
