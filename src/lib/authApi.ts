// src/lib/authApi.ts (or utils/authApi.ts, services/authApi.ts, etc.)

import { toast } from "sonner";
// import { router } from 'next/router'; // Or your routing mechanism if needed for redirect


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


async function refreshToken(): Promise<string | null> { // Added return type
    const currentRefreshToken = localStorage.getItem("refresh");
    if (!currentRefreshToken) {
        localStorage.removeItem("access");
        toast.error("Your session has expired. Please log in again.");
        // Example: window.location.href = '/login'; // Simple redirect
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: currentRefreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access) {
                localStorage.setItem("access", data.access);
                if (data.refresh) { // If backend sends rotated refresh token
                    localStorage.setItem("refresh", data.refresh);
                }
                console.log("Token refreshed successfully");
                return data.access;
            }
        }
        
        // If refresh fails (e.g., refresh token expired or invalid)
        console.error("Token refresh failed, status:", response.status);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.error("Your session has fully expired. Please log in again.");
        // Example: window.location.href = '/login';
        return null;

    } catch (error) {
        console.error("Token refresh network/fetch error:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.error("Error refreshing session. Please log in again.");
        // Example: window.location.href = '/login';
        return null;
    }
}

// Ensure this function is EXPORTED
export async function authenticatedFetch(urlPath: string, options: RequestInit = {}): Promise<Response> { // Added return type
    let accessToken = localStorage.getItem("access");
    const fullUrl = urlPath.startsWith('http') ? urlPath : `${BASE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;


    if (!accessToken) {
        // Attempt to refresh if no access token but refresh token exists
        // This might be desirable if the app was closed and reopened
        console.log("No access token found, attempting refresh before initial call...");
        accessToken = await refreshToken();
        if (!accessToken) {
             toast.error("Not authenticated. Please log in.");
             // Example: window.location.href = '/login';
             // Throw an error that the calling function can catch
             throw new Error("User not authenticated, refresh failed or no refresh token.");
        }
    }

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json", // Default, can be overridden by options.headers
        "Authorization": `Bearer ${accessToken}`,
        ...options.headers, // Spread options.headers last to allow override
    };
    
    // If body is FormData, Content-Type should NOT be set, browser handles it
    if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
    }


    let response = await fetch(fullUrl, { ...options, headers: defaultHeaders });

    if (response.status === 401) {
        console.log("Received 401, attempting token refresh...");
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
            console.log("Retrying original request with new access token...");
            const newHeaders: HeadersInit = {
                ...defaultHeaders,
                "Authorization": `Bearer ${newAccessToken}`,
            };
             if (options.body instanceof FormData) { // Re-check for FormData
                delete newHeaders['Content-Type'];
             }
            response = await fetch(fullUrl, { ...options, headers: newHeaders });
        } else {
            // Refresh failed, user needs to re-authenticate
            // The refreshToken function would have handled user notification/redirect
            console.error("Refresh token failed after a 401. Original request failed.");
            // Rethrow or return the original 401 response to be handled by caller
            // Or throw a specific error indicating session expiration
            throw new Error("Session expired or invalid after attempting refresh. Please log in again.");
        }
    }
    return response;
}