import { createContext, useContext, useEffect, useState } from "react";
import { authApi, apiErr } from "@/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = loading, false = logged out
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    authApi.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setError(apiErr(error));
        setUser(false);
        return;
      }
      setUser(data.session?.user || false);
    });

    const {
      data: { subscription },
    } = authApi.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user || false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setError("");
    const { data, error } = await authApi.login(email.trim(), password);
    if (error) {
      setError(apiErr(error));
      return false;
    }
    setUser(data.user);
    return true;
  };

  const register = async (email, password, username) => {
    setError("");
    const { data, error } = await authApi.register(email.trim(), password, username);
    if (error) {
      setError(apiErr(error));
      return false;
    }

    if (!data.session) {
      setError("Account created. Check your email to confirm the account, then log in.");
      return true;
    }

    setUser(data.user);
    return true;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(false);
  };

  return (
    <AuthCtx.Provider value={{ user, error, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
