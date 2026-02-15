import { redirect } from "react-router";
import { apiClient } from "./api";

// Check if user is authenticated
export async function requireAuth() {
  try {
    const response = await apiClient.getCurrentUser();
    if (!response.success) {
      return redirect('/login');
    }
    return response.data;
  } catch (error) {
    // If any error (401, network error, etc.), redirect to login
    return redirect('/login');
  }
}

// Optional: Get current user if authenticated, return null otherwise
export async function getCurrentUserIfAuthenticated() {
  try {
    const response = await apiClient.getCurrentUser();
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}
