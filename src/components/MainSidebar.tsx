
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { 
  Home, 
  Wallet, 
  BarChart2, 
  Settings, 
  GitMerge, 
  Upload, 
  Globe, 
  FileImage, 
  Layers, 
  Github
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

export function MainSidebar() {
  const { isRunning } = useApp();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Wallets",
      icon: Wallet,
      path: "/wallets",
    },
    {
      title: "Smart Contracts",
      icon: GitMerge,
      path: "/contracts",
    },
    {
      title: "Tasks",
      icon: Layers,
      path: "/tasks",
    },
    {
      title: "Statistics",
      icon: BarChart2,
      path: "/statistics",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];
  
  const actionsItems = [
    {
      title: "File Upload",
      icon: Upload,
      path: "/actions/upload",
    },
    {
      title: "Domain Registration",
      icon: Globe,
      path: "/actions/domains",
    },
    {
      title: "NFT Minting",
      icon: FileImage,
      path: "/actions/nfts",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4 border-b">
        <div className="flex items-center gap-2 px-2">
          <Github className="h-6 w-6 text-bot-primary" />
          <span className="text-lg font-bold">0G Farmer</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarMenu>
            <div className="text-xs uppercase text-muted-foreground px-2 pt-4 pb-2">
              Actions
            </div>
            {actionsItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Status:</span>
          <span className={`font-semibold ${isRunning ? 'text-green-500' : 'text-muted-foreground'}`}>
            {isRunning ? 'Running' : 'Idle'}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
