import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, storedUser, clearAuth, getToken } from "../lib/api";

const AuthContext = createContext({ user: null, loading: true, refresh: async () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storedUser());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.get("/api/auth/me");
      setUser(data.user);
    } catch {
      clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Logout is client-side: just delete the stored token.
  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
