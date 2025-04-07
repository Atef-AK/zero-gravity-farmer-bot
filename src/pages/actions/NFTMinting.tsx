
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { Upload, FileUp, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { mintNFT, estimateGas } from '@/utils/web3';

export default function NFTMinting() {
  const { selectedWallets } = useApp();
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftType, setNftType] = useState("erc721");
  const [nftImage, setNftImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<number | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const hasSelectedWallets = selectedWallets.length > 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // Convert ArrayBuffer to string if needed
        const result = typeof event.target.result === 'string' 
          ? event.target.result 
          : new TextDecoder().decode(event.target.result as ArrayBuffer);
          
        setNftImage(result);
      }
      setUploading(false);
    };
    
    reader.onerror = () => {
      toast.error("Failed to read image file");
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleEstimateGas = async () => {
    if (!hasSelectedWallets) {
      toast.error("Please select at least one wallet");
      return;
    }
    
    if (!nftName || !nftDescription || !nftImage) {
      toast.error("Please fill out all NFT details");
      return;
    }
    
    try {
      // Estimate gas for first selected wallet
      const wallet = selectedWallets[0];
      const estimate = await estimateGas({
        type: nftType,
        name: nftName,
        description: nftDescription,
        image: nftImage
      }, wallet.address);
      
      setGasEstimate(estimate);
      toast.success("Gas estimation completed");
    } catch (error) {
      console.error("Gas estimation failed:", error);
      toast.error("Failed to estimate gas");
    }
  };

  const handleMintNFT = async () => {
    if (!hasSelectedWallets) {
      toast.error("Please select at least one wallet");
      return;
    }
    
    if (!nftName || !nftDescription || !nftImage) {
      toast.error("Please fill out all NFT details");
      return;
    }
    
    setMinting(true);
    setTxStatus("pending");
    
    try {
      // Use the first selected wallet to mint
      const wallet = selectedWallets[0];
      
      const metadata = {
        type: nftType,
        name: nftName,
        description: nftDescription,
        image: nftImage
      };
      
      const txHash = await mintNFT(metadata, wallet.address, wallet.privateKey);
      setTransactionHash(txHash);
      setTxStatus("success");
      
      toast.success("NFT minted successfully");
      
      // Reset form
      setNftName("");
      setNftDescription("");
      setNftImage("");
      setNftType("erc721");
    } catch (error) {
      console.error("NFT minting failed:", error);
      toast.error("Failed to mint NFT");
      setTxStatus("error");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NFT Minting</h1>
        <p className="text-muted-foreground">Create and mint new NFTs for your wallets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>NFT Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nft-type">NFT Type</Label>
              <Select value={nftType} onValueChange={setNftType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select NFT Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erc721">ERC-721 (Unique NFT)</SelectItem>
                  <SelectItem value="erc1155">ERC-1155 (Multi-token Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-name">Name</Label>
              <Input 
                id="nft-name" 
                placeholder="My Awesome NFT" 
                value={nftName} 
                onChange={(e) => setNftName(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-description">Description</Label>
              <Textarea 
                id="nft-description" 
                placeholder="Describe your NFT..." 
                value={nftDescription} 
                onChange={(e) => setNftDescription(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-image">Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-gray-400 transition-all">
                {nftImage ? (
                  <div className="space-y-2">
                    <img 
                      src={nftImage} 
                      alt="NFT Preview" 
                      className="max-h-40 mx-auto rounded-md" 
                    />
                    <Button variant="outline" onClick={() => setNftImage("")} className="w-full">
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload size={32} className="mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mb-2">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </span>
                    <Input 
                      id="nft-image" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploading} 
                    />
                    <Button variant="outline" disabled={uploading}>
                      <FileUp className="mr-2 h-4 w-4" /> Browse Files
                    </Button>
                  </label>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mint Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Selected Wallet</h3>
              {hasSelectedWallets ? (
                <div>
                  <p className="text-sm mb-1">
                    {selectedWallets.length} wallet{selectedWallets.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Using {selectedWallets[0]?.address.slice(0, 6)}...{selectedWallets[0]?.address.slice(-4)} for minting
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No wallets selected</p>
              )}
            </div>

            {gasEstimate !== null && (
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Gas Estimate</h3>
                <p className="text-sm">
                  Estimated gas: <span className="font-mono">{gasEstimate.toLocaleString()}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleEstimateGas} 
                disabled={!hasSelectedWallets || !nftName || !nftDescription || !nftImage} 
                variant="outline" 
                className="w-full"
              >
                Estimate Gas
              </Button>
              
              <Button 
                onClick={handleMintNFT} 
                disabled={!hasSelectedWallets || !nftName || !nftDescription || !nftImage || minting} 
                className="w-full"
              >
                {minting ? "Minting..." : "Mint NFT"}
              </Button>
            </div>

            {txStatus !== "idle" && (
              <div className={`p-4 rounded-md ${
                txStatus === "pending" ? "bg-yellow-100/20 border border-yellow-300/30" : 
                txStatus === "success" ? "bg-green-100/20 border border-green-300/30" : 
                "bg-red-100/20 border border-red-300/30"
              }`}>
                <div className="flex items-center">
                  {txStatus === "pending" && <AlertCircle size={16} className="text-yellow-500 mr-2" />}
                  {txStatus === "success" && <Check size={16} className="text-green-500 mr-2" />}
                  {txStatus === "error" && <AlertCircle size={16} className="text-red-500 mr-2" />}
                  
                  <h3 className="font-medium">
                    {txStatus === "pending" ? "Transaction Pending" : 
                     txStatus === "success" ? "Transaction Successful" : 
                     "Transaction Failed"}
                  </h3>
                </div>
                
                {transactionHash && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Transaction Hash:</p>
                    <p className="text-xs font-mono break-all mt-1">{transactionHash}</p>
                    <Button 
                      variant={txStatus === "success" ? "default" : "outline"} 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.open(`https://chainscan-newton.0g.ai/tx/${transactionHash}`, '_blank')}
                    >
                      View on Explorer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
