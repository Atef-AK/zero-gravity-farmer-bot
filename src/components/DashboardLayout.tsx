
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { WalletList } from "@/components/WalletList";
import { ActivityFeed } from "@/components/ActivityFeed";
import { StatsCards } from "@/components/StatsCards";
import { AddWalletForm } from "@/components/AddWalletForm";
import { TaskConfigurator } from "@/components/TaskConfigurator";

export function DashboardLayout() {
  const [addWalletOpen, setAddWalletOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6 space-y-6">
        <StatsCards />
        
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Wallets</h2>
          <Dialog open={addWalletOpen} onOpenChange={setAddWalletOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Wallet</DialogTitle>
              </DialogHeader>
              <AddWalletForm />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WalletList />
          </div>
          <div>
            <TaskConfigurator />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Activity Feed</h2>
          <ActivityFeed />
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-4">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <div>0G Labs Testnet Farming Bot</div>
          <div>v1.0.0</div>
        </div>
      </footer>
    </div>
  );
}
