import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

const statusColors: Record<string, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/15 text-primary",
  done: "bg-accent/15 text-accent",
};

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/15 text-warning-foreground",
  high: "bg-destructive/15 text-destructive",
};

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  const save = () => {
    if (!title.trim()) return;
    onUpdate(task.id, { title: title.trim(), description: description.trim() || null });
    setEditing(false);
  };

  return (
    <Card className="glass-card transition-all hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        {editing ? (
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm font-semibold" />
        ) : (
          <h3 className="text-sm font-semibold leading-tight">{task.title}</h3>
        )}
        <div className="flex gap-1 shrink-0">
          {editing ? (
            <>
              <Button variant="ghost" size="icon" onClick={save}><Check className="h-4 w-4 text-accent" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setEditing(false)}><X className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}><Edit2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description..." />
        ) : (
          task.description && <p className="text-xs text-muted-foreground">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Select value={task.status} onValueChange={(v) => onUpdate(task.id, { status: v as Task["status"] })}>
            <SelectTrigger className="h-7 w-auto text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={task.priority} onValueChange={(v) => onUpdate(task.id, { priority: v as Task["priority"] })}>
            <SelectTrigger className="h-7 w-auto text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          <Badge variant="outline" className={`text-[10px] ${statusColors[task.status]}`}>
            {task.status.replace("_", " ")}
          </Badge>
          <Badge variant="outline" className={`text-[10px] ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        </div>
        {task.due_date && (
          <p className="text-[10px] text-muted-foreground">Due: {new Date(task.due_date).toLocaleDateString()}</p>
        )}
      </CardContent>
    </Card>
  );
};
