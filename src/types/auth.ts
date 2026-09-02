export type Role = "student" | "instructor" | "admin";

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  occupation?: string;
  phone?: string;
  website?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
