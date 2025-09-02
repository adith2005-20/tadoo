"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Landing = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-12 lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Ta-Da!
            <br />
            Tadoo is here.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-foreground/80 sm:text-xl">
            Simple, fast, and designed for all your productivity needs to keep you in flow.
          </p>
        </div>
        <div className="flex-shrink-0">
            <Link href={'/dashboard'}>
            <Button 
            size="lg"
            className='px-12 py-8 text-xl font-semibold hover:cursor-pointer' 
          >
            Get Started
          </Button>
            </Link>
          
        </div>
      </div>
    </main>
  );
};

export default Landing;

