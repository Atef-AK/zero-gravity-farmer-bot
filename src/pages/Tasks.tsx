
import { AdvancedTaskConfigurator } from "@/components/AdvancedTaskConfigurator";

export default function Tasks() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
      <p className="text-muted-foreground">Configure automated tasks and schedule your interactions.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvancedTaskConfigurator />
      </div>
    </div>
  );
}
