"use client"; // Ensure this component runs only on the client side

import Link from "next/link";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/userStore";

export default function Header() {
  const { user } = useUserStore(); // Get the user from the store

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 lg:px-10">
      <div className="flex h-14 items-center ">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Telescope</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features">Features</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {user ? (
              <Link href="/dashboard" passHref>
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost" className="mr-2">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
