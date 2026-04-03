import { Show, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import {
  BookOpenIcon,
  CreditCardIcon,
  GraduationCap,
  LogOutIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav
      className="flex justify-between items-center py-3.5 px-5 
      bg-white/4 backdrop-blur-xl
      border-b border-white/[0.07]
      sticky top-0 z-50"
    >
      <Link
        href="/"
        className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight"
      >
        MasterClass <GraduationCap className="size-5" />
      </Link>

      <div className="flex items-center gap-1">
        <Link
          href="/courses"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
            text-white hover:text-violet-200 hover:bg-violet-500/12 transition-all duration-150"
        >
          <BookOpenIcon className="size-3.75" />
          Courses
        </Link>

        <Link
          href="/pro"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
            text-white hover:text-violet-200 hover:bg-violet-500/12 transition-all duration-150"
        >
          <ZapIcon className="size-3.75" />
          <span className="hidden sm:inline">Pro</span>
        </Link>

        <div className="w-px h-5 bg-white/8 mx-1.5" />

        <Show when="signed-in">
          <Link href="/billing">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-white
                bg-violet-500/15 border-violet-400/30
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
            >
              <CreditCardIcon className="size-3.75" />
              <span className="hidden sm:inline">Billing</span>
            </Button>
          </Link>
        </Show>

        <UserButton />

        <Show when="signed-in">
          <SignOutButton>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1.5
                text-white border-white/10
                hover:bg-white/5 hover:border-white/18 hover:text-white/70
                transition-all duration-150"
            >
              <div className="flex items-center gap-1.5">
                <LogOutIcon className="size-3.75" />
                <span className="hidden sm:inline">Log Out</span>
              </div>
            </Button>
          </SignOutButton>
        </Show>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="sm"
              className="text-white hover:text-white bg-violet-500/15 border-violet-400/30
                hover:bg-violet-500/25 hover:border-violet-400/50
                transition-all duration-150"
            >
              Log In
            </Button>
          </SignInButton>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
