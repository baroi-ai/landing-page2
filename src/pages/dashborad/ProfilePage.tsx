// src/pages/dashboard/ProfilePage.tsx
import React, { useState, useEffect } from "react"; // Import useState, useEffect
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input"; // Import Input
import { Label } from "@/components/ui/label"; // Import Label
// Import necessary icons
import {
  Coins,
  LogOut,
  Trash2,
  Mail,
  KeyRound, // Icon for API keys
  Eye, // Icon to show key
  EyeOff, // Icon to hide key
  Save, // Icon for save button
  Loader2, // Icon for loading state
} from "lucide-react";

// Define the structure for API service configuration
interface ApiService {
  id: string; // e.g., "openai", "gemini"
  name: string; // e.g., "OpenAI API Key"
  placeholder: string;
}

// List of API services to manage
const apiServices: ApiService[] = [
  { id: "openai", name: "OpenAI API Key", placeholder: "sk-..." },
  { id: "gemini", name: "Google Gemini API Key", placeholder: "AIzaSy..." },
  { id: "claude", name: "Anthropic Claude API Key", placeholder: "sk-ant-..." },
  { id: "perplexity", name: "Perplexity API Key", placeholder: "pplx-..." },
  {
    id: "llama",
    name: "Llama API Key (e.g., Replicate/Groq)",
    placeholder: "r8_... / gsk_...",
  },
  { id: "deepseek", name: "DeepSeek API Key", placeholder: "sk-..." },
];

// --- Component ---
const ProfilePage = () => {
  const navigate = useNavigate();

  // --- User Profile State (from localStorage - keep previous logic) ---
  const emailFromStorage = localStorage.getItem("email") || "user@example.com";
  const avatarUrlFromStorage = localStorage.getItem("avatarUrl");
  const initials = emailFromStorage.substring(0, 2).toUpperCase();
  const userData = {
    email: emailFromStorage,
    avatarUrl: avatarUrlFromStorage || null,
    initials,
    coins: 1234, // Placeholder
  };

  // --- API Key State ---
  // IMPORTANT: In a real app, fetch keys securely from your backend!
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(
    apiServices.reduce((acc, service) => ({ ...acc, [service.id]: "" }), {}) // Initialize with empty strings
  );
  const [keyVisibility, setKeyVisibility] = useState<Record<string, boolean>>(
    apiServices.reduce((acc, service) => ({ ...acc, [service.id]: false }), {}) // Initialize all keys hidden
  );
  const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(true); // Simulate loading
  // Add error state if needed: const [keyError, setKeyError] = useState<string | null>(null);

  // --- Simulate fetching API keys on mount ---
  useEffect(() => {
    setIsLoadingKeys(true);
    // Simulate network request - Replace with actual fetch to your backend
    const timer = setTimeout(() => {
      console.log("Simulating API key fetch...");
      // In real app, response would contain keys (maybe partial/masked) from backend
      const fetchedKeys = {
        openai: "sk-abc...xyz", // Example placeholder/masked key
        gemini: "",
        claude: "sk-ant-...123", // Example placeholder/masked key
        perplexity: "",
        llama: "",
        deepseek: "",
      };
      setApiKeys(fetchedKeys);
      setIsLoadingKeys(false);
    }, 1500); // Simulate 1.5 second delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // --- Handlers ---

  const handleLogout = () => {
    // ... (logout logic remains the same)
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("email");
    localStorage.removeItem("avatarUrl");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // ... (delete account placeholder remains the same)
    console.warn("Delete Account action triggered");
    alert(
      "Account deletion functionality not implemented yet. Requires confirmation!"
    );
  };

  const handleKeyChange = (serviceId: string, value: string) => {
    setApiKeys((prevKeys) => ({
      ...prevKeys,
      [serviceId]: value,
    }));
  };

  const handleToggleVisibility = (serviceId: string) => {
    setKeyVisibility((prevVisibility) => ({
      ...prevVisibility,
      [serviceId]: !prevVisibility[serviceId],
    }));
  };

  const handleSaveKey = (serviceId: string) => {
    const keyToSave = apiKeys[serviceId];
    console.log(
      `Simulating save for ${serviceId}:`,
      keyToSave ? "********" : "(empty)"
    ); // Don't log the actual key
    // *** IMPORTANT: Replace this alert with an API call to your backend ***
    // Your backend should securely store/update the key for the logged-in user.
    alert(
      `Simulated save for ${serviceId}. In a real app, this would be sent securely to the backend.`
    );
    // Optionally, provide user feedback (e.g., toast notification)
  };

  // --- Styling ---
  const cardClasses = `
    border border-cyan-500/30 bg-muted/20 backdrop-blur-sm
    shadow-[0_0_15px_rgba(6,182,212,0.2)]
    transition-all duration-300 ease-in-out
    hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
    max-w-2xl mx-auto
  `;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* --- Profile Section --- */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center md:text-left">
          My Profile
        </h1>
        <Card className={cardClasses}>
          {/* ... (CardHeader, CardContent for Profile remain the same) ... */}
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-cyan-500/50">
              <AvatarImage src={userData.avatarUrl || ""} alt="User Avatar" />
              <AvatarFallback className="text-3xl">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{userData.email}</CardTitle>
            <CardDescription>
              Manage your account details and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center sm:justify-start space-x-3 p-3 rounded-md border border-border/30 bg-muted/30">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {userData.email}
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-3 p-3 rounded-md border border-border/30 bg-muted/30">
              <Coins className="h-5 w-5 text-cyan" />
              <span className="text-sm font-medium text-foreground">
                Coin Balance:
              </span>
              <span className="font-bold text-foreground">
                {userData.coins.toLocaleString()}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-6">
            {/* Delete & Logout Buttons remain the same */}
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardFooter>
        </Card>

        {/* --- API Key Management Section --- */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center md:text-left pt-6">
          API Key Management
        </h2>
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle>Manage External API Keys</CardTitle>
            <CardDescription>
              Securely add your API keys for third-party services. These keys
              are used by our backend and are not stored in your browser.
              <span className="font-bold text-destructive">
                {" "}
                (This is a UI simulation - keys are NOT actually saved securely
                here).
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingKeys ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading API Key status...
              </div>
            ) : (
              apiServices.map((service) => (
                <div key={service.id} className="space-y-2">
                  <Label
                    htmlFor={service.id}
                    className="text-sm font-medium flex items-center"
                  >
                    <KeyRound className="mr-2 h-4 w-4 text-cyan" />{" "}
                    {service.name}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={service.id}
                      type={keyVisibility[service.id] ? "text" : "password"}
                      placeholder={service.placeholder}
                      value={apiKeys[service.id] || ""} // Use || "" to prevent uncontrolled->controlled warning
                      onChange={(e) =>
                        handleKeyChange(service.id, e.target.value)
                      }
                      className="flex-grow bg-background/50 border-border/50"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleVisibility(service.id)}
                      aria-label={
                        keyVisibility[service.id] ? "Hide key" : "Show key"
                      }
                    >
                      {keyVisibility[service.id] ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveKey(service.id)}
                      className="bg-cyan hover:bg-cyan-500 text-white" // Consistent highlight style
                      aria-label={`Save ${service.name}`}
                    >
                      <Save className="h-4 w-4" />
                      {/* Optionally hide text on smaller screens if needed */}
                      {/* <span className="hidden sm:inline ml-1">Save</span> */}
                    </Button>
                  </div>
                </div>
              ))
            )}
            {/* Add error display here if implemented: keyError && <p className="text-destructive">{keyError}</p> */}
          </CardContent>
          {/* Optional Footer for API Key Card */}
          {/* <CardFooter>
                <p className="text-xs text-muted-foreground">Changes are saved securely on our servers.</p>
            </CardFooter> */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
