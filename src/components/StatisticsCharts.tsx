
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

// Sample data - in a real app, this would come from the AppContext
const activityData = [
  { name: 'Mon', swaps: 12, transfers: 10, claims: 6, nfts: 2 },
  { name: 'Tue', swaps: 19, transfers: 8, claims: 5, nfts: 3 },
  { name: 'Wed', swaps: 15, transfers: 12, claims: 8, nfts: 1 },
  { name: 'Thu', swaps: 18, transfers: 13, claims: 7, nfts: 2 },
  { name: 'Fri', swaps: 21, transfers: 15, claims: 9, nfts: 4 },
  { name: 'Sat', swaps: 25, transfers: 17, claims: 12, nfts: 5 },
  { name: 'Sun', swaps: 23, transfers: 14, claims: 10, nfts: 3 }
];

const tokenDistribution = [
  { name: 'A0GI', value: 43.5 },
  { name: 'USDT', value: 28.7 },
  { name: 'BTC', value: 15.8 },
  { name: 'ETH', value: 12.0 }
];

const transactionSuccess = [
  { name: 'Jan', success: 85, failed: 15 },
  { name: 'Feb', success: 88, failed: 12 },
  { name: 'Mar', success: 90, failed: 10 },
  { name: 'Apr', success: 92, failed: 8 },
  { name: 'May', success: 91, failed: 9 },
  { name: 'Jun', success: 94, failed: 6 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export function StatisticsCharts() {
  const chartConfig = {
    swaps: {
      label: "Swaps",
      color: "#8884d8"
    },
    transfers: {
      label: "Transfers",
      color: "#82ca9d"
    },
    claims: {
      label: "Claims",
      color: "#ffc658"
    },
    nfts: {
      label: "NFTs",
      color: "#ff7300"
    },
    success: {
      label: "Success",
      color: "#82ca9d"
    },
    failed: {
      label: "Failed",
      color: "#ff6b6b"
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Activity Overview</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar dataKey="swaps" fill="#8884d8" />
              <Bar dataKey="transfers" fill="#82ca9d" />
              <Bar dataKey="claims" fill="#ffc658" />
              <Bar dataKey="nfts" fill="#ff7300" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Token Distribution</CardTitle>
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <PieChart>
              <Pie
                data={tokenDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, value}) => `${name}: ${value}%`}
              >
                {tokenDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transaction Success Rate</CardTitle>
          <LineChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={transactionSuccess}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="success" stroke="#82ca9d" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="failed" stroke="#ff6b6b" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
