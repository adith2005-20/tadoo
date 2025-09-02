"use client"
import TaskCreator from '@/components/TaskAddDialog';
import TaskList from '@/components/TaskList';
import { api, type RouterOutputs } from '@/trpc/react'
import React , {useState} from 'react'


const Dashboard = () => {
    const [initialTasks] = api.task.getTasks.useSuspenseQuery();
  return (
    <div className='m-6 lg:m-16'>
        <div className='flex justify-between'>
            <span className='text-5xl font-bold mb-4'>Your tasks</span>
            <TaskCreator/>
        </div>
      <TaskList tasks={initialTasks}/>  
    </div>
  )
}

export default Dashboard
