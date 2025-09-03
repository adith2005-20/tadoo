import {z} from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { tasks } from '@/server/db/schema';
import { db } from '@/server/db';
import { eq, and } from 'drizzle-orm';

export const taskRouter = createTRPCRouter({
    createTask: protectedProcedure
    .input(z.object({
        title: z.string().min(3, "Title must be atleast 3 characters long"),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        todoStatus: z.enum(["completed","pending"]).default("pending"),
        tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ctx, input})=>{
        const task = await db.insert(tasks).values({
            title: input.title,
            description: input.description,
            dueDate: input.dueDate? new Date(input.dueDate) : null,
            priority: input.priority,
            todoStatus: input.todoStatus,
            tags: input.tags ?? [],
            userId: ctx.userId,
        }).returning();
        return {
            success: true,
            message: "Task created successfully",
            task: task[0]
        }
    }),
    getTasks: protectedProcedure
    .query(async ({ctx})=>{
        const selfTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.userId,ctx.userId))
        return selfTasks;
    }),
    updateTaskTodoStatus: protectedProcedure
    .input(z.object({
        id: z.number(),
        todoStatus: z.enum(["pending","completed"])
    }))
    .mutation(async ({ctx,input})=>{
        const taskInQuestion = await db.select()
        .from(tasks)
        .where(and(eq(tasks.id,input.id),eq(tasks.userId,ctx.userId)));
        
        if (!taskInQuestion){
            throw new Error("Task not found or unauthorized to update.");
        }

        const updatedTask = await db.update(tasks)
        .set({

            todoStatus: input.todoStatus
        })
        .where(eq(tasks.id, input.id))
        .returning()

        return {
            success: true,
            message: "Task stsatus updated successfully",
            task: updatedTask[0]
        };
    }),
    deleteTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const taskToDelete = await db.select({ id: tasks.id })
            .from(tasks)
            .where(and(eq(tasks.id, input.id), eq(tasks.userId, ctx.userId)));

        if (taskToDelete.length === 0) {
            throw new Error("Task not found or you're not authorized to delete it.");
        }

        await db.delete(tasks).where(eq(tasks.id, input.id));

        return {
            success: true,
            message: "Task deleted successfully",
        };
    }),
})