import { Form, redirect, useActionData, useNavigation, useLocation } from "react-router";
import type { Route } from "../+types/root";
import { apiClient } from "../api";
import styled from "styled-components";
import { useState, useEffect } from "react";

import {
  LoginContainer,
  LoginBox,
  LoginTitle,
  LoginSubtitle,
  LoginFormGroup,
  LoginLabel,
  LoginInput,
  LoginSubmitButton,
  LoginErrorAlert
} from "../components";


export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return null;
  }

  const formData = await request.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;




  try {
    // If running on the server (SSR/dev server action), perform the fetch to the
    // backend and forward the Set-Cookie header back to the browser via redirect.
    const isServer = typeof window === 'undefined';


    if (isServer) {
      const env = (import.meta as any).env || {};
      let base = env.VITE_API_URL || 'http://mg-api:3000/api';
      if (base.startsWith('/')) {
        base = `http://mg-api:3000${base}`;
      }

      const incomingCookie = request.headers.get("cookie") || "";

      // Perform login
      const loginRes = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const setCookie = loginRes.headers.get('set-cookie');
      const data = await loginRes.json().catch(() => ({}));

      if (!loginRes.ok) {
        return { error: data.message || 'Login failed' };
      }

      // Verify session using the cookie we just got (or existing cookie)
      const meRes = await fetch(`${base}/auth/me`, {
        headers: {
          cookie: setCookie || incomingCookie
        }
      });

      if (!meRes.ok) {
        return { error: 'Session not established' };
      }

      // Forward cookie to browser and redirect
      const headers: Record<string, string> = {};
      if (setCookie) headers['Set-Cookie'] = setCookie;

      return redirect('/', { headers });
    }

    // Client-side path: call apiClient which uses fetch in the browser
    const response = await apiClient.login(username, password);
    if (response.success) {
      return redirect('/');
    }
    return { error: response.message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { error: error instanceof Error ? error.message : 'An error occurred during login' };
  }
}

// Fixes hydration mismatch by only rendering the form on the client after mount
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}


export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const location = useLocation();
  const isSubmitting = navigation.state === 'submitting';
  const actionResult = actionData as { error?: string } | undefined;


  return (
    <LoginContainer>
      <LoginBox>
        <LoginTitle>🥋 Monkey Grip</LoginTitle>
        <LoginSubtitle>BJJ Club Management System</LoginSubtitle>

        <LoginErrorAlert $show={!!actionResult?.error}>
          {actionResult?.error}
        </LoginErrorAlert>

        <ClientOnly>
          <Form method="POST">
            <LoginFormGroup>
              <LoginLabel htmlFor="username">Username</LoginLabel>
              <LoginInput
                type="text"
                id="username"
                name="username"
                required
                disabled={isSubmitting}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </LoginFormGroup>

            <LoginFormGroup>
              <LoginLabel htmlFor="password">Password</LoginLabel>
              <LoginInput
                type="password"
                id="password"
                name="password"
                required
                disabled={isSubmitting}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </LoginFormGroup>

            <LoginSubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </LoginSubmitButton>
          </Form>
        </ClientOnly>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </LoginBox>
    </LoginContainer>
  );
}


