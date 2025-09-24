import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ImageIcon,
  UserRoundPen,
  CreditCard,
  LogOut,
  LogIn,
  Video,
  AudioLines,
  Dices,
  FolderCheck,
} from "lucide-react";

import { useAuth } from "../AuthContext";

const mainNavItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Image", href: "/dashboard/generate/image", icon: ImageIcon },
  { name: "Video", href: "/dashboard/generate/video", icon: Video },
  { name: "Voice", href: "/dashboard/generate/voice", icon: AudioLines },
  { name: "More", href: "/dashboard/tools", icon: Dices },
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
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onClose) {
      onClose();
    }
  };

  const handleLogin = () => {
    navigate("/login");
    if (onClose) {
      onClose();
    }
  };

  const renderNavItem = (item: {
    name: string;
    href: string;
    icon: React.ElementType;
  }) => {
    const isActive =
      location.pathname === item.href ||
      (item.href !== "/dashboard" && location.pathname.startsWith(item.href));

    const baseClasses =
      "flex flex-col items-center w-full p-3 rounded-lg group transition-colors duration-150 ease-in-out";
    const textClasses = "text-xs mt-1 font-medium truncate w-full text-center";
    const iconSize = "h-6 w-6";

    let linkClasses = `${baseClasses} text-gray-400 hover:bg-gray-700 hover:text-gray-100`;
    let iconClasses = `${iconSize} text-gray-400 group-hover:text-gray-100`;

    // ✅ THIS IS THE FIX 👇
    // The string now correctly ends with a double quote instead of a backtick.
    let spanTextColorClass = "text-gray-400 group-hover:text-gray-100";

    if (isActive) {
      spanTextColorClass = "text-white";
      linkClasses = `${baseClasses} bg-gradient-to-br from-cyan-500 to-teal-400 text-white shadow-lg`;
      iconClasses = `${iconSize} text-white`;
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
          <span className={`${textClasses} ${spanTextColorClass}`}>
            {item.name}
          </span>
        </Link>
      </li>
    );
  };

  const transformClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-24 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-y-auto md:z-auto ${transformClasses}`}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col items-center overflow-y-auto px-2 py-4">
        <ul className="space-y-1 font-medium w-full">
          {mainNavItems.map(renderNavItem)}
        </ul>

        <hr className="my-3 border-gray-700 w-3/4" />

        <ul className="space-y-1 font-medium w-full">
          {accountNavItems.map(renderNavItem)}
        </ul>

        <div className="mt-auto w-full pt-4">
          <ul className="space-y-1 font-medium w-full">
            {isAuthenticated ? (
              // If LOGGED IN, show Logout button
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
            ) : (
              // If NOT LOGGED IN, show Login button
              <li>
                <button
                  onClick={handleLogin}
                  className="flex flex-col items-center w-full p-3 rounded-lg group text-gray-400 hover:bg-green-800/50 hover:text-green-300 transition-colors duration-150 ease-in-out"
                  title="Login"
                >
                  <LogIn
                    className="h-6 w-6 text-gray-400 group-hover:text-green-300"
                    aria-hidden="true"
                  />
                  <span className="text-xs mt-1 font-medium text-gray-400 group-hover:text-green-300">
                    Login
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
