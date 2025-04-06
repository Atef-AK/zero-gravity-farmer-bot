
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { 
  ArrowUpRight, 
  Repeat, 
  FileImage,
  Globe,
  CloudUpload,
  Timer
} from "lucide-react";

export function TaskConfigurator() {
  const { selectedWallets } = useApp();
  const hasSelectedWallets = selectedWallets.length > 0;

  // Task configuration state
  const [config, setConfig] = useState({
    claimFaucet: {
      enabled: true,
      interval: 24, // hours
      tokens: ["A0GI", "USDT", "BTC", "ETH"]
    },
    swapTokens: {
      enabled: true,
      interval: 12, // hours
      minAmount: 0.1,
      maxAmount: 1
    },
    transferTokens: {
      enabled: true,
      interval: 16, // hours
      minAmount: 0.05,
      maxAmount: 0.5
    },
    mintNFT: {
      enabled: true,
      interval: 48 // hours
    },
    registerDomain: {
      enabled: true,
      interval: 72 // hours
    },
    uploadFile: {
      enabled: true,
      interval: 36 // hours
    }
  });

  const handleToggle = (task, enabled) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        enabled
      }
    }));
  };

  const handleIntervalChange = (task, interval) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        interval: parseInt(interval) || 0
      }
    }));
  };

  const handleAmountChange = (task, field, value) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const saveConfig = () => {
    // In a real app, this would save to the database or context
    toast.success("Task configuration saved");
  };

  return (
    <Card className="h-full border-border/40 bg-bot-card">
      <CardHeader className="border-b border-border/20 pb-2">
        <CardTitle className="text-xl">Task Configuration</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6 overflow-auto max-h-[calc(100vh-16rem)]">
        {!hasSelectedWallets ? (
          <div className="text-center text-muted-foreground">
            Select wallets to configure tasks.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={18} className="text-bot-primary" />
                  <span className="font-medium">Faucet Claims</span>
                </div>
                <Switch 
                  checked={config.claimFaucet.enabled} 
                  onCheckedChange={(checked) => handleToggle('claimFaucet', checked)}
                />
              </div>
              
              {config.claimFaucet.enabled && (
                <div className="pl-7 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="claim-interval" className="text-sm">
                        Interval (hours)
                      </Label>
                      <div className="flex items-center">
                        <Input 
                          id="claim-interval"
                          type="number"
                          min="1"
                          value={config.claimFaucet.interval}
                          onChange={(e) => handleIntervalChange('claimFaucet', e.target.value)}
                          className="max-w-[100px]"
                        />
                        <Timer size={14} className="ml-2 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Tokens to Claim</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {config.claimFaucet.tokens.map(token => (
                        <div key={token} className="text-center p-2 rounded-lg bg-bot-primary/10">
                          <span className="text-sm">{token}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat size={18} className="text-bot-accent" />
                  <span className="font-medium">Token Swaps</span>
                </div>
                <Switch 
                  checked={config.swapTokens.enabled} 
                  onCheckedChange={(checked) => handleToggle('swapTokens', checked)}
                />
              </div>
              
              {config.swapTokens.enabled && (
                <div className="pl-7 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="swap-interval" className="text-sm">
                        Interval (hours)
                      </Label>
                      <div className="flex items-center">
                        <Input 
                          id="swap-interval"
                          type="number"
                          min="1"
                          value={config.swapTokens.interval}
                          onChange={(e) => handleIntervalChange('swapTokens', e.target.value)}
                          className="max-w-[100px]"
                        />
                        <Timer size={14} className="ml-2 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="swap-min" className="text-sm">
                        Min Amount
                      </Label>
                      <Input 
                        id="swap-min"
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.swapTokens.minAmount}
                        onChange={(e) => handleAmountChange('swapTokens', 'minAmount', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="swap-max" className="text-sm">
                        Max Amount
                      </Label>
                      <Input 
                        id="swap-max"
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.swapTokens.maxAmount}
                        onChange={(e) => handleAmountChange('swapTokens', 'maxAmount', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={18} className="text-bot-warning" />
                  <span className="font-medium">Token Transfers</span>
                </div>
                <Switch 
                  checked={config.transferTokens.enabled} 
                  onCheckedChange={(checked) => handleToggle('transferTokens', checked)}
                />
              </div>
              
              {config.transferTokens.enabled && (
                <div className="pl-7 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="transfer-interval" className="text-sm">
                        Interval (hours)
                      </Label>
                      <div className="flex items-center">
                        <Input 
                          id="transfer-interval"
                          type="number"
                          min="1"
                          value={config.transferTokens.interval}
                          onChange={(e) => handleIntervalChange('transferTokens', e.target.value)}
                          className="max-w-[100px]"
                        />
                        <Timer size={14} className="ml-2 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="transfer-min" className="text-sm">
                        Min Amount
                      </Label>
                      <Input 
                        id="transfer-min"
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.transferTokens.minAmount}
                        onChange={(e) => handleAmountChange('transferTokens', 'minAmount', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="transfer-max" className="text-sm">
                        Max Amount
                      </Label>
                      <Input 
                        id="transfer-max"
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.transferTokens.maxAmount}
                        onChange={(e) => handleAmountChange('transferTokens', 'maxAmount', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other task configurations with similar structure */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileImage size={18} className="text-green-400" />
                  <span className="font-medium">NFT Minting</span>
                </div>
                <Switch 
                  checked={config.mintNFT.enabled} 
                  onCheckedChange={(checked) => handleToggle('mintNFT', checked)}
                />
              </div>
              
              {config.mintNFT.enabled && (
                <div className="pl-7 space-y-3">
                  <div>
                    <Label htmlFor="nft-interval" className="text-sm">
                      Interval (hours)
                    </Label>
                    <div className="flex items-center">
                      <Input 
                        id="nft-interval"
                        type="number"
                        min="1"
                        value={config.mintNFT.interval}
                        onChange={(e) => handleIntervalChange('mintNFT', e.target.value)}
                        className="max-w-[100px]"
                      />
                      <Timer size={14} className="ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-blue-400" />
                  <span className="font-medium">Domain Registration</span>
                </div>
                <Switch 
                  checked={config.registerDomain.enabled} 
                  onCheckedChange={(checked) => handleToggle('registerDomain', checked)}
                />
              </div>
              
              {config.registerDomain.enabled && (
                <div className="pl-7 space-y-3">
                  <div>
                    <Label htmlFor="domain-interval" className="text-sm">
                      Interval (hours)
                    </Label>
                    <div className="flex items-center">
                      <Input 
                        id="domain-interval"
                        type="number"
                        min="1"
                        value={config.registerDomain.interval}
                        onChange={(e) => handleIntervalChange('registerDomain', e.target.value)}
                        className="max-w-[100px]"
                      />
                      <Timer size={14} className="ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudUpload size={18} className="text-orange-400" />
                  <span className="font-medium">File Upload</span>
                </div>
                <Switch 
                  checked={config.uploadFile.enabled} 
                  onCheckedChange={(checked) => handleToggle('uploadFile', checked)}
                />
              </div>
              
              {config.uploadFile.enabled && (
                <div className="pl-7 space-y-3">
                  <div>
                    <Label htmlFor="upload-interval" className="text-sm">
                      Interval (hours)
                    </Label>
                    <div className="flex items-center">
                      <Input 
                        id="upload-interval"
                        type="number"
                        min="1"
                        value={config.uploadFile.interval}
                        onChange={(e) => handleIntervalChange('uploadFile', e.target.value)}
                        className="max-w-[100px]"
                      />
                      <Timer size={14} className="ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button onClick={saveConfig} className="w-full">
              Save Configuration
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
