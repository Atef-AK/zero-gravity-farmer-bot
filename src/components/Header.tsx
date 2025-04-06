
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { RefreshCw, Play, Pause } from "lucide-react";

export function Header() {
  const { 
    refreshWalletBalances, 
    startAllTasks, 
    stopAllTasks, 
    isRunning, 
    selectedWallets 
  } = useApp();
  
  const hasSelectedWallets = selectedWallets.length > 0;

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-2xl font-semibold">
            <span className="text-bot-accent">0G</span>
            <span className="text-bot-foreground">Farmer</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => refreshWalletBalances()}
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Refresh</span>
          </Button>
          
          {isRunning ? (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={stopAllTasks}
              disabled={!hasSelectedWallets}
            >
              <Pause size={16} />
              <span>Stop Tasks</span>
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1 bg-bot-success hover:bg-bot-success/80"
              onClick={startAllTasks}
              disabled={!hasSelectedWallets}
            >
              <Play size={16} />
              <span>Start Tasks</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
