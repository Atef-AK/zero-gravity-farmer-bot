
import { WalletList } from "@/components/WalletList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { AddWalletForm } from "@/components/AddWalletForm";
import { useState, MouseEvent } from "react";
import { useApp } from "@/contexts/AppContext";

export default function Wallets() {
  const { refreshWalletBalances, selectedWallets } = useApp();
  const [addWalletOpen, setAddWalletOpen] = useState(false);
  
  const hasSelectedWallets = selectedWallets.length > 0;

  const handleRefresh = (e: MouseEvent<HTMLButtonElement>) => {
    refreshWalletBalances();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
          <p className="text-muted-foreground">Manage your wallets and private keys.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} /> Refresh Balances
          </Button>
          <Dialog open={addWalletOpen} onOpenChange={setAddWalletOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1" size="sm">
                <Plus size={16} /> Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Wallet</DialogTitle>
              </DialogHeader>
              <AddWalletForm />
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            disabled={!hasSelectedWallets}
          >
            <Trash2 size={16} /> Delete Selected
          </Button>
        </div>
      </div>

      <WalletList />
    </div>
  );
}
