"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Updated schema to match the tRPC procedure
const taskFormSchema = z.object({
    title: z.string().min(3, { message: "Title should have at least 3 characters" }),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(), // Priority is now optional
    todoStatus: z.enum(["pending", "completed"]), // Renamed from 'status'
    tags: z.array(z.string()).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const TaskCreator = () => {
    const [open, setOpen] = React.useState(false);
    const utils = api.useUtils();
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium",
            todoStatus: "pending",
            dueDate: "",
            tags: [],
        },
    });

    const createTaskMutation = api.task.createTask.useMutation();

    const handleSubmit = async (values: TaskFormValues) => {
        try {
            await createTaskMutation.mutateAsync(values);
            toast.success("Task added successfully");
            form.reset();
            setOpen(false);
            await utils.task.getTasks.invalidate();
        } catch (error) {
            console.error("Task creation failed:", error);
            toast.error(`Task creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="my-4" asChild>
                <Button>Add New Task</Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle>Add a Task</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new task.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Finish the report" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        {/* Using a textarea might be better for descriptions */}
                                        <Input placeholder="Add more details..." {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    {/* The Select component now correctly handles the optional field */}
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4 w-full" disabled={createTaskMutation.isPending}>
                            {createTaskMutation.isPending ? "Adding..." : "Add Task"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskCreator;
