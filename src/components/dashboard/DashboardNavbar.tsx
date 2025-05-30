// src/components/dashboard/DashboardNavbar.tsx
import React, { useState } from "react";
import { Menu, Bell, Coins, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ensure this component is correct
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Ensure this is up-to-date
import { Link, useNavigate } from "react-router-dom";

interface DashboardNavbarProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
}

/* CSS for .glow-text (ensure this is in your global CSS) */
/*
.glow-text {
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3),
               0 0 10px rgba(0, 190, 255, 0.4),
               0 0 15px rgba(0, 190, 255, 0.3);
  color: #ffffff;
}
*/

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Feature: Image Upscaling",
      description: "You can now upscale your generated images!",
      read: false,
      timestamp: "10m ago",
    },
    {
      id: 2,
      title: "Billing Reminder",
      description: "Your monthly credits reset in 3 days.",
      read: false,
      timestamp: "1h ago",
    },
    {
      id: 3,
      title: "Generation Complete",
      description: 'Your request "Cyberpunk City" is ready.',
      read: true,
      timestamp: "2h ago",
    },
    {
      id: 4,
      title: "Welcome!",
      description: "Thanks for joining Shakaal AI.",
      read: true,
      timestamp: "1d ago",
    },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userEmail = localStorage.getItem("email") || "user@example.com";
  const userCoins = 1234; // Replace with actual data
  const userFallback = userEmail.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    console.log(`Notification ${id} clicked (marked as read)`);
    // navigate(`/dashboard/notifications/${id}`); // Example navigation
  };

  return (
    // Consider adding a subtle background blur for glassmorphism: backdrop-blur-sm
    <nav className="sticky top-0 z-30 h-16 ">
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
              src="/logo.png" // Ensure this path is correct relative to your public folder
              alt="Shakaal AI Logo"
              className="h-9 w-auto md:h-12" // Adjusted size slightly
              // Apply glow via CSS class or Tailwind drop-shadow if preferred
              // className="h-8 w-auto md:h-9 drop-shadow-[0_0_8px_rgba(0,190,255,0.4)]"
            />
            <span className="hidden text-cyan sm:inline-block text-lg md:text-xl font-bold">
              {" "}
              {/* Removed glow-text class, prefer drop-shadow or CSS */}
              Shakaal AI
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon" // Ensures consistent sizing
                className="relative text-muted-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-1 ring-background">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {unreadCount} Unread
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer data-[disabled]:opacity-100 rounded-md mx-1 ${
                        // Added rounding and margin
                        !notification.read
                          ? "bg-accent/50 hover:!bg-accent/70"
                          : "hover:!bg-accent/50"
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {!notification.read ? (
                          <span
                            className="h-2 w-2 rounded-full bg-cyan-500 block"
                            aria-label="Unread"
                          ></span>
                        ) : (
                          <span className="h-2 w-2 block"></span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p
                          className={`text-sm font-medium ${
                            !notification.read
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            !notification.read
                              ? "text-muted-foreground"
                              : "text-muted-foreground/80"
                          }`}
                        >
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem
                    disabled
                    className="text-center text-muted-foreground py-4"
                  >
                    No notifications yet.
                  </DropdownMenuItem>
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="justify-center text-sm text-cyan-600 hover:!text-cyan-700 focus:bg-cyan-100/50 py-2 cursor-pointer"
                  >
                    <Link to="/dashboard/notifications">
                      View All Notifications
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Coin Display */}
          <Button // Using Button with asChild for better semantics if Link is just for navigation
            variant="outline"
            size="sm"
            className="group flex items-center gap-1.5 border-cyan-500/30 bg-cyan-900/10 hover:bg-cyan-900/20 hover:border-cyan-500/50 text-cyan-100 rounded-full px-3 py-1 h-8 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200"
            asChild
          >
            <Link to="/dashboard/billing">
              <Coins className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium">
                {userCoins.toLocaleString()}
              </span>
              <PlusCircle className="h-4 w-4 text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </Button>

          {/* User Menu */}
          {/* This structure is CORRECT. If it fails, check dependencies or your Button component. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0 hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
              >
                <Avatar className="h-full w-full border border-border/20">
                  {/* Provide a real src or leave empty for fallback */}
                  <AvatarImage src="" alt={userEmail} />
                  <AvatarFallback>{userFallback}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {" "}
                    {/* Added truncate */}
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Use asChild for semantic correctness with Links */}
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-700 focus:bg-red-100/50 cursor-pointer" // Ensure cursor pointer
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
