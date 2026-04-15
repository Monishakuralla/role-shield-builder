import { useTasks } from "@/hooks/useTasks";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Loader2, ListTodo, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, icon: ListTodo, color: "text-primary" },
            { label: "To Do", value: stats.todo, icon: Clock, color: "text-muted-foreground" },
            { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-primary" },
            { label: "Done", value: stats.done, icon: CheckCircle, color: "text-accent" },
          ].map((s) => (
            <Card key={s.label} className="glass-card">
              <CardContent className="pt-4 flex items-center gap-3">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Tasks</h2>
          <CreateTaskDialog
            onCreate={(task) => createTask.mutate(task as any)}
          />
        </div>

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center text-muted-foreground">
              <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No tasks yet. Create your first task to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={(id, updates) => updateTask.mutate({ id, ...updates })}
                onDelete={(id) => deleteTask.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
