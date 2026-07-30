import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "@/service/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Central login handler
  const login = (data) => {
    // Extract token safely from backend payload keys
    const token = data?.accessToken || data?.token || data?.jwt;
    console.log(token)
    if (token) {
      localStorage.setItem("token", token);
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  // Central logout
  const forceLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Normal logout
  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch (error) {
      console.log("Logout error:", error.message);
    }
    forceLogout();
    toast.success("Logged out successfully");
  };

  // Listen for global logout events (from Axios interceptors)
  useEffect(() => {
    const handleLogout = () => forceLogout();
    window.addEventListener("logout", handleLogout);
    setLoading(false);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};