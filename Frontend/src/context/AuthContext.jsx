import { createContext, useContext, useEffect, useMemo, useState } from "react";

const storageKey = "safepath-user";
const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser());

  useEffect(() => {
    if (user) localStorage.setItem(storageKey, JSON.stringify(user));
    else localStorage.removeItem(storageKey);
  }, [user]);

  const auth = useMemo(
    () => ({
      user,
      signIn: ({ email, name }) => {
        if (!email && !name) throw new Error("Provide email or name");
        const id = email || name;
        setUser({ id, email, name: name || email });
        return { id, email, name: name || email };
      },
      signUp: ({ email, name }) => {
        if (!email) throw new Error("Email required");
        const id = email;
        setUser({ id, email, name: name || email });
        return { id, email, name: name || email };
      },
      signOut: () => setUser(null)
    }),
    [user]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
