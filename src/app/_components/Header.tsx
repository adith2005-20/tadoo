"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Menu, X, LogOut, User, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Header() {
  const { data: session, isPending } = useSession();

  const isAuthenticated = session?.user;
  const isLoading = isPending;
  const router = useRouter();


  // Get user initials for avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return "?";
    return session.user.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-black/40 py-4 backdrop-blur-md h-1/12`}
    >
      <div className="flex gap-4 mx-4 justify-between items-center">
        <Link href={'/'}>
            <Image src="/tadoo.svg" width={80} height={80} alt="Tadoo Logo" />
        </Link>
        
        <div className="flex gap-4 place-self-end">
          {isPending && <LoaderCircleIcon className="h-6 w-6 animate-spin"/>}
        <SignedOut>
                <Button onClick={() => router.push("/auth/sign-up")}>
                    Sign up
                </Button>
                <Button variant={"outline"} onClick={()=>router.push("/auth/sign-in")}>
                    Log in
                </Button>
            
            
        </SignedOut>
        <SignedIn>
          <Avatar>
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
            {session?.user.image && <AvatarImage src={session.user.image} />}
          </Avatar>
        </SignedIn>
        </div>
      </div>
    </header>
  );
}
