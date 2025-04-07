
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { FileImage } from "lucide-react";
import { toast } from "sonner";
import { mintNFT } from "@/utils/web3";

export default function NFTMinting() {
  const { selectedWallets } = useApp();
  const [isMinting, setIsMinting] = useState(false);
  
  const hasSelectedWallets = selectedWallets.length > 0;

  const handleMint = async () => {
    if (!hasSelectedWallets) return;
    
    setIsMinting(true);
    
    try {
      for (const wallet of selectedWallets) {
        toast.loading(`Minting NFT using wallet ${wallet.address.slice(0, 6)}...`);
        
        const result = await mintNFT(wallet.privateKey);
        
        if (result.success) {
          toast.success(`NFT successfully minted! Token ID: ${result.tokenId}, TX: ${result.txHash.slice(0, 10)}...`);
        } else {
          toast.error("Minting failed.");
        }
      }
    } catch (error) {
      console.error("Minting error:", error);
      toast.error(error.message || "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NFT Minting</h1>
          <p className="text-muted-foreground">Mint NFTs on the Newton testnet</p>
        </div>
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
            <div className="border-2 border-dashed border-border/50 rounded-md p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileImage className="h-20 w-20 text-bot-primary" />
                <p className="text-center font-medium">0G Testnet NFT Collection</p>
                <p className="text-sm text-muted-foreground text-center">
                  Mint a random generative NFT on the Newton testnet
                </p>
              </div>
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
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>NFT Information</CardTitle>
            <CardDescription>
              About 0G testnet NFTs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-4">
              <p>
                0G Testnet NFTs are non-fungible tokens on the Newton testnet blockchain.
                These NFTs are generated randomly and can be used to test NFT functionality
                on the Newton testnet.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium">NFT features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>ERC-721 compatible</li>
                  <li>Randomly generated artwork</li>
                  <li>Viewable in NFT explorers</li>
                  <li>Tradable on 0G marketplaces</li>
                </ul>
              </div>
              
              <p className="text-amber-400">
                Note: Minting costs 0.2 A0GI tokens plus gas fees
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
