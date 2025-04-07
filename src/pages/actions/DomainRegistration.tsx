
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { registerDomain } from "@/utils/web3";

export default function DomainRegistration() {
  const { selectedWallets } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [domainName, setDomainName] = useState("");
  
  const hasSelectedWallets = selectedWallets.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName || !hasSelectedWallets) return;
    
    setIsRegistering(true);
    
    try {
      for (const wallet of selectedWallets) {
        toast.loading(`Registering ${domainName}.0g using wallet ${wallet.address.slice(0, 6)}...`);
        
        const result = await registerDomain(wallet.privateKey, domainName);
        
        if (result.success) {
          toast.success(`Domain ${result.domain}.0g successfully registered! TX: ${result.txHash.slice(0, 10)}...`);
        } else {
          toast.error("Registration failed.");
        }
      }
      
      setDomainName("");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register domain");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Domain Registration</h1>
          <p className="text-muted-foreground">Register .0g domains on the Newton testnet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Register Domain</CardTitle>
            <CardDescription>
              Register a .0g domain on the Newton testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <div className="flex">
                  <Input
                    id="domain"
                    placeholder="mydomain"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="rounded-r-none"
                  />
                  <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
                    .0g
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!domainName || !hasSelectedWallets || isRegistering}
              >
                <Globe className="w-4 h-4 mr-2" />
                {isRegistering ? "Registering..." : "Register Domain"}
              </Button>
              
              {!hasSelectedWallets && (
                <p className="text-sm text-center text-amber-400">
                  Please select at least one wallet first
                </p>
              )}
            </form>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Domain Information</CardTitle>
            <CardDescription>
              How .0g domains work on Newton testnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-4">
              <p>
                .0g domains are decentralized domains that work on the Newton testnet blockchain.
                Once registered, a domain can be used for various purposes like website hosting, 
                wallet addressing, and more.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Domain features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>No renewal fees - register once, own forever</li>
                  <li>Connect to decentralized websites</li>
                  <li>Use as blockchain username</li>
                  <li>Integrate with 0G decentralized apps</li>
                </ul>
              </div>
              
              <p className="text-amber-400">
                Note: Domain registration costs 0.5 A0GI tokens plus gas fees
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
