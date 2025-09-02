"use client"
import React from 'react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { GitHubIcon, XIcon } from '@daveyplate/better-auth-ui'
import Link from 'next/link'
import { ModeToggle } from '@/components/ThemeButton'


const Footer = () => {
  return (
    <div className='dark:bg-background/40 bg-foreground/90 flex-col items-center text-center justify-center gap-8'>
        <Separator className='mb-12'/>
      <Link href={''}><Image src='/tadoo.svg' width={100} height={100} draggable={false} alt='Tadoo logo' className='place-self-center mb-4'/></Link>
      <span className='text-muted-foreground place-self-center'>Made with ♡ by adith</span>

        <div className='flex'>
             <Link href={'https://github.com/adith2005-20/tadoo'}><GitHubIcon className='w-6 h-6 m-4 ml-8 place-self-center text-white'/></Link>
            <Link href={'https://x.com/royal4u_'}><XIcon className='w-6 h-6 m-4 place-self-center text-white'/></Link>
            <div className='ml-auto place-self-end-safe m-4 mr-8'>
                <ModeToggle />
            </div>
            
        </div>
     

    </div>
  )
}

export default Footer
