// import { redirect } from "react-router";
// import type { Route } from "../+types/root";
// import { apiClient } from "../api";

// // This route handles the logout action
// export async function action({ request }: Route.ActionArgs) {
//   if (request.method === 'POST') {
//     try {
//       // Call the logout API endpoint
//       await apiClient.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Continue with logout even if API call fails
//     }
    
//     // Redirect to login page
//     return redirect('/login');
//   }
  
//   return redirect('/');
// }

// export default function LogoutPage() {
//   // This page won't be displayed, just redirects
//   return null;
// }


import { redirect } from "react-router";
import type { Route } from "../+types/root";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  ((import.meta as any).env?.DEV ? "/api" : "http://mg-api:3000/api");

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return redirect("/login");
  }

  try {
    const incomingCookie = request.headers.get("cookie");
    const apiResponse = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: incomingCookie ? { cookie: incomingCookie } : undefined,
    });

    const headers = new Headers({ Location: "/login" });
    const getSetCookie = (apiResponse.headers as any).getSetCookie;
    if (typeof getSetCookie === "function") {
      const setCookies: string[] = getSetCookie.call(apiResponse.headers);
      for (const cookieHeader of setCookies) {
        headers.append("Set-Cookie", cookieHeader);
      }
    } else {
      const setCookie = apiResponse.headers.get("set-cookie");
      if (setCookie) {
        headers.append("Set-Cookie", setCookie);
      }
    }

    return new Response(null, { status: 303, headers });
  } catch (error) {
    console.error("Logout error:", error);
    return redirect("/login");
  }
}

export default function LogoutPage() {
  return null;
}
