
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { 
  ArrowUpRight, 
  Repeat, 
  FileImage,
  Globe,
  CloudUpload,
  Timer,
  Save,
  Settings,
  BarChart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdvancedTaskConfigurator() {
  const { selectedWallets } = useApp();
  const hasSelectedWallets = selectedWallets.length > 0;

  // Task configuration state
  const [config, setConfig] = useState({
    claimFaucet: {
      enabled: true,
      interval: 24, // hours
      tokens: ["A0GI", "USDT", "BTC", "ETH"],
      txPerWallet: 1,
      randomize: true,
      timeWindow: {
        start: 0, // hour of day (0-23)
        end: 24, // hour of day (0-23)
      }
    },
    swapTokens: {
      enabled: true,
      interval: 12, // hours
      minAmount: 0.1,
      maxAmount: 1,
      txPerWallet: 3,
      pairs: [
        { from: "A0GI", to: "USDT" },
        { from: "USDT", to: "BTC" },
        { from: "BTC", to: "ETH" },
        { from: "ETH", to: "A0GI" }
      ],
      randomize: true,
      customDex: "ZeroDex Router",
      timeWindow: {
        start: 0, 
        end: 24, 
      }
    },
    transferTokens: {
      enabled: true,
      interval: 16, // hours
      minAmount: 0.05,
      maxAmount: 0.5,
      txPerWallet: 2,
      randomize: true,
      timeWindow: {
        start: 0,
        end: 24,
      }
    },
    mintNFT: {
      enabled: true,
      interval: 48, // hours
      txPerWallet: 1,
      randomize: true,
      timeWindow: {
        start: 0,
        end: 24,
      }
    },
    registerDomain: {
      enabled: true,
      interval: 72, // hours
      txPerWallet: 1,
      randomize: true,
      timeWindow: {
        start: 0,
        end: 24,
      }
    },
    uploadFile: {
      enabled: true,
      interval: 36, // hours
      txPerWallet: 1,
      randomize: true,
      timeWindow: {
        start: 0,
        end: 24,
      }
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

  const handleTxPerWalletChange = (task, value) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        txPerWallet: parseInt(value) || 1
      }
    }));
  };

  const handleRandomizeToggle = (task, value) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        randomize: value
      }
    }));
  };

  const handleTimeWindowChange = (task, type, value) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        timeWindow: {
          ...prev[task].timeWindow,
          [type]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleCustomDexChange = (task, value) => {
    setConfig(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        customDex: value
      }
    }));
  };

  const saveConfig = () => {
    toast.success("Advanced task configuration saved");
  };

  return (
    <Card className="border-border/40 bg-bot-card">
      <CardHeader className="border-b border-border/20 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Advanced Task Configuration</CardTitle>
        <Settings className="h-4 w-4" />
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="faucet">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="faucet">Faucet</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="other">Other Actions</TabsTrigger>
          </TabsList>
          
          {!hasSelectedWallets ? (
            <div className="text-center text-muted-foreground p-4">
              Select wallets to configure tasks.
            </div>
          ) : (
            <>
              <TabsContent value="faucet">
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
                    <div className="pl-7 space-y-4">
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
                        <div>
                          <Label htmlFor="claim-tx-per-wallet" className="text-sm">
                            Transactions per wallet
                          </Label>
                          <Input 
                            id="claim-tx-per-wallet"
                            type="number"
                            min="1"
                            value={config.claimFaucet.txPerWallet}
                            onChange={(e) => handleTxPerWalletChange('claimFaucet', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="randomize-claims"
                          checked={config.claimFaucet.randomize}
                          onCheckedChange={(checked) => handleRandomizeToggle('claimFaucet', checked)}
                        />
                        <Label htmlFor="randomize-claims">Randomize timings</Label>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Time window</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="claim-time-start" className="text-xs text-muted-foreground">
                              Start hour
                            </Label>
                            <Input 
                              id="claim-time-start"
                              type="number"
                              min="0"
                              max="23"
                              value={config.claimFaucet.timeWindow.start}
                              onChange={(e) => handleTimeWindowChange('claimFaucet', 'start', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="claim-time-end" className="text-xs text-muted-foreground">
                              End hour
                            </Label>
                            <Input 
                              id="claim-time-end"
                              type="number"
                              min="0"
                              max="24"
                              value={config.claimFaucet.timeWindow.end}
                              onChange={(e) => handleTimeWindowChange('claimFaucet', 'end', e.target.value)}
                            />
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
              </TabsContent>
              
              <TabsContent value="trading">
                <div className="space-y-6">
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
                      <div className="pl-7 space-y-4">
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
                        
                        <div>
                          <Label htmlFor="swap-tx-per-wallet" className="text-sm">
                            Transactions per wallet
                          </Label>
                          <Input 
                            id="swap-tx-per-wallet"
                            type="number"
                            min="1"
                            value={config.swapTokens.txPerWallet}
                            onChange={(e) => handleTxPerWalletChange('swapTokens', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="custom-dex" className="text-sm">
                            DEX to use
                          </Label>
                          <Select 
                            value={config.swapTokens.customDex}
                            onValueChange={(value) => handleCustomDexChange('swapTokens', value)}
                          >
                            <SelectTrigger id="custom-dex">
                              <SelectValue placeholder="Select DEX" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ZeroDex Router">ZeroDex Router</SelectItem>
                              <SelectItem value="0G Hub Router">0G Hub Router</SelectItem>
                              <SelectItem value="Custom">Custom DEX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="randomize-swaps"
                            checked={config.swapTokens.randomize}
                            onCheckedChange={(checked) => handleRandomizeToggle('swapTokens', checked)}
                          />
                          <Label htmlFor="randomize-swaps">Randomize amounts and timings</Label>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Time window</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <Label htmlFor="swap-time-start" className="text-xs text-muted-foreground">
                                Start hour
                              </Label>
                              <Input 
                                id="swap-time-start"
                                type="number"
                                min="0"
                                max="23"
                                value={config.swapTokens.timeWindow.start}
                                onChange={(e) => handleTimeWindowChange('swapTokens', 'start', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="swap-time-end" className="text-xs text-muted-foreground">
                                End hour
                              </Label>
                              <Input 
                                id="swap-time-end"
                                type="number"
                                min="0"
                                max="24"
                                value={config.swapTokens.timeWindow.end}
                                onChange={(e) => handleTimeWindowChange('swapTokens', 'end', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm">Token Pairs</Label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {config.swapTokens.pairs.map((pair, index) => (
                              <div key={index} className="text-center p-2 rounded-lg bg-bot-accent/10 flex items-center justify-center gap-2">
                                <span>{pair.from}</span>
                                <ArrowUpRight size={14} />
                                <span>{pair.to}</span>
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
                        
                        <div>
                          <Label htmlFor="transfer-tx-per-wallet" className="text-sm">
                            Transactions per wallet
                          </Label>
                          <Input 
                            id="transfer-tx-per-wallet"
                            type="number"
                            min="1"
                            value={config.transferTokens.txPerWallet}
                            onChange={(e) => handleTxPerWalletChange('transferTokens', e.target.value)}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="randomize-transfers"
                            checked={config.transferTokens.randomize}
                            onCheckedChange={(checked) => handleRandomizeToggle('transferTokens', checked)}
                          />
                          <Label htmlFor="randomize-transfers">Randomize amounts and timings</Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="other">
                <div className="space-y-6">
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
                        <div className="grid grid-cols-2 gap-4">
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
                          <div>
                            <Label htmlFor="nft-tx-per-wallet" className="text-sm">
                              Transactions per wallet
                            </Label>
                            <Input 
                              id="nft-tx-per-wallet"
                              type="number"
                              min="1"
                              value={config.mintNFT.txPerWallet}
                              onChange={(e) => handleTxPerWalletChange('mintNFT', e.target.value)}
                            />
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
                        <div className="grid grid-cols-2 gap-4">
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
                          <div>
                            <Label htmlFor="domain-tx-per-wallet" className="text-sm">
                              Transactions per wallet
                            </Label>
                            <Input 
                              id="domain-tx-per-wallet"
                              type="number"
                              min="1"
                              value={config.registerDomain.txPerWallet}
                              onChange={(e) => handleTxPerWalletChange('registerDomain', e.target.value)}
                            />
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
                        <div className="grid grid-cols-2 gap-4">
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
                          <div>
                            <Label htmlFor="upload-tx-per-wallet" className="text-sm">
                              Transactions per wallet
                            </Label>
                            <Input 
                              id="upload-tx-per-wallet"
                              type="number"
                              min="1"
                              value={config.uploadFile.txPerWallet}
                              onChange={(e) => handleTxPerWalletChange('uploadFile', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
        
        <div className="mt-6">
          <Button onClick={saveConfig} className="w-full">
            <Save className="h-4 w-4 mr-2" /> Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
