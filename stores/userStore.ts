// stores/userStore.ts
import { BASE_URL } from "@/utils/baseUrl";
import { create } from "zustand";

interface User {
  email: string;
  username: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>; // New method to fetch user
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    }
    set({ accessToken: token });
  },
  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    set({ user: null, accessToken: null });
  },
  fetchUser: async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await fetch(`${BASE_URL}/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }

          const data = await response.json();
          set({ user: data.user, accessToken: token });
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("access_token"); // Clear invalid token
          set({ user: null, accessToken: null });
        }
      }
    }
  },
}));

export default useUserStore;
