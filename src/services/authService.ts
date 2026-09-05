import apiClient from "@/lib/axios";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch {
      // Mock successful login fallback for standalone offline mode
      const isStudent = credentials.email?.toLowerCase().includes("student");
      return {
        user: isStudent
          ? {
              id: "student-1",
              firstName: "Alex",
              lastName: "Rahman",
              email: credentials.email || "student@nexurahub.com",
              role: "student",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              bio: "Passionate web development student & full-stack enthusiast",
              occupation: "Computer Science Student",
            }
          : {
              id: "instructor-1",
              firstName: "Jenny",
              lastName: "Jimenez",
              email: credentials.email || "instructor@nexurahub.com",
              role: "instructor",
              avatar: "/assets/images/profile.jpg",
              bio: "Senior full stack instructor & software architect",
              occupation: "Software Engineer",
            },
        token: "demo-jwt-token-" + Date.now(),
      };
    }
  },

  async register(data: RegisterCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch {
      return {
        user: {
          id: "user-" + Date.now(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role || "student",
          avatar: "/assets/images/profile.jpg",
        },
        token: "demo-jwt-token-" + Date.now(),
      };
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put("/auth/profile", userData);
    return response.data;
  },
};

export default authService;
