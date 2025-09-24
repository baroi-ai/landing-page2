// File: frontend/src/api/authApi.ts
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Re-defining these here to be self-contained and avoid import cycles.
// Must match the keys used in AuthContext.tsx.
const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "access",
  REFRESH_TOKEN: "refresh",
};

/**
 * Attempts to refresh the access token using the stored refresh token.
 * This is called automatically by authenticatedFetch when a 401 is detected.
 */
async function refreshToken(): Promise<string | null> {
  const currentRefreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

  // If there's no refresh token, we can't do anything.
  if (!currentRefreshToken) {
    return null;
  }

  try {
    // Ensure your backend's refresh endpoint exists and accepts this format
    const response = await fetch(`${API_BASE_URL}/api/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Your backend likely expects an object like { "refresh": "token_string" }
      body: JSON.stringify({ refresh: currentRefreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      // Your backend probably sends 'access' from the refresh endpoint.
      const newAccessToken = data.access || data.access_token;
      if (newAccessToken) {
        toast.success("Session refreshed!");
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        return newAccessToken;
      }
    }
    
    // If we reach here, the refresh token was invalid or expired.
    // The user must log in again.
    throw new Error("Invalid refresh token");

  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear all auth data to prevent loops
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    // Force a page reload to the login page
    toast.error("Your session has fully expired. Please log in again.");
    window.location.href = '/login'; 
    return null;
  }
}

/**
 * A wrapper for fetch that automatically adds the Authorization header
 * and handles token refresh on 401 Unauthorized errors.
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not set in environment variables.");
  }
  
  let accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  if (!accessToken) {
    // If there's no token, the user isn't logged in. Don't even try to fetch.
    throw new Error("User not authenticated. Cannot make an authenticated request.");
  }

  const fullUrl = `${API_BASE_URL}${url}`;

  const buildHeaders = (token: string, body?: BodyInit): HeadersInit => {
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    // The browser automatically sets Content-Type for FormData, so we must not set it ourselves.
    if (body && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  };
  

  // First attempt with the current access token
  let response = await fetch(fullUrl, {
    ...options,
    headers: buildHeaders(accessToken, options.body),
  });

  // If the first attempt fails with 401 Unauthorized, the token might be expired.
  if (response.status === 401) {
    toast.info("Session expired, attempting to refresh...");
    const newAccessToken = await refreshToken();

    if (newAccessToken) {
      // If we got a new token, retry the original request with it.
      console.log("Retrying original request with new token.");
      response = await fetch(fullUrl, {
        ...options,
        headers: buildHeaders(newAccessToken, options.body),
      });
    } else {
      // If refreshToken() returns null, it means the refresh failed completely.
      // The refreshToken function has already handled logging the user out.
      // We throw an error to stop the execution in the calling component.
      throw new Error("Session expired and could not be refreshed.");
    }
  }

  if (response.status === 429) {
    const errorMessage = "You are making too many requests. Please wait a moment and try again.";
    toast.error("Rate Limit Reached", {
        description: errorMessage,
        duration: 5000, // Show the toast for 5 seconds
    });
    // We throw an error so the calling component knows the request ultimately failed
    // and can stop any loading spinners.
    throw new Error("Rate limit exceeded.");
  }

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detail = errorData.detail || `Request failed with status: ${response.status}`;
      throw new Error(detail);
  }
  
  return response;
}