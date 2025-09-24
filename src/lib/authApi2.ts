// src/lib/authApi.ts
import { toast } from "sonner"; // Or your preferred toast/notification library

// Asynchronously get the API base URL to ensure process.env is available
async function getApiBaseUrl(): Promise<string | null> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      const errorMessage = "CRITICAL ERROR: NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file and restart the dev server. API calls will fail.";
      console.error(errorMessage);
      toast.error("Application is not configured to connect to the server. Please contact support.");
      // In a real app, you might want to throw an error here to halt operations
      // or return a specific value that signals a configuration problem.
      return null; 
    }
    return apiUrl;
}

async function refreshToken(): Promise<string | null> {
    const API_BASE_URL = await getApiBaseUrl();
    if (!API_BASE_URL) {
        // getApiBaseUrl will have already shown an error
        return null;
    }

    const currentRefreshToken = localStorage.getItem("refresh");
    if (!currentRefreshToken) {
        localStorage.removeItem("access"); // Ensure access token is also cleared
        toast.error("Your session has expired. Please log in again.");
        // TODO: Implement proper client-side routing if using Next.js router or similar
        if (typeof window !== "undefined") window.location.href = '/login'; // Simple redirect
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: currentRefreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access) {
                localStorage.setItem("access", data.access);
                // If your backend rotates refresh tokens and sends a new one with the access token:
                // if (data.refresh) { localStorage.setItem("refresh", data.refresh); }
                return data.access;
            }
        }
        
        // If response is not ok or data.access is missing
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.error("Your session has fully expired. Please log in again.");
        if (typeof window !== "undefined") window.location.href = '/login';
        return null;

    } catch (error) {
        console.error("Token refresh API call error:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.error("Error refreshing session. Please log in again.");
        if (typeof window !== "undefined") window.location.href = '/login';
        return null;
    }
}

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const API_BASE_URL_CHECK = await getApiBaseUrl(); // Check if base URL is configured
    if (!API_BASE_URL_CHECK) {
        // Error already toasted by getApiBaseUrl
        throw new Error("API URL is not configured. Cannot make authenticated request.");
    }

    let accessToken = localStorage.getItem("access");

    if (!accessToken) {
        if (localStorage.getItem("refresh")) {
            // Attempt to refresh if no access token but refresh token exists
            accessToken = await refreshToken();
            if (!accessToken) {
                // refreshToken handles redirection/toast for terminal failure
                throw new Error("User not authenticated after refresh attempt.");
            }
        } else {
            // No access token and no refresh token to attempt.
            toast.error("Not authenticated. Please log in.");
            if (typeof window !== "undefined") window.location.href = '/login';
            throw new Error("User not authenticated and no refresh token available.");
        }
    }

    const requestHeaders: HeadersInit = { ...options.headers };
    requestHeaders["Authorization"] = `Bearer ${accessToken}`;

    // Only set Content-Type if it's not FormData and not already set in options.headers
    if (!(options.body instanceof FormData) && !requestHeaders['Content-Type']) {
        requestHeaders["Content-Type"] = "application/json";
    }
    // If options.body is FormData, DO NOT set Content-Type here; let the browser do it.
    // If options.headers already has Content-Type, it will be respected due to spread { ...options.headers }.

    let response = await fetch(url, { ...options, headers: requestHeaders });

    if (response.status === 401) { // Unauthorized - access token likely expired
        const newAccessToken = await refreshToken(); // Attempt to refresh
        if (newAccessToken) {
            // Retry the original request with the new access token
            requestHeaders["Authorization"] = `Bearer ${newAccessToken}`;
            response = await fetch(url, { ...options, headers: requestHeaders });
        } else {
            // Refresh failed, refreshToken() handles redirection/toast for terminal failure
            throw new Error("Session expired or invalid after refresh. Please log in again.");
        }
    }
    return response;
}