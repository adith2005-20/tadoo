"use client";

import React from 'react'
import { LoaderCircleIcon } from 'lucide-react';

const Loader = () => {
  return (
    <div className='min-h-screen w-full backdrop-blur-xs fixed z-25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
      <div className='bg-background rounded-xl size-16 backdrop-blur-lg flex items-center justify-center border-foreground border-2 p-2'>
        <LoaderCircleIcon className='animate-spin'/>
      </div>
      
    </div>
  )
}


export default Loader
