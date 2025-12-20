// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../config/apiClient";

const USER_KEY = "safepath-user";
const TOKEN_KEY = "safepath-token";

const AuthContext = createContext(null);

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJson(USER_KEY));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [booting, setBooting] = useState(true);

  // persist user/token
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  // validate token on refresh
  useEffect(() => {
    const run = async () => {
      try {
        if (!token) {
          setBooting(false);
          return;
        }
        const res = await apiGet("/api/auth/me");
        if (res?.user) setUser(res.user);
        else {
          setUser(null);
          setToken("");
        }
      } catch {
        setUser(null);
        setToken("");
      } finally {
        setBooting(false);
      }
    };
    run();
  }, [token]);

  const auth = useMemo(
    () => ({
      user,
      token,
      booting,
      isLoggedIn: Boolean(token),
      isAdmin: user?.role === "ADMIN",

      // backend login
      signIn: async ({ email, password }) => {
        const data = await apiPost("/api/auth/login", { email, password });
        setUser(data.user);
        setToken(data.token);
        return data.user;
      },

      // backend register
      signUp: async ({ name, email, password, role }) => {
        const data = await apiPost("/api/auth/register", { name, email, password, role });
        setUser(data.user);
        setToken(data.token);
        return data.user;
      },

      signOut: () => {
        setUser(null);
        setToken("");
      }
    }),
    [user, token, booting]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
