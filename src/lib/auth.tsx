import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken, getToken } from "./api";

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  branch?: string;
  year?: string;
  city?: string;
  role: "student" | "admin";
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupInput) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
};

export type SignupInput = {
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  city: string;
  password: string;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api<{ user: User }>("/auth/me");
      setUser(res.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const res = await api<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const signup = async (data: SignupInput) => {
    const res = await api<{ token: string; user: User }>("/auth/signup", {
      method: "POST",
      body: data,
      auth: false,
    });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        signup,
        logout,
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}