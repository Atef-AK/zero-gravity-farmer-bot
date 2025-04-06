
import { useApp } from "@/contexts/AppContext";
import { 
  Wallet, 
  ArrowUpRight, 
  Repeat, 
  FileImage,
  Globe,
  CloudUpload,
  BarChart3
} from "lucide-react";

export function StatsCards() {
  const { wallets, activities } = useApp();
  
  // Calculate stats
  const activeWallets = wallets.filter(w => w.active).length;
  const totalWallets = wallets.length;
  
  // Count activities by type
  const activityCounts = {
    claim: activities.filter(a => a.type === 'claim').length,
    swap: activities.filter(a => a.type === 'swap').length,
    transfer: activities.filter(a => a.type === 'transfer').length,
    mint: activities.filter(a => a.type === 'mint').length,
    register: activities.filter(a => a.type === 'register').length,
    upload: activities.filter(a => a.type === 'upload').length
  };
  
  // Success rate
  const successfulActivities = activities.filter(a => a.status === 'success').length;
  const totalActivities = activities.length;
  const successRate = totalActivities > 0 
    ? Math.round((successfulActivities / totalActivities) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="stats-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Active Wallets</div>
            <div className="text-2xl font-bold mt-1">
              {activeWallets}<span className="text-xs text-muted-foreground ml-1">/ {totalWallets}</span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-bot-primary/20 text-bot-primary">
            <Wallet size={18} />
          </div>
        </div>
      </div>
      
      <div className="stats-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
            <div className="text-2xl font-bold mt-1">{successRate}%</div>
          </div>
          <div className="p-2 rounded-full bg-bot-success/20 text-bot-success">
            <BarChart3 size={18} />
          </div>
        </div>
      </div>
      
      <div className="stats-card col-span-2">
        <div className="text-sm font-medium text-muted-foreground mb-2">Activity Summary</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <ArrowUpRight size={16} className="text-bot-primary" />
            </div>
            <div className="text-xs text-muted-foreground">Claims</div>
            <div className="text-lg font-semibold">{activityCounts.claim}</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <Repeat size={16} className="text-bot-accent" />
            </div>
            <div className="text-xs text-muted-foreground">Swaps</div>
            <div className="text-lg font-semibold">{activityCounts.swap}</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <ArrowUpRight size={16} className="text-bot-warning" />
            </div>
            <div className="text-xs text-muted-foreground">Transfers</div>
            <div className="text-lg font-semibold">{activityCounts.transfer}</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <FileImage size={16} className="text-green-400" />
            </div>
            <div className="text-xs text-muted-foreground">NFTs</div>
            <div className="text-lg font-semibold">{activityCounts.mint}</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <Globe size={16} className="text-blue-400" />
            </div>
            <div className="text-xs text-muted-foreground">Domains</div>
            <div className="text-lg font-semibold">{activityCounts.register}</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <div className="flex justify-center mb-1">
              <CloudUpload size={16} className="text-orange-400" />
            </div>
            <div className="text-xs text-muted-foreground">Uploads</div>
            <div className="text-lg font-semibold">{activityCounts.upload}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
