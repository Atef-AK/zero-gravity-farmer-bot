
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Play, Pause, Trash2, ExternalLink, Copy, Edit } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function WalletList() {
  const { wallets, selectWallet, selectAllWallets, deselectAllWallets, deleteWallet, 
          setWalletActive, refreshWalletBalances } = useApp();
  const [editingWallet, setEditingWallet] = useState(null);
  const [walletName, setWalletName] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAllWallets();
    } else {
      deselectAllWallets();
    }
  };

  const handleEditWallet = (wallet) => {
    setEditingWallet(wallet);
    setWalletName(wallet.name || "");
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="h-full border-border/40 bg-bot-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/20">
        <CardTitle className="text-xl">Wallets</CardTitle>
        <div className="flex items-center gap-2">
          <Checkbox 
            id="select-all" 
            onCheckedChange={handleSelectAll}
            checked={wallets.length > 0 && wallets.every(w => w.selected)}
          />
          <Label htmlFor="select-all" className="cursor-pointer">Select All</Label>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-auto max-h-[calc(100vh-16rem)]">
        {wallets.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No wallets added yet. Add a wallet to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-0 divide-y divide-border/20">
            {wallets.map(wallet => (
              <div key={wallet.id} className="p-3 hover:bg-bot-card-hover transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={wallet.selected}
                      onCheckedChange={(checked) => selectWallet(wallet.id, !!checked)}
                    />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {wallet.name || `Wallet ${wallet.id}`}
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditWallet(wallet)}>
                              <Edit size={14} />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Edit Wallet</SheetTitle>
                            </SheetHeader>
                            <div className="py-4 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="wallet-name">Wallet Name</Label>
                                <Input 
                                  id="wallet-name" 
                                  value={walletName} 
                                  onChange={(e) => setWalletName(e.target.value)}
                                  placeholder="Enter wallet name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Wallet Address</Label>
                                <div className="p-2 bg-background rounded text-xs break-all">
                                  {wallet.address}
                                </div>
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={() => {
                                  // Update wallet logic here
                                  toast.success("Wallet updated");
                                }}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                        
                        {wallet.active && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-bot-success animate-pulse-subtle" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {truncateAddress(wallet.address)}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(wallet.address, "Address copied to clipboard")}>
                              <Copy size={12} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy address</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5"
                              onClick={() => window.open(`https://chainscan-newton.0g.ai/address/${wallet.address}`, '_blank')}
                            >
                              <ExternalLink size={12} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View on explorer</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => refreshWalletBalances([wallet.id])} 
                          disabled={wallet.isLoading}
                          className="h-8 w-8"
                        >
                          <RefreshCw size={16} className={wallet.isLoading ? "animate-spin" : ""} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Refresh balances</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={wallet.active ? "destructive" : "default"} 
                          size="icon" 
                          onClick={() => setWalletActive(wallet.id, !wallet.active)}
                          className={`h-8 w-8 ${wallet.active ? "" : "bg-bot-success"}`}
                        >
                          {wallet.active ? <Pause size={16} /> : <Play size={16} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{wallet.active ? "Stop" : "Start"} farming</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive-foreground"
                          onClick={() => deleteWallet(wallet.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete wallet</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {wallet.balances && Object.entries(wallet.balances).map(([token, balance]) => (
                    <div key={token} className="text-center p-2 rounded-lg bg-black/20">
                      <div className="text-xs text-muted-foreground">{token}</div>
                      <div className="text-sm font-medium">{parseFloat(balance).toFixed(4)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
