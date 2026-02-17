import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "../+types/root";
import { apiClient } from "../api";
import styled from "styled-components";
import { useState } from "react";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
`;

const LoginBox = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  text-align: center;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
`;

const LoginSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin: 0 0 2rem 0;
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-of-type {
    margin-bottom: 2rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorAlert = styled.div<{ show: boolean }>`
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  display: ${props => props.show ? 'block' : 'none'};
  font-size: 0.95rem;
`;

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

    // if (isServer) {
    //   // Resolve backend base URL for server-side fetch. If VITE_API_URL is a
    //   // relative path (e.g. '/api') inside Docker, point to the mg-api service.
    //   const env = (import.meta as any).env || {};
    //   let base = env.VITE_API_URL || 'http://localhost:3000/api';
    //   if (base.startsWith('/')) {
    //     base = `http://mg-api:3000${base}`;
    //   }

    //   const res = await fetch(`${base}/auth/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password })
    //   });

    //   const data = await res.json().catch(() => ({}));

    //   if (res.ok) {
    //     // Forward Set-Cookie if present so browser stores the session cookie.
    //     const setCookie = res.headers.get('set-cookie');
    //     if (setCookie) {
    //       return redirect('/', { headers: { 'Set-Cookie': setCookie } });
    //     }
    //     return redirect('/');
    //   }

    //   return { error: data.message || 'Login failed' };
    // }

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

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const actionResult = actionData as { error?: string } | undefined;

  return (
    <LoginContainer>
      <LoginBox>
        <LoginTitle>🥋 Monkey Grip</LoginTitle>
        <LoginSubtitle>BJJ Club Management System</LoginSubtitle>

        <ErrorAlert show={!!actionResult?.error}>
          {actionResult?.error}
        </ErrorAlert>

        <Form method="POST">
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              required
              disabled={isSubmitting}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              disabled={isSubmitting}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </p>
      </LoginBox>
    </LoginContainer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="BJJ Club Management Login" />
        <title>Login - Monkey Grip Admin</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
