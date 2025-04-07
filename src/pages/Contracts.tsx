
import { SmartContractConfigurator } from "@/components/SmartContractConfigurator";

export default function Contracts() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Smart Contracts</h1>
      <p className="text-muted-foreground">Manage your DEX, NFT, and other smart contracts for automation.</p>
      
      <SmartContractConfigurator />
    </div>
  );
}
