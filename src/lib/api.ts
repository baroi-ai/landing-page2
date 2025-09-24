// src/lib/api.ts

import { toast } from "sonner";

// Read the base URL from the environment ONCE in this file.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * A simple wrapper for making public (unauthenticated) GET requests.
 * It automatically handles constructing the full URL and basic error handling.
 * 
 * @param endpoint The API endpoint path (e.g., '/api/announcements/active').
 * @returns The JSON response data.
 */
export async function publicApiGet(endpoint: string) {
  // Check if the environment variable is set.
  if (!API_BASE_URL) {
    const errorMessage = "API URL is not configured. Please set VITE_API_BASE_URL in your .env file.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    // Construct the full URL here, in one central place.
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(fullUrl);

    if (response.status === 429) {
      toast.error("Too Many Requests", {
        description: "You're doing that too fast! Please wait a moment before trying again.",
        duration: 5000,
      });
      // Throw an error to stop the component's loading state.
      throw new Error("Rate limit exceeded.");
    }

    if (!response.ok) {
      // Try to get a meaningful error message from the backend.
      const errorData = await response.json().catch(() => ({}));
      const detail = errorData.detail || `Request failed with status ${response.status}`;
      throw new Error(detail);
    }

    // Handle cases where the response might be empty (e.g., a 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    }
    return null; // Return null if response is not JSON

  } catch (error) {
    console.error(`API GET call to ${endpoint} failed:`, error);
    // Re-throw the error so the component that called it can handle it
    // (e.g., show an error message in the UI).
    throw error;
  }
}

/**
 * A simple wrapper for making public (unauthenticated) POST requests.
 * 
 * @param endpoint The API endpoint path (e.g., '/api/users/register').
 * @param body The JavaScript object to be sent as the request body.
 * @returns The JSON response data.
 */
export async function publicApiPost(endpoint: string, body: any) {
    if (!API_BASE_URL) {
        const errorMessage = "API URL is not configured. Please set VITE_API_BASE_URL in your .env file.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
    try {
        const fullUrl = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (response.status === 429) {
            toast.error("Too Many Submissions", {
                description: "You're doing that too fast! Please wait a moment.",
                duration: 5000,
            });
            throw new Error("Rate limit exceeded.");
        }
        // --- END OF ADDITION ---

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || `Request failed with status ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error(`API POST call to ${endpoint} failed:`, error);
        throw error;
    }
}