// authApi.ts (or similar utility file)
import { toast } from "sonner";

const BASE_URL = "/api"; // Your Django API base URL

async function refreshToken() {
    const currentRefreshToken = localStorage.getItem("refresh");
    if (!currentRefreshToken) {
        // No refresh token, user needs to log in again
        localStorage.removeItem("access");
        // Redirect to login or emit logout event
        toast.error("Your session has expired. Please log in again.");
        // router.push('/login'); // If using Next.js router
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
                // If backend rotates refresh tokens, update it too:
                // if (data.refresh) localStorage.setItem("refresh", data.refresh);
                return data.access; // Return the new access token
            }
        }
        // If refresh fails (e.g., refresh token expired or invalid)
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.error("Your session has fully expired. Please log in again.");
        // router.push('/login');
        return null;

    } catch (error) {
        console.error("Token refresh error:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.error("Error refreshing session. Please log in again.");
        // router.push('/login');
        return null;
    }
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem("access");

    if (!accessToken) {
        // Potentially try to refresh immediately if no access token but refresh token exists
        // Or simply redirect to login
        toast.error("Not authenticated. Please log in.");
        // router.push('/login');
        throw new Error("User not authenticated");
    }

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        ...options.headers,
    };

    let response = await fetch(url, { ...options, headers: defaultHeaders });

    if (response.status === 401) {
        // Access token might be expired, try to refresh
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
            // Retry the original request with the new access token
            const newHeaders: HeadersInit = {
                ...defaultHeaders,
                "Authorization": `Bearer ${newAccessToken}`,
            };
            response = await fetch(url, { ...options, headers: newHeaders });
        } else {
            // Refresh failed, user needs to re-authenticate
            // The refreshToken function would have handled redirect/toast
            // Propagate the original 401 error or a custom auth error
            throw new Error("Session expired or invalid. Please log in again.");
        }
    }
    return response;
}