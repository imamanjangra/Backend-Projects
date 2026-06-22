import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {  useContext } from "react";
import { AuthContext } from "@/Contexts/auth.context";
import { useState } from "react";
import toast from "react-hot-toast";
import API from "@/service/Api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleVerification = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post(`/users/verify/${token}`, {
        email,
        password,
      });

      if (data.isVerified) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        toast.success("Email verified successfully!");

        setEmail("");
        setPassword("");

        navigate("/app");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-100 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <span className="text-4xl">✉️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Verify Your Email
        </h1>

        <p className="mt-3 text-center text-gray-500">
          Please confirm your email and password to activate your account.
        </p>

        {/* Form */}
        <form onSubmit={handleVerification} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition duration-300 hover:bg-blue-700"
          >
            Verify Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          For your security, only the account owner can complete verification.
        </p>
      </div>
    </div>
  );
}
