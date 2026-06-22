import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './Contexts/auth.context';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="694445691521-kpsaejk88sej2hpbjh4nt8mjj5ma7s6c.apps.googleusercontent.com">
  <AuthProvider>
     <Toaster
  position="down-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: "#1f2937", 
      color: "#fff",
      padding: "16px",
      borderRadius: "10px",
    },
    success: {
      style: {
        background: "#16a34a", 
      },
    },
    error: {
      style: {
        background: "#dc2626", 
      },
    },
  }}
/>

    <App />
  </AuthProvider>
  </GoogleOAuthProvider>
)