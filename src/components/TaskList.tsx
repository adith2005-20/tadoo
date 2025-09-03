"use client"

import React, { useState } from 'react';
import { api, type RouterOutputs } from '@/trpc/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Calendar, Trash2 } from 'lucide-react'; // Added Trash2 icon
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Task = RouterOutputs["task"]["getTasks"][number];

type SortOption = 'priority' | 'dueDate' | 'todoStatus' | 'title';
type SortDirection = 'asc' | 'desc';

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks: initialTasks }) => {
  const [sortBy, setSortBy] = useState<SortOption>('todoStatus');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [tasks, setTasks] = useState(initialTasks);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const utils = api.useUtils();

  // Mutation to update task status
  const updateTaskMutation = api.task.updateTaskTodoStatus.useMutation({
    onMutate: async ({ id, todoStatus }) => {
      await utils.task.getTasks.cancel();
      const previousTasks = utils.task.getTasks.getData();
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, todoStatus } : task
        )
      );
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        setTasks(context.previousTasks);
      }
    },
    onSettled: async () => {
      await utils.task.getTasks.invalidate();
    },
  });

  // Mutation to delete a task
  const deleteTaskMutation = api.task.deleteTask.useMutation({
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await utils.task.getTasks.cancel();
      
      const previousTasks = utils.task.getTasks.getData();
      
      // Optimistically remove the task from the UI
      setTasks(prev => prev.filter(task => task.id !== id));
      
      return { previousTasks };
    },
    onError: (err, deletedTask, context) => {
      // If the mutation fails, roll back the change
      if (context?.previousTasks) {
        setTasks(context.previousTasks);
      }
    },
    onSettled: async () => {
      // Refetch tasks to ensure consistency with the backend
      await utils.task.getTasks.invalidate();
    },
  });


  const handleStatusChange = (taskId: number, isCompleted: boolean) => {
    updateTaskMutation.mutate({
      id: taskId,
      todoStatus: isCompleted ? "completed" : "pending"
    });
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTaskMutation.mutate({ id: taskId });
  };

  const sortedTasks = React.useMemo(() => {
    if (!tasks) return [];

    return [...tasks].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1, null: 0 };
        const priorityA = a.priority?.toLowerCase() ?? 'null';
        const priorityB = b.priority?.toLowerCase() ?? 'null';
        comparison = (priorityValues[priorityA as keyof typeof priorityValues] ?? 0) -
          (priorityValues[priorityB as keyof typeof priorityValues] ?? 0);
      } else if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        comparison = dateA - dateB;
      } else if (sortBy === 'todoStatus') {
        const statusValues = { completed: 1, pending: 0 };
        const statusA = a.todoStatus?.toLowerCase() ?? 'pending';
        const statusB = b.todoStatus?.toLowerCase() ?? 'pending';
        comparison = (statusValues[statusA as keyof typeof statusValues] ?? 0) -
          (statusValues[statusB as keyof typeof statusValues] ?? 0);
      } else if (sortBy === 'title') {
        comparison = (a.title ?? '').localeCompare(b.title ?? '');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const changeSortOption = (option: SortOption) => {
    if (sortBy === option) {
      toggleSortDirection();
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  if (!tasks) return (
    <Card className="w-full p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </Card>
  );

  if (!tasks?.length) return (
    <Card className="w-full p-4">
      <div className="text-muted-foreground">No tasks assigned to you yet!</div>
    </Card>
  );

  return (
    <Card className="w-full border-none">
      <CardHeader className="">
        <div className="flex justify-between items-center align-baseline">
          <CardTitle>
            <div className="text-xs text-muted-foreground font-extralight">
              {tasks.filter(t => t.todoStatus === "completed").length} of {tasks.length} tasks completed
            </div>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeSortOption('priority')}>
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeSortOption('dueDate')}>
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeSortOption('todoStatus')}>
                Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeSortOption('title')}>
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-full">
          <ul className="divide-y">
            <AnimatePresence initial={false}>
              {sortedTasks.map((task) => {
                const isCompleted = task.todoStatus === "completed";

                return (
                  <motion.li
                    key={task.id}
                    className="flex items-center justify-between p-2 gap-3 group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleStatusChange(task.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={cn(
                              "font-medium cursor-pointer",
                              isCompleted && "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </label>
                          {task.description && (
                            <p className={cn(
                              "text-xs text-muted-foreground",
                              isCompleted && "line-through"
                            )}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-1 text-xs">
                            {task.priority && (
                              <Badge
                                variant={isCompleted ? "outline" : getPriorityVariant(task.priority)}
                                className={cn(isCompleted && "opacity-60")}
                              >
                                {task.priority}
                              </Badge>
                            )}
                            {task.dueDate && (
                              <Badge variant="outline" className={cn(
                                isCompleted && "opacity-60",
                                "flex gap-1 items-center"
                              )}>
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                        onClick={() => handleDeleteTask(task.id)}
                    >
                        <Trash2 className="h-4 w-4 text-muted-foreground"/>
                    </Button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const getPriorityVariant = (priority: string | null) => {
  if (!priority) return "default";
  switch (priority.toLowerCase()) {
    case 'high':
      return "destructive";
    case 'medium':
      return "secondary";
    case 'low':
      return "default";
    default:
      return "default";
  }
};

export default TaskList;
