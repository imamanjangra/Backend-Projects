// // import API from "@/service/Api";
// // import { createContext, useEffect, useState } from "react";
// // import toast from "react-hot-toast";
// // // import API from "../utils/api";

// import { useState } from "react";
// import { createContext, useNavigate } from "react-router-dom";

// // // eslint-disable-next-line react-refresh/only-export-components
// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const savedUser = localStorage.getItem("user");

// //     try {
// //       if (savedUser && savedUser !== "undefined") {
// //         // eslint-disable-next-line react-hooks/set-state-in-effect
// //         setUser(JSON.parse(savedUser));
// //       }
// //     } catch (error) {
// //       console.log("Invalid user data in localStorage", error.message);
// //       localStorage.removeItem("user");
// //     }
// //   }, []);

// //   const logout = async () => {
// //     try {
// //       await API.post("/user/logout"); // clear cookie in backend
// //     } catch (error) {
// //       console.log("Error Caught while loging out User", error.message);
// //     }

// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //     setUser(null);

// //     toast.success("Logout successfully");
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, setUser, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// export const AuthContext = createContext  ();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ CENTRAL LOGOUT
//   const forceLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   // ✅ NORMAL LOGOUT
//   const logout = async () => {
//     try {
//       await API.post("/users/logout");
//     } catch (error) {}

//     forceLogout();
//     toast.success("Logout successfully");
//   };

//   // ✅ LISTEN GLOBAL LOGOUT (from interceptor)
//   useEffect(() => {
//     const handleLogout = () => forceLogout();

//     window.addEventListener("logout", handleLogout);
//     return () => window.removeEventListener("logout", handleLogout);
//   }, []);

  

//   // ✅ SHOW LOADER INSTEAD OF BLANK SCREEN
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "@/service/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


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
    toast.success("Logout successfully");
  };


  // Listen logout from axios interceptor
  useEffect(() => {

    const handleLogout = () => {
      forceLogout();
    };


    window.addEventListener(
      "logout",
      handleLogout
    );


    setLoading(false);


    return () => {
      window.removeEventListener(
        "logout",
        handleLogout
      );
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};