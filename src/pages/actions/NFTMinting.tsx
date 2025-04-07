
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { FileImage, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { mintNFT, estimateGasFee } from "@/utils/web3";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function NFTMinting() {
  const { selectedWallets, startAllTasks } = useApp();
  const [isMinting, setIsMinting] = useState(false);
  const [nftType, setNftType] = useState("ERC721");
  const [nftName, setNftName] = useState("0G NFT");
  const [nftDescription, setNftDescription] = useState("A unique NFT on the Newton testnet");
  const [gasEstimate, setGasEstimate] = useState("");
  const [mintingResults, setMintingResults] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  
  const hasSelectedWallets = selectedWallets.length > 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleEstimateGas = async () => {
    if (!hasSelectedWallets) return;
    
    try {
      const estimate = await estimateGasFee(selectedWallets[0].privateKey, nftType);
      setGasEstimate(`≈ ${estimate} A0GI`);
      toast.success("Gas fee estimated successfully");
    } catch (error) {
      console.error("Gas estimation error:", error);
      toast.error("Failed to estimate gas fee");
    }
  };

  const handleMint = async () => {
    if (!hasSelectedWallets) return;
    
    setIsMinting(true);
    setMintingResults([]);
    
    try {
      const results = [];
      
      for (const wallet of selectedWallets) {
        toast.loading(`Minting NFT using wallet ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`);
        
        const mintData = {
          name: nftName,
          description: nftDescription,
          type: nftType,
          imageData: imagePreview || null
        };
        
        const result = await mintNFT(wallet.privateKey, mintData);
        
        const walletResult = {
          address: wallet.address,
          success: result.success,
          txHash: result.txHash,
          tokenId: result.tokenId,
          timestamp: new Date().toISOString()
        };
        
        results.push(walletResult);
        
        if (result.success) {
          toast.success(`NFT successfully minted! Token ID: ${result.tokenId}, TX: ${result.txHash.slice(0, 10)}...`);
        } else {
          toast.error("Minting failed.");
        }
      }
      
      setMintingResults(results);
    } catch (error) {
      console.error("Minting error:", error);
      toast.error(error.message || "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  const startAutoMinting = () => {
    if (!hasSelectedWallets) {
      toast.error("Please select at least one wallet first");
      return;
    }
    
    startAllTasks();
    toast.success("Automatic minting tasks started for selected wallets");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NFT Minting</h1>
          <p className="text-muted-foreground">Mint NFTs on the Newton testnet</p>
        </div>
        <Button onClick={startAutoMinting} disabled={!hasSelectedWallets || isMinting}>
          Start Auto-Minting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Mint NFT</CardTitle>
            <CardDescription>
              Mint a new NFT on the Newton testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nft-type">NFT Type</Label>
                <Select
                  value={nftType}
                  onValueChange={setNftType}
                >
                  <SelectTrigger id="nft-type">
                    <SelectValue placeholder="Select NFT Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ERC721">ERC-721 (Single NFT)</SelectItem>
                    <SelectItem value="ERC1155">ERC-1155 (Multiple NFT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="nft-name">NFT Name</Label>
                <Input
                  id="nft-name"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  placeholder="Enter NFT name"
                />
              </div>
              
              <div>
                <Label htmlFor="nft-description">Description</Label>
                <Textarea
                  id="nft-description"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  placeholder="Enter NFT description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>NFT Image</Label>
                <div 
                  className={`border-2 border-dashed border-border/50 rounded-md p-6 cursor-pointer transition-colors hover:border-bot-primary/50 ${imagePreview ? 'bg-bot-primary/5' : ''}`}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="relative w-40 h-40">
                        <img 
                          src={imagePreview} 
                          alt="NFT Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-center text-bot-primary">
                        <Upload className="h-4 w-4 inline mr-1" />
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileImage className="h-20 w-20 text-bot-primary" />
                      <p className="text-center font-medium">Upload NFT Image</p>
                      <p className="text-sm text-muted-foreground text-center">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleEstimateGas}
                  disabled={!hasSelectedWallets}
                >
                  Estimate Gas Fee
                </Button>
                {gasEstimate && (
                  <Badge variant="outline" className="text-amber-500">
                    {gasEstimate}
                  </Badge>
                )}
              </div>
              
              <Button 
                className="w-full" 
                disabled={!hasSelectedWallets || isMinting}
                onClick={handleMint}
              >
                <FileImage className="w-4 h-4 mr-2" />
                {isMinting ? "Minting..." : "Mint NFT"}
              </Button>
              
              {!hasSelectedWallets && (
                <p className="text-sm text-center text-amber-400">
                  Please select at least one wallet first
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Minting Results</CardTitle>
            <CardDescription>
              Transaction details for your minted NFTs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
            {mintingResults.length > 0 ? (
              <div className="space-y-3">
                {mintingResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                  >
                    <div className="flex items-start gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Wallet: {result.address.slice(0, 6)}...{result.address.slice(-4)}</p>
                          <Badge variant={result.success ? "success" : "destructive"}>
                            {result.success ? "Success" : "Failed"}
                          </Badge>
                        </div>
                        {result.success && (
                          <>
                            <p className="text-xs">Token ID: <span className="font-mono">{result.tokenId}</span></p>
                            <p className="text-xs">TX Hash: <span className="font-mono">{result.txHash.slice(0, 18)}...</span></p>
                            <p className="text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleString()}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileImage className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>No minting transactions yet</p>
                <p className="text-sm">Mint an NFT to see transaction details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
