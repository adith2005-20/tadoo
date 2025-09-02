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
import { api } from "@/trpc/react";
import { ModeToggle } from "@/components/ThemeButton";
import { Separator } from "@/components/ui/separator";

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
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full dark:bg-background/40 bg-background pt-4 backdrop-blur-md`}
    >
      <div className="mx-4 flex items-center justify-between gap-4">
        <Link href={"/"}>
          <span className="text-4xl font-bold">tadoo!</span>
        </Link>

        <div className="flex gap-4 place-self-end">
          {isPending && <LoaderCircleIcon className="h-6 w-6 animate-spin" />}
          <SignedOut>
            <Button onClick={() => router.push("/auth/sign-up")}>
              Sign up
            </Button>
            <Button
              variant={"outline"}
              onClick={() => router.push("/auth/sign-in")}
            >
              Log in
            </Button>
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  {session?.user.image && (
                    <AvatarImage src={session.user.image} />
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mx-8">
                <DropdownMenuItem onClick={() => handleSignOut()}>
                  <span className="text-destructive">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>
      </div>
      <Separator className="mt-4"/>
    </header>
  );
}
