
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function ActivityFeed() {
  const { activities } = useApp();

  const getActivityIcon = (activity) => {
    if (activity.status === "pending") {
      return <Clock size={16} className="text-bot-warning" />;
    } else if (activity.status === "success") {
      return <CheckCircle2 size={16} className="text-bot-success" />;
    } else {
      return <AlertCircle size={16} className="text-bot-error" />;
    }
  };

  const getActivityType = (type: string) => {
    const types = {
      claim: "Faucet Claim",
      swap: "Token Swap",
      transfer: "Transfer",
      mint: "NFT Mint",
      register: "Domain Registration",
      upload: "File Upload"
    };
    return types[type] || type;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="h-full border-border/40 bg-bot-card">
      <CardHeader className="border-b border-border/20 pb-2">
        <CardTitle className="text-xl">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto max-h-[calc(100vh-16rem)]">
        {activities.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No activities recorded yet. Start farming to see the activity feed.
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {activities.map((activity) => (
              <div key={activity.id} className="p-3 hover:bg-bot-card-hover transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getActivityIcon(activity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{getActivityType(activity.type)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {truncateAddress(activity.walletAddress)}
                    </div>
                    <div className="text-sm mt-1">{activity.details}</div>
                    {activity.txHash && (
                      <div className="mt-2 flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs gap-1 text-muted-foreground"
                          onClick={() => window.open(`https://chainscan-newton.0g.ai/tx/${activity.txHash}`, '_blank')}
                        >
                          View Transaction <ExternalLink size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
