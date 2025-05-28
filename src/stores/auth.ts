import { writable } from 'svelte/store';
import type { AuthState, User, AuthResponse } from '../types';

export const authStore = writable<AuthState>({
  isAuthenticated: false,
  token: null,
  user: null
});

export function setAuth(token: string, user?: User) {
  localStorage.setItem('token', token);
  authStore.set({
    isAuthenticated: true,
    token,
    user: user || null
  });
}

export function clearAuth() {
  localStorage.removeItem('token');
  authStore.set({
    isAuthenticated: false,
    token: null,
    user: null
  });
}

export function initAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    authStore.set({
      isAuthenticated: true,
      token,
      user: null // Will be loaded separately
    });
  }
}

// Login function that handles the API response structure
export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://workouts-api.mounis.net/tokens/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      const token = data.auth_token?.token;
      
      if (token) {
        setAuth(token);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid response format' };
      }
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (err) {
    return { success: false, error: 'Connection error. Please try again.' };
  }
}
