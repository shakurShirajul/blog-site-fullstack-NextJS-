"use client";
import { Input } from "../ui/input";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { use, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session, status } = useSession();
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  console.log("User session data:", session, status);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  L
                </span>
              </div>
              <span className="hidden font-bold sm:inline-block">Logo</span>
            </Link>

            {/* Search Box */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-10 pr-4"
              />
            </div>
          </div>

          {/* Right Side - Auth Buttons or User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {status === "unauthenticated" ? (
              /* Not Logged In - Show Login and Create Account */
              <div className="flex items-center space-x-2">
                <Button variant="ghost">
                  <Link href={"/auth/signin"}>Log In</Link>
                </Button>
                <Button>
                  <Link href={"/auth/signup"}>Create Account</Link>
                </Button>
              </div>
            ) : (
              /* Logged In - Show Create Post, Notifications, and User Menu */
              <div className="flex items-center space-x-2">
                <Button className="hidden sm:inline-flex">
                  <Link href={`create-post`}>Create Post</Link>
                </Button>

                {/* Notification Bell */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session?.user?.image || "/placeholder.svg"}
                          alt={session?.user?.name}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session?.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/create-post" className="sm:hidden">
                        Create Post
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
