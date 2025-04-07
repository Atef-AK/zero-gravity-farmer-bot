
import { StatsCards } from "@/components/StatsCards";
import { StatisticsCharts } from "@/components/StatisticsCharts";
import { WalletList } from "@/components/WalletList";
import { AdvancedTaskConfigurator } from "@/components/AdvancedTaskConfigurator";
import { useApp } from "@/contexts/AppContext";

export default function Dashboard() {
  const { selectedWallets } = useApp();
  
  const hasSelectedWallets = selectedWallets.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
