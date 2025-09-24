// AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal"; // Import the modal component you will create

// Define the shape of the data and functions the context will provide
interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    email: string,
    avatarUrl?: string
  ) => void;
  logout: () => void;
  openAuthModal: () => void; // Function to open the modal
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the keys used for localStorage to ensure consistency
const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "access",
  REFRESH_TOKEN: "refresh",
  USER_EMAIL: "user_email",
  AVATAR_URL: "avatar_url",
};

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false); // State for modal visibility
  const navigate = useNavigate();

  // Effect to rehydrate auth state from localStorage on initial app load
  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      const email = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
      setIsAuthenticated(true);
      setUserEmail(email);
    }
    setIsInitialLoad(false);
  }, []); // Empty dependency array ensures this runs only once

  // Functions to control the modal
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  // Function to handle successful login
  const login = (
    accessToken: string,
    refreshToken: string,
    email: string,
    avatarUrl?: string
  ) => {
    // Store tokens and user info in localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, email);
    if (avatarUrl) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AVATAR_URL, avatarUrl);
    }

    // Update the state to reflect login
    setIsAuthenticated(true);
    setUserEmail(email);
    closeAuthModal(); // Close the modal if it was open during login
  };

  // Function to handle logout
  const logout = () => {
    // Remove all auth-related items from localStorage
    Object.values(LOCAL_STORAGE_KEYS).forEach((key) =>
      localStorage.removeItem(key)
    );

    // Reset state and redirect
    setIsAuthenticated(false);
    setUserEmail(null);
    navigate("/login");
  };

  // The value object provided to all consumer components
  const value = {
    isAuthenticated,
    userEmail,
    login,
    logout,
    openAuthModal, // Expose the function to open the modal
  };

  // Prevent rendering children until the initial auth check is complete
  if (isInitialLoad) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Render the modal globally, controlled by the context's state */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption of the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
