// User types
export interface User {
  id?: number;
  username: string;
  email?: string;
}

// Auth API response types
export interface AuthToken {
  token: string;
  created_at: string;
  expiry: string;
}

export interface AuthResponse {
  auth_token: AuthToken;
}

// Workout entry types for forms (string inputs)
export interface WorkoutEntryForm {
  exercise_name: string;
  sets: string;
  reps: string;
  duration_seconds: string;
  weight: string;
  notes: string;
  order_index: number;
}

// Workout entry types for API
export interface WorkoutEntry {
  id?: number;
  exercise_name: string;
  sets?: number | null;
  reps?: number | null;
  duration_seconds?: number | null;
  weight?: number | null;
  notes?: string | null;
  order_index: number;
}

// Workout types
export interface Workout {
  id: number;
  user_id?: number;
  title: string;
  description: string;
  duration_minutes: number;
  calories_burned: number;
  created_at: string;
  updated_at?: string;
  entries?: WorkoutEntry[];
}

// Workouts API response type
export interface WorkoutsResponse {
  workouts: Workout[];
}

// Auth store types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}
