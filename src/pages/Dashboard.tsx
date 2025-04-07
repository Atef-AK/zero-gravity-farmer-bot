
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/StatsCards";
import { StatisticsCharts } from "@/components/StatisticsCharts";
import { WalletList } from "@/components/WalletList";
import { AdvancedTaskConfigurator } from "@/components/AdvancedTaskConfigurator";
import { useApp } from "@/contexts/AppContext";
import { Play, PauseCircle, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const { startAllTasks, stopAllTasks, refreshWalletBalances, isRunning, selectedWallets } = useApp();
  
  const hasSelectedWallets = selectedWallets.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button 
            onClick={refreshWalletBalances} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button 
            onClick={startAllTasks}
            size="sm"
            className="flex items-center gap-1"
            disabled={!hasSelectedWallets || isRunning}
          >
            <Play size={16} /> Start Tasks
          </Button>
          <Button 
            onClick={stopAllTasks}
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            disabled={!isRunning}
          >
            <PauseCircle size={16} /> Stop Tasks
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
    </div>
  );
}
