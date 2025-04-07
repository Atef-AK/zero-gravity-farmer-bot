
import { useEffect } from "react";
import { StatsCards } from "@/components/StatsCards";
import { StatisticsCharts } from "@/components/StatisticsCharts";
import { WalletList } from "@/components/WalletList";
import { AdvancedTaskConfigurator } from "@/components/AdvancedTaskConfigurator";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cog, BarChart3, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { selectedWallets } = useApp();
  
  const hasSelectedWallets = selectedWallets.length > 0;
  
  // Load blockchain settings on component mount
  useEffect(() => {
    try {
      // Check for saved settings
      const savedNetwork = localStorage.getItem("0g_network_config");
      const savedTokens = localStorage.getItem("0g_token_addresses");
      
      if (!savedNetwork || !savedTokens) {
        toast.info(
          "You should configure blockchain settings in the Settings page",
          {
            action: {
              label: "Go to Settings",
              onClick: () => window.location.href = "/settings"
            }
          }
        );
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/statistics">
              <BarChart3 className="h-4 w-4 mr-2" /> View Statistics
            </Link>
          </Button>
          
          <Button
            size="sm"
            asChild
          >
            <Link to="/settings">
              <Cog className="h-4 w-4 mr-2" /> Blockchain Settings
            </Link>
          </Button>
        </div>
      </div>
      
      <StatsCards />
      
      <StatisticsCharts />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletList />
        </div>
        <div>
          <AdvancedTaskConfigurator />
        </div>
      </div>
      
      {!hasSelectedWallets && (
        <div className="text-center p-6 bg-bot-card/50 rounded-lg border border-border/40 mt-4">
          <h3 className="text-xl font-semibold mb-2">Get Started</h3>
          <p className="text-muted-foreground mb-4">
            Select or add wallets to start configuring automatic tasks and transactions
          </p>
          <Button asChild>
            <Link to="/wallets">
              Go to Wallet Management <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
