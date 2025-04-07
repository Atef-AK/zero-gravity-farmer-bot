
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  NETWORK_CONFIG,
  TOKEN_ADDRESSES,
  DEX_ADDRESSES,
  CONTRACT_ADDRESSES,
  API_ENDPOINTS,
  CAPTCHA_CONFIG,
  GAS_CONFIG,
  ERC20_ABI
} from "@/utils/web3";

export default function Settings() {
  // Network settings
  const [network, setNetwork] = useState({ ...NETWORK_CONFIG });
  
  // Token addresses
  const [tokens, setTokens] = useState({ ...TOKEN_ADDRESSES });
  
  // DEX addresses
  const [dexes, setDexes] = useState({ ...DEX_ADDRESSES });
  
  // Contract addresses
  const [contracts, setContracts] = useState({ ...CONTRACT_ADDRESSES });
  
  // API endpoints
  const [apis, setApis] = useState({ ...API_ENDPOINTS });
  
  // Captcha settings
  const [captcha, setCaptcha] = useState({ ...CAPTCHA_CONFIG });
  
  // Gas settings
  const [gas, setGas] = useState({ ...GAS_CONFIG });
  
  // Custom ABI settings
  const [tokenAbi, setTokenAbi] = useState(JSON.stringify(ERC20_ABI, null, 2));
  
  const handleNetworkChange = (key, value) => {
    setNetwork(prev => ({ ...prev, [key]: value }));
  };
  
  const handleTokenChange = (key, value) => {
    setTokens(prev => ({ ...prev, [key]: value }));
  };
  
  const handleDexChange = (key, value) => {
    setDexes(prev => ({ ...prev, [key]: value }));
  };
  
  const handleContractChange = (key, value) => {
    setContracts(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApiChange = (key, value) => {
    setApis(prev => ({ ...prev, [key]: value }));
  };
  
  const handleCaptchaChange = (key, value) => {
    setCaptcha(prev => ({ ...prev, [key]: value }));
  };
  
  const handleGasChange = (key, value) => {
    setGas(prev => ({ ...prev, [key]: typeof value === 'string' ? Number(value) : value }));
  };
  
  const validateAbi = (abiString) => {
    try {
      JSON.parse(abiString);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleAbiChange = (value) => {
    setTokenAbi(value);
  };

  const saveSettings = () => {
    try {
      // In a real app, we would save these to localStorage or backend
      // For demo, just show success toast
      
      // Validate ABI
      if (tokenAbi && !validateAbi(tokenAbi)) {
        toast.error("Invalid ABI format");
        return;
      }
      
      localStorage.setItem("0g_network_config", JSON.stringify(network));
      localStorage.setItem("0g_token_addresses", JSON.stringify(tokens));
      localStorage.setItem("0g_dex_addresses", JSON.stringify(dexes));
      localStorage.setItem("0g_contract_addresses", JSON.stringify(contracts));
      localStorage.setItem("0g_api_endpoints", JSON.stringify(apis));
      localStorage.setItem("0g_captcha_config", JSON.stringify(captcha));
      localStorage.setItem("0g_gas_config", JSON.stringify(gas));
      localStorage.setItem("0g_token_abi", tokenAbi);
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const resetToDefaults = () => {
    setNetwork({ ...NETWORK_CONFIG });
    setTokens({ ...TOKEN_ADDRESSES });
    setDexes({ ...DEX_ADDRESSES });
    setContracts({ ...CONTRACT_ADDRESSES });
    setApis({ ...API_ENDPOINTS });
    setCaptcha({ ...CAPTCHA_CONFIG });
    setGas({ ...GAS_CONFIG });
    setTokenAbi(JSON.stringify(ERC20_ABI, null, 2));
    
    toast.success("Settings reset to defaults");
  };
  
  // Load saved settings on component mount
  useEffect(() => {
    try {
      const savedNetwork = localStorage.getItem("0g_network_config");
      const savedTokens = localStorage.getItem("0g_token_addresses");
      const savedDexes = localStorage.getItem("0g_dex_addresses");
      const savedContracts = localStorage.getItem("0g_contract_addresses");
      const savedApis = localStorage.getItem("0g_api_endpoints");
      const savedCaptcha = localStorage.getItem("0g_captcha_config");
      const savedGas = localStorage.getItem("0g_gas_config");
      const savedAbi = localStorage.getItem("0g_token_abi");
      
      if (savedNetwork) setNetwork(JSON.parse(savedNetwork));
      if (savedTokens) setTokens(JSON.parse(savedTokens));
      if (savedDexes) setDexes(JSON.parse(savedDexes));
      if (savedContracts) setContracts(JSON.parse(savedContracts));
      if (savedApis) setApis(JSON.parse(savedApis));
      if (savedCaptcha) setCaptcha(JSON.parse(savedCaptcha));
      if (savedGas) setGas(JSON.parse(savedGas));
      if (savedAbi) setTokenAbi(savedAbi);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure blockchain and application settings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={resetToDefaults}
          >
            <RefreshCw className="h-4 w-4" /> Reset to Defaults
          </Button>
          
          <Button 
            className="flex items-center gap-1"
            onClick={saveSettings}
          >
            <Save className="h-4 w-4" /> Save Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="network">
        <TabsList className="grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="tokens">Tokens & DEXes</TabsTrigger>
          <TabsTrigger value="apis">APIs & Services</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
              <CardDescription>
                Configure the blockchain network settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="network-name">Network Name</Label>
                  <Input
                    id="network-name"
                    value={network.name}
                    onChange={(e) => handleNetworkChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chain-id">Chain ID</Label>
                  <Input
                    id="chain-id"
                    type="number"
                    value={network.chainId}
                    onChange={(e) => handleNetworkChange('chainId', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rpc-url">RPC URL</Label>
                  <Input
                    id="rpc-url"
                    value={network.rpcUrl}
                    onChange={(e) => handleNetworkChange('rpcUrl', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ws-url">WebSocket URL</Label>
                  <Input
                    id="ws-url"
                    value={network.wsUrl}
                    onChange={(e) => handleNetworkChange('wsUrl', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="explorer-url">Block Explorer URL</Label>
                  <Input
                    id="explorer-url"
                    value={network.blockExplorerUrl}
                    onChange={(e) => handleNetworkChange('blockExplorerUrl', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="native-symbol">Native Token Symbol</Label>
                  <Input
                    id="native-symbol"
                    value={network.symbol}
                    onChange={(e) => handleNetworkChange('symbol', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gas-price">Gas Price (GWEI)</Label>
                <Input
                  id="gas-price"
                  type="number"
                  value={gas.gasPrice}
                  onChange={(e) => handleGasChange('gasPrice', Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="swaps-per-wallet">Swaps Per Wallet</Label>
                <Input
                  id="swaps-per-wallet"
                  type="number"
                  value={gas.swapsPerWallet}
                  onChange={(e) => handleGasChange('swapsPerWallet', Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Addresses</CardTitle>
              <CardDescription>
                Configure token contract addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usdt-address">USDT Address</Label>
                <Input
                  id="usdt-address"
                  value={tokens.USDT}
                  onChange={(e) => handleTokenChange('USDT', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="btc-address">BTC Address</Label>
                <Input
                  id="btc-address"
                  value={tokens.BTC}
                  onChange={(e) => handleTokenChange('BTC', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eth-address">ETH Address</Label>
                <Input
                  id="eth-address"
                  value={tokens.ETH}
                  onChange={(e) => handleTokenChange('ETH', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>DEX Addresses</CardTitle>
              <CardDescription>
                Configure DEX router contract addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zero-dex-router">ZeroDex Router</Label>
                <Input
                  id="zero-dex-router"
                  value={dexes.zeroDexRouter}
                  onChange={(e) => handleDexChange('zeroDexRouter', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zero-hub-router">0G Hub Router</Label>
                <Input
                  id="zero-hub-router"
                  value={dexes.zeroGHubRouter}
                  onChange={(e) => handleDexChange('zeroGHubRouter', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="faucet-contract">Faucet Contract</Label>
                <Input
                  id="faucet-contract"
                  value={dexes.faucetContract}
                  onChange={(e) => handleDexChange('faucetContract', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Configure API endpoints for services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faucet-api">Faucet API</Label>
                <Input
                  id="faucet-api"
                  value={apis.faucet}
                  onChange={(e) => handleApiChange('faucet', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="swap-api">Swap API</Label>
                <Input
                  id="swap-api"
                  value={apis.swap}
                  onChange={(e) => handleApiChange('swap', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nft-mint-api">NFT Mint API</Label>
                <Input
                  id="nft-mint-api"
                  value={apis.nftMint}
                  onChange={(e) => handleApiChange('nftMint', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storage-api">Storage API</Label>
                <Input
                  id="storage-api"
                  value={apis.storage}
                  onChange={(e) => handleApiChange('storage', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Captcha & Proxy Configuration</CardTitle>
              <CardDescription>
                Configure captcha solving and proxy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="captcha-site-key">Captcha Site Key</Label>
                <Input
                  id="captcha-site-key"
                  value={captcha.siteKey}
                  onChange={(e) => handleCaptchaChange('siteKey', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="captcha-api-key">2Captcha API Key</Label>
                <Input
                  id="captcha-api-key"
                  value={captcha.apiKey}
                  type="password"
                  onChange={(e) => handleCaptchaChange('apiKey', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proxy-host">Proxy Host</Label>
                <Input
                  id="proxy-host"
                  value={captcha.proxyHost}
                  onChange={(e) => handleCaptchaChange('proxyHost', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proxy-username">Proxy Username</Label>
                  <Input
                    id="proxy-username"
                    value={captcha.proxyUsername}
                    onChange={(e) => handleCaptchaChange('proxyUsername', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="proxy-password">Proxy Password</Label>
                  <Input
                    id="proxy-password"
                    type="password"
                    value={captcha.proxyPassword}
                    onChange={(e) => handleCaptchaChange('proxyPassword', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom ABI Configuration</CardTitle>
              <CardDescription>
                Configure custom ABIs for token interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-abi">Token ABI</Label>
                <Textarea
                  id="token-abi"
                  value={tokenAbi}
                  onChange={(e) => handleAbiChange(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                {tokenAbi && !validateAbi(tokenAbi) && (
                  <p className="text-destructive text-sm">Invalid ABI format</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Addresses</CardTitle>
              <CardDescription>
                Configure addresses for other smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flow-contract">Flow Contract</Label>
                <Input
                  id="flow-contract"
                  value={contracts.flow}
                  onChange={(e) => handleContractChange('flow', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mine-contract">Mine Contract</Label>
                <Input
                  id="mine-contract"
                  value={contracts.mine}
                  onChange={(e) => handleContractChange('mine', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="market-contract">Market Contract</Label>
                <Input
                  id="market-contract"
                  value={contracts.market}
                  onChange={(e) => handleContractChange('market', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reward-contract">Reward Contract</Label>
                <Input
                  id="reward-contract"
                  value={contracts.reward}
                  onChange={(e) => handleContractChange('reward', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
