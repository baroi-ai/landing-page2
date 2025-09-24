import React, { useState, useEffect, useCallback } from "react";
// ✅ 1. Import useNavigate for redirection
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Coins,
  PlusCircle,
  Loader2,
  Download,
  LogOut,
  LogIn, // ✅ 2. Import the LogIn icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/components/AuthContext";
import { authenticatedFetch } from "@/api/authApi";
import { appEmitter } from "@/lib/eventEmitter";

interface DashboardNavbarProps {
  toggleSidebar: () => void;
}

interface UserProfile {
  email: string;
  credits: number;
  avatar?: string | null;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ toggleSidebar }) => {
  const { userEmail, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // ✅ 3. Initialize the navigate function

  const [userCoins, setUserCoins] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  // ✅ 4. Conditionally set user display info
  const displayEmail = isAuthenticated ? userEmail : "guest@example.com";
  const userFallback = isAuthenticated
    ? userEmail
      ? userEmail.substring(0, 2).toUpperCase()
      : "U"
    : "G";

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoadingProfile(false);
      // Reset state for guest view
      setUserCoins(0);
      setAvatarUrl(null);
      return;
    }

    setIsLoadingProfile(true);
    try {
      const response = await authenticatedFetch("/api/users/profile");
      if (response.ok) {
        const data: UserProfile = await response.json();
        setUserCoins(data.credits);
        if (data.avatar) {
          setAvatarUrl(data.avatar);
        }
      } else {
        console.error("Navbar: Failed to fetch user profile:", response.status);
      }
    } catch (error) {
      console.error("Navbar: Error fetching user profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const handleCreditsUpdated = (newCredits: number) => {
      if (typeof newCredits === "number" && !isNaN(newCredits)) {
        setUserCoins(newCredits);
      }
    };
    const unsubscribe = appEmitter.on("creditsUpdated", handleCreditsUpdated);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-30 h-16">
      <div className="container mx-auto px-4 md:px-6 flex h-full items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground flex-shrink-0 rounded-full hover:bg-accent transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="Go to dashboard"
          >
            <img
              src="/logo.png"
              alt="Sharky AI Logo"
              className="h-9 w-auto md:h-12"
            />
            <span className="hidden text-teal-500 sm:inline-block text-lg md:text-xl font-bold">
              Sharky AI
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <Link to="/download" className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              aria-label="Downloads"
            >
              <Download className="h-5 w-5" />
            </Button>
          </Link>

          {/* ✅ 6. Coin Display now links to login for guests */}
          <Button
            variant="outline"
            size="sm"
            className="group flex items-center gap-1.5 border-teal-500/30 bg-teal-900/10 hover:bg-teal-900/20 hover:border-teal-500/50 text-cyan-100 rounded-full px-3 py-1 h-8 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200"
            asChild
          >
            <Link to={isAuthenticated ? "/dashboard/billing" : "/login"}>
              <Coins className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium min-w-[20px] text-center">
                {isLoadingProfile && isAuthenticated ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  userCoins.toLocaleString()
                )}
              </span>
              <PlusCircle className="h-4 w-4 text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </Button>

          {/* ✅ 7. User Menu with conditional content */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0 hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                <Avatar className="h-full w-full border border-border/20">
                  <AvatarImage
                    src={isAuthenticated ? avatarUrl || "" : ""}
                    alt={displayEmail || "User"}
                  />
                  <AvatarFallback>{userFallback}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {isAuthenticated ? "Account" : "Guest"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {displayEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                // --- If LOGGED IN ---
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/billing">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/download">Download</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contact">Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-700 focus:bg-red-100/50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                // --- If NOT LOGGED IN ---
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/billing">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contact">Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/download">Download</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogin}
                    className="text-green-600 focus:text-green-700 focus:bg-green-100/50 cursor-pointer"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
