
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { toast } from "@/components/ui/sonner";
import { ethers } from "ethers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AddWalletForm() {
  const { addWallet, importWallets } = useApp();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleAddWallet = () => {
    try {
      // Validate private key and address
      if (!privateKey) {
        toast.error("Private key is required");
        return;
      }
      
      // Generate address from private key if not provided
      let walletAddress = address;
      if (!walletAddress) {
        try {
          const wallet = new ethers.Wallet(privateKey);
          walletAddress = wallet.address;
        } catch (error) {
          toast.error("Invalid private key");
          return;
        }
      } else {
        // Validate address
        try {
          ethers.utils.getAddress(walletAddress);
        } catch (error) {
          toast.error("Invalid wallet address");
          return;
        }
      }
      
      addWallet({
        name: name || `Wallet ${Date.now()}`,
        address: walletAddress,
        privateKey: privateKey
      });
      
      // Reset form
      setName("");
      setAddress("");
      setPrivateKey("");
    } catch (error) {
      console.error("Error adding wallet:", error);
      toast.error("Failed to add wallet");
    }
  };

  const handleImportFile = async () => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }
    
    setImporting(true);
    
    try {
      // This is a mock implementation - in a real app, you'd parse the DB file
      // For this demo, we'll simulate reading a CSV or JSON file
      
      // Simulated file read delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app, you'd parse the actual file
      const mockWallets = [
        { address: "0x1234567890123456789012345678901234567890", privateKey: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" },
        { address: "0x0987654321098765432109876543210987654321", privateKey: "0x0987654321abcdef0987654321abcdef0987654321abcdef0987654321abcdef" },
      ];
      
      importWallets(mockWallets);
      setFile(null);
    } catch (error) {
      console.error("Error importing wallets:", error);
      toast.error("Failed to import wallets");
    } finally {
      setImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Tabs defaultValue="manual">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="manual">Add Manually</TabsTrigger>
        <TabsTrigger value="import">Import</TabsTrigger>
      </TabsList>
      
      <TabsContent value="manual" className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Wallet Name (Optional)</Label>
            <Input 
              id="name" 
              placeholder="My Wallet"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="address">Wallet Address (Optional if Private Key is valid)</Label>
            <Input 
              id="address" 
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="private-key">Private Key</Label>
            <Input 
              id="private-key" 
              placeholder="0x..." 
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Private keys are stored locally and never sent over the network.
            </p>
          </div>
          
          <Button onClick={handleAddWallet} className="w-full">
            Add Wallet
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="import" className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Import from .db file</Label>
            <Input 
              id="file" 
              type="file" 
              accept=".db,.sqlite,.json,.csv"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Import from a database file with 'address' and 'private_key' columns.
            </p>
          </div>
          
          {file && (
            <div className="text-sm">
              Selected file: {file.name}
            </div>
          )}
          
          <Button 
            onClick={handleImportFile} 
            className="w-full"
            disabled={!file || importing}
          >
            {importing ? "Importing..." : "Import Wallets"}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
