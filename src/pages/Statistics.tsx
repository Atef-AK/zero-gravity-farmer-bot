
import { StatisticsCharts } from "@/components/StatisticsCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data for wallet statistics
const walletStats = [
  { wallet: "Wallet 1", totalTx: 156, successRate: 98.2, avgGasUsed: 126734, totalInteractions: 243 },
  { wallet: "Wallet 2", totalTx: 89, successRate: 95.7, avgGasUsed: 118922, totalInteractions: 122 },
  { wallet: "Wallet 3", totalTx: 211, successRate: 99.1, avgGasUsed: 132541, totalInteractions: 310 },
  { wallet: "Wallet 4", totalTx: 67, successRate: 92.3, avgGasUsed: 109832, totalInteractions: 98 },
  { wallet: "Wallet 5", totalTx: 178, successRate: 97.8, avgGasUsed: 124631, totalInteractions: 256 },
];

export default function Statistics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
      <p className="text-muted-foreground">Detailed analytics and performance metrics for your wallets.</p>
      
      <StatisticsCharts />
      
      <Card>
        <CardHeader>
          <CardTitle>Wallet Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet</TableHead>
                <TableHead className="text-right">Total Transactions</TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
                <TableHead className="text-right">Avg. Gas Used</TableHead>
                <TableHead className="text-right">Total Interactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletStats.map((stat) => (
                <TableRow key={stat.wallet}>
                  <TableCell className="font-medium">{stat.wallet}</TableCell>
                  <TableCell className="text-right">{stat.totalTx}</TableCell>
                  <TableCell className="text-right">{stat.successRate}%</TableCell>
                  <TableCell className="text-right">{stat.avgGasUsed.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stat.totalInteractions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
