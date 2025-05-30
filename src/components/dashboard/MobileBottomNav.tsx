// src/components/dashboard/MobileBottomNav.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  CreditCard,
  User,
  ImageIcon,
  Video,
  AudioLines,
  Box,
  Atom,
  FolderCheck,
  Dices,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Corrected Label for root dashboard
const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/explore", label: "Models", icon: Atom },
  { href: "/dashboard/generations", label: "Assets", icon: FolderCheck },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const createOptions = [
  { href: "/dashboard/generate/image", label: "Image", icon: ImageIcon },
  { href: "/dashboard/generate/video", label: "Video", icon: Video },
  { href: "/dashboard/generate/voice", label: "Voice", icon: AudioLines },
  { href: "/dashboard", label: "More", icon: Dices },
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navHeight = "h-16";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCreateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  const toggleCreateMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCreateMenuOpen((prev) => !prev);
  };

  const checkIsActive = (
    itemHref: string,
    currentPathname: string
  ): boolean => {
    if (itemHref === "/dashboard") {
      return currentPathname === itemHref;
    } else {
      return (
        currentPathname === itemHref ||
        (currentPathname.startsWith(itemHref) &&
          currentPathname[itemHref.length] === "/")
      );
    }
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/90 backdrop-blur-sm md:hidden",
        navHeight
      )}
    >
      <div className="mx-auto grid h-full max-w-md grid-cols-5 items-center px-1">
        {/* First two items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = checkIsActive(item.href, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md py-2 text-xs transition-colors duration-150 ease-in-out",
                isActive
                  ? "text-cyan" // Use cyan-500 for consistency
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={cn(
                  "truncate text-center text-[10px] sm:text-xs",
                  isActive && "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Create Button and Dropdown */}
        <div className="relative flex h-full items-center justify-center">
          {isCreateMenuOpen && (
            <div
              ref={menuRef}
              className={cn(
                "absolute bottom-full mb-3 w-40", // Base positioning and size
                // --- POSITIONING CHANGE ---
                // Position right edge to the container's right edge
                // --- ANIMATION ORIGIN CHANGE ---
                "origin-bottom-right scale-100 transform", // Animate from bottom-right
                // --- STYLING ---
                "rounded-lg border border-border/50 bg-background shadow-xl outline-none",
                // --- ANIMATION ---
                "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2"
                // Removed: left-1/2, -translate-x-1/2
              )}
              style={{ zIndex: 50 }} // Keep zIndex if needed
            >
              <div className="p-2 space-y-1">
                {createOptions.map((option) => {
                  const CreateIcon = option.icon;
                  return (
                    <Link
                      key={option.href}
                      to={option.href}
                      onClick={() => setIsCreateMenuOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <CreateIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{option.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          <button
            ref={buttonRef}
            onClick={toggleCreateMenu}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-cyan text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background", // Consistent cyan
              isCreateMenuOpen && "scale-105 bg-cyan-600"
            )}
            aria-haspopup="true"
            aria-expanded={isCreateMenuOpen}
            aria-label="Create new item"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Last two items */}
        {navItems.slice(2).map((item) => {
          const isActive = checkIsActive(item.href, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md py-2 text-xs transition-colors duration-150 ease-in-out",
                isActive
                  ? "text-cyan-500" // Use cyan-500 for consistency
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={cn(
                  "truncate text-center text-[10px] sm:text-xs",
                  isActive && "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
