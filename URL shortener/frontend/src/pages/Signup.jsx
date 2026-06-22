import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "../App.css";
import API from "@/service/Api";
import { AuthContext } from "@/Contexts/auth.context";
import { useGoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(name, email, password, confirmPassword);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const signupWithGoogle = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (codeResponse) => {
      try {
        const response = await API.post("/users/google-login", {
          code: codeResponse.code,
        });
        const { data } = response;
        console.log(data);

        const userData = data.user;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        toast.success("Account created successfully");
        navigate("/Home");
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed");
      }
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/users/register", {
        FullName: name,
        username: email.split("@")[0],
        email,
        password,
      });
      console.log(data);

     
      toast.success("Account created successfully. Please verify your email.");
      navigate("/check-email");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const checks = {
    length: password.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passwordStrength =
    Number(checks.length) +
    Number(checks.special) +
    Number(checks.uppercase) +
    Number(checks.number);

  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f3] px-4 py-10">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden rounded-[2rem] p-0 border border-border bg-white shadow-[0_24px_80px_rgba(11,23,54,0.1)]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="px-8 py-10 md:px-12 lg:px-14">
              <Link to="/" className="flex items-center gap-3 mb-8">
                <div className="rounded-3xl bg-orange px-3 py-2 shadow-lg shadow-orange/15">
                  <LinkIcon className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-navy">
                  LinkShort
                </span>
              </Link>

              {/* <div className="grid gap-3 mb-6"> */}
              {/* <button type="button" className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-navy transition hover:border-orange/50 hover:bg-orange/5">
                  <Google className="h-5 w-5 text-orange" />
                  Continue with Google
                </button> */}
              {/* <button type="button" className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-navy transition hover:border-orange/50 hover:bg-orange/5">
                  <Apple className="h-5 w-5 text-navy" />
                  Continue with Apple
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-navy transition hover:border-orange/50 hover:bg-orange/5">
                  <Mail className="h-5 w-5 text-orange" />
                  Continue with Email
                </button> */}
              {/* </div> */}

              {/* <div className="relative my-6">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                <div className="relative mx-auto w-fit bg-white px-4 text-sm text-muted-foreground">OR</div>
              </div> */}

              <CardContent className="p-0">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-navy"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="rounded-2xl border-gray-300 focus-visible:ring-orange"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-navy"
                    >
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="rounded-2xl border-gray-300 focus-visible:ring-orange"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-navy"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pr-10 rounded-2xl border-gray-300 focus-visible:ring-orange"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-navy"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pr-10 rounded-2xl border-gray-300 focus-visible:ring-orange"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      password
                        ? "max-h-60 opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">
                          Password Strength
                        </span>
                        <span
                          className={`font-medium
          ${
            passwordStrength < 2
              ? "text-red-500"
              : passwordStrength < 4
                ? "text-amber-500"
                : "text-green-500"
          }
        `}
                        >
                          {strengthLabel}
                        </span>
                      </div>

                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300
          ${
            passwordStrength < 2
              ? "bg-red-500"
              : passwordStrength < 4
                ? "bg-amber-500"
                : "bg-green-500"
          }
        `}
                          style={{
                            width: `${(passwordStrength / 4) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="grid gap-1 text-xs">
                        <div
                          className={
                            checks.length ? "text-green-500" : "text-slate-500"
                          }
                        >
                          {checks.length ? "✓" : "○"} 8+ characters
                        </div>

                        <div
                          className={
                            checks.uppercase
                              ? "text-green-500"
                              : "text-slate-500"
                          }
                        >
                          {checks.uppercase ? "✓" : "○"} Uppercase letter
                        </div>

                        <div
                          className={
                            checks.number ? "text-green-500" : "text-slate-500"
                          }
                        >
                          {checks.number ? "✓" : "○"} Number
                        </div>

                        <div
                          className={
                            checks.special ? "text-green-500" : "text-slate-500"
                          }
                        >
                          {checks.special ? "✓" : "○"} Special character
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-2xl bg-navy hover:bg-[#15274d] text-white py-3 text-base font-semibold transition-colors"
                    disabled={loading}
                   
                  >
                    {loading ? "Creating account..." : "Sign up"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <span>Already have an account? </span>
                  <Link
                    to="/login"
                    className="font-semibold text-navy hover:text-orange hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </CardContent>

              <div className="relative my-6">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200"></div>
                <div className="relative mx-auto w-fit bg-white px-4 text-sm text-gray-500">
                  OR
                </div>
              </div>
              <div className="grid gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => signupWithGoogle()}
                  className="flex items-center justify-center gap-3 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-navy shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-orange"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden bg-orange/5 ">
              <div className="absolute -right-32  rounded-full bg-orange/20 blur-3xl" />
              <img
                src="../signup.png"
                alt="singup"
                className="h-full w-full object-cover "
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
