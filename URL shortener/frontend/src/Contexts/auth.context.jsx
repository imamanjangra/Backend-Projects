import API from "@/service/Api";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
// import API from "../utils/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    try {
      if (savedUser && savedUser !== "undefined") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Invalid user data in localStorage", error.message);
      localStorage.removeItem("user");
    }
  }, []);

  const logout = async () => {
    try {
      await API.post("/user/logout"); // clear cookie in backend
    } catch (error) {
      console.log("Error Caught while loging out User", error.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    toast.success("Logout successfully");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};