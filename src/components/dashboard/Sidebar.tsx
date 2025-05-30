// src/components/dashboard/Sidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ImageIcon,
  UserRoundPen,
  CreditCard,
  LogOut,
  MessageSquareText, // Icon for Chats
  Video,
  AudioLines,
  Atom,
  Dices,
  FolderCheck,
} from "lucide-react";

// Keep your original navigation items
const mainNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Models", href: "/dashboard/explore", icon: Atom },
  // { name: "Chats", href: "/dashboard/chats", icon: MessageSquareText },
  { name: "Image", href: "/dashboard/generate/image", icon: ImageIcon },
  { name: "Video", href: "/dashboard/generate/video", icon: Video },
  { name: "Voice", href: "/dashboard/generate/voice", icon: AudioLines },
  //{ name: "More", href: "/dashboard/tools", icon: Dices },
];

const accountNavItems = [
  { name: "Assets", href: "/dashboard/generations", icon: FolderCheck },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: UserRoundPen },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("email");
    navigate("/login");
    if (onClose) onClose();
  };

  // *** MODIFIED Helper function with specific "Chats" active style ***
  const renderNavItem = (item: {
    name: string;
    href: string;
    icon: React.ElementType;
  }) => {
    const isActive =
      location.pathname === item.href ||
      // Ensure '/dashboard/chats/*' also matches '/dashboard/chats'
      (item.href === "/dashboard/chats" &&
        location.pathname.startsWith(item.href)) ||
      // Keep the original logic for other items starting with their href
      (item.href !== "/dashboard" &&
        item.href !== "/dashboard/chats" &&
        location.pathname.startsWith(item.href));

    // Base classes for the layout
    const baseClasses =
      "flex flex-col items-center w-full p-3 rounded-lg group transition-colors duration-150 ease-in-out";
    const textClasses = "text-xs mt-1 font-medium truncate w-full text-center";
    const iconSize = "h-6 w-6";

    // Default inactive state colors
    let linkClasses = `${baseClasses} text-gray-400 hover:bg-gray-700 hover:text-gray-100`;
    let iconClasses = `${iconSize} text-gray-400 group-hover:text-gray-100`;
    // Define text color variable for easier management
    let spanTextColorClass = "text-gray-400 group-hover:text-gray-100";

    // --- Active state styling ---
    if (isActive) {
      spanTextColorClass = "text-white"; // Active items usually have white text

      if (item.href === "/dashboard") {
        // Special active style for Dashboard (gradient)
        linkClasses = `${baseClasses} bg-gradient-to-br from-cyan-500 to-teal-400 text-white shadow-lg`;
        iconClasses = `${iconSize} text-white`;
      }
      // --- >>> ADDED: Specific check for Chats <<< ---
      else if (item.href === "/dashboard/chats") {
        // Active style for Chats (Cyan background)
        // You can adjust the cyan shade (e.g., bg-cyan-500, bg-cyan-700)
        linkClasses = `${baseClasses} bg-gradient-to-br from-cyan-500 to-teal-400 text-white shadow-lg`;
        iconClasses = `${iconSize} text-white`;
        // spanTextColorClass is already set to text-white above
      }
      // --- End of Chats specific check ---
      else {
        // Standard active style for ALL OTHER items (subtle gray)
        linkClasses = `${baseClasses} bg-gradient-to-br from-cyan-500 to-teal-400 text-white shadow-lg`;
        iconClasses = `${iconSize} text-white`;
        // spanTextColorClass is already set to text-white above
      }
    }

    return (
      <li key={item.name} className="w-full">
        <Link
          to={item.href}
          onClick={onClose}
          className={linkClasses}
          title={item.name}
        >
          <item.icon className={iconClasses} aria-hidden="true" />
          {/* Apply text color class */}
          <span className={`${textClasses} ${spanTextColorClass}`}>
            {item.name}
          </span>
        </Link>
      </li>
    );
  };

  // Mobile transform classes
  const transformClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-24  text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-y-auto md:z-auto ${transformClasses}`}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col items-center overflow-y-auto px-2 py-4">
        {/* Main Navigation Section */}
        <ul className="space-y-1 font-medium w-full">
          {mainNavItems.map(renderNavItem)}
        </ul>

        {/* Separator */}
        <hr className="my-3 border-gray-700 w-3/4" />

        {/* Account/Settings Section */}
        <ul className="space-y-1 font-medium w-full">
          {accountNavItems.map(renderNavItem)}
        </ul>

        {/* Logout Section */}
        <div className="mt-auto w-full pt-4">
          <ul className="space-y-1 font-medium w-full">
            <li>
              <button
                onClick={handleLogout}
                className="flex flex-col items-center w-full p-3 rounded-lg group text-gray-400 hover:bg-red-800/50 hover:text-red-300 transition-colors duration-150 ease-in-out"
                title="Logout"
              >
                <LogOut
                  className="h-6 w-6 text-gray-400 group-hover:text-red-300"
                  aria-hidden="true"
                />
                <span className="text-xs mt-1 font-medium text-gray-400 group-hover:text-red-300">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
