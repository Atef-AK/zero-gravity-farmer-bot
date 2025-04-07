
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Plus, Save, Trash } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample contracts - in real app, this would be stored in database and managed through AppContext
const sampleContracts = [
  { id: 1, name: "ZeroDex Router", type: "DEX", address: "0x33d9B68db9704c6d4E75453156e8BD8C2DEa4526", status: "active" },
  { id: 2, name: "0G NFT Marketplace", type: "NFT", address: "0x1785c8683b3c527618eFfF78d876d9dCB4b70285", status: "active" },
  { id: 3, name: "Custom Staking", type: "Staking", address: "0x0460aA47b41a66694c0a73f667a1b795A5ED3556", status: "inactive" }
];

export function SmartContractConfigurator() {
  const [contracts, setContracts] = useState(sampleContracts);
  const [isAdding, setIsAdding] = useState(false);
  const [newContract, setNewContract] = useState({
    name: "",
    type: "DEX",
    address: "",
    abi: "",
    status: "active"
  });

  const handleAddContract = () => {
    if (!newContract.name || !newContract.address || !newContract.abi) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Validate ABI by attempting to parse it
      JSON.parse(newContract.abi);
      
      setContracts(prev => [
        ...prev, 
        {
          id: Date.now(), 
          ...newContract
        }
      ]);
      
      setNewContract({
        name: "",
        type: "DEX",
        address: "",
        abi: "",
        status: "active"
      });
      
      setIsAdding(false);
      toast.success("Contract added successfully");
    } catch (error) {
      toast.error("Invalid ABI format");
    }
  };

  const handleDeleteContract = (id) => {
    setContracts(prev => prev.filter(contract => contract.id !== id));
    toast.success("Contract removed");
  };

  const handleVerifyContract = (address) => {
    // Simulated verification - in a real app, this would verify the contract on the blockchain
    toast.success("Contract verified on the blockchain");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Smart Contract Configuration</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancel" : <><Plus className="h-4 w-4 mr-1" /> Add Contract</>}
          </Button>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="border rounded-lg p-4 mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Contract Name</Label>
                  <Input 
                    id="name" 
                    value={newContract.name}
                    onChange={(e) => setNewContract({...newContract, name: e.target.value})}
                    placeholder="e.g., Custom DEX Router"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Contract Type</Label>
                  <Select 
                    value={newContract.type}
                    onValueChange={(value) => setNewContract({...newContract, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEX">DEX</SelectItem>
                      <SelectItem value="NFT">NFT</SelectItem>
                      <SelectItem value="Staking">Staking</SelectItem>
                      <SelectItem value="Token">Token</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Contract Address</Label>
                <Input 
                  id="address" 
                  value={newContract.address}
                  onChange={(e) => setNewContract({...newContract, address: e.target.value})}
                  placeholder="0x..."
                />
              </div>
              
              <div>
                <Label htmlFor="abi">Contract ABI</Label>
                <Textarea 
                  id="abi" 
                  value={newContract.abi}
                  onChange={(e) => setNewContract({...newContract, abi: e.target.value})}
                  placeholder="Paste JSON ABI here"
                  className="min-h-[200px] font-mono text-xs"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleAddContract}>
                  <Save className="h-4 w-4 mr-1" /> Save Contract
                </Button>
              </div>
            </div>
          )}
          
          {contracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.name}</TableCell>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {contract.address.substring(0, 10)}...{contract.address.substring(contract.address.length - 8)}
                    </TableCell>
                    <TableCell>
                      {contract.status === "active" ? (
                        <span className="flex items-center text-green-500">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mr-1" /> Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleVerifyContract(contract.address)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500"
                          onClick={() => handleDeleteContract(contract.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No contracts added yet. Add a new contract to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
