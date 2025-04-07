
import { AdvancedTaskConfigurator } from "@/components/AdvancedTaskConfigurator";
import { TaskConfigurator } from "@/components/TaskConfigurator";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { PlayCircle, PauseCircle } from "lucide-react";

export default function Tasks() {
  const { isRunning, startAllTasks, stopAllTasks, selectedWallets } = useApp();
  const hasSelectedWallets = selectedWallets.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">Configure automated tasks and schedule your interactions.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={startAllTasks}
            className="bg-green-600 hover:bg-green-700"
            disabled={!hasSelectedWallets || isRunning}
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Start All Tasks
          </Button>
          
          <Button
            onClick={stopAllTasks}
            variant="destructive"
            disabled={!hasSelectedWallets || !isRunning}
          >
            <PauseCircle className="mr-2 h-4 w-4" />
            Stop All Tasks
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskConfigurator />
        <AdvancedTaskConfigurator />
      </div>
    </div>
  );
}
