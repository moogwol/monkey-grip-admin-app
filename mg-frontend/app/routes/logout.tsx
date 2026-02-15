import { redirect } from "react-router";
import type { Route } from "../+types/root";
import { apiClient } from "../api";

// This route handles the logout action
export async function action({ request }: Route.ActionArgs) {
  if (request.method === 'POST') {
    try {
      // Call the logout API endpoint
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }
    
    // Redirect to login page
    return redirect('/login');
  }
  
  return redirect('/');
}

export default function LogoutPage() {
  // This page won't be displayed, just redirects
  return null;
}
