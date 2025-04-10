
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
import FileUpload from "./pages/actions/FileUpload";
import DomainRegistration from "./pages/actions/DomainRegistration";
import NFTMinting from "./pages/actions/NFTMinting";
import Settings from "./pages/Settings";
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
              <Route path="actions/upload" element={<FileUpload />} />
              <Route path="actions/domains" element={<DomainRegistration />} />
              <Route path="actions/nfts" element={<NFTMinting />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
