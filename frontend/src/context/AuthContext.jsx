import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("traveloop_token") || null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("traveloop_token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("traveloop_token");
      if (storedToken) {
        try {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
          const res = await api.get("/auth/profile");
          setUser(res.data.user);
          setToken(storedToken);
        } catch {
          localStorage.removeItem("traveloop_token");
          setUser(null);
          setToken(null);
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("traveloop_token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("traveloop_token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("traveloop_token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
