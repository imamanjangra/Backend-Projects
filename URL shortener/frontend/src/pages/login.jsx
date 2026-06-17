import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Link as LinkIcon, Mail, Apple, PieChart, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import API from "@/service/Api";
import { AuthContext } from "@/Contexts/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/Home");
  }, [user, navigate]);

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/users/login", { email, password });
      console.log(data);

      const userData = {
        _id: data?.user?._id,
        name: data?.user?.FullName,
        email: data?.user?.email
      };
      console.log(userData);
      
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setUser(userData);

      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f3] px-4 py-10">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden py-0 rounded-[2rem] border border-border bg-white shadow-[0_24px_80px_rgba(11,23,54,0.1)]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="px-8 py-10 md:px-12 lg:px-14">
              <Link to='/' className="flex items-center gap-3 mb-8">
                <div className="rounded-3xl bg-orange px-3 py-2 shadow-lg shadow-orange/15">
                  <LinkIcon className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-navy">LinkShort</span>
              </Link>

              <div className="mb-8">
                <CardTitle className="text-4xl font-semibold tracking-tight text-navy mb-3">Welcome back!</CardTitle>
                <CardDescription className="text-base text-muted-foreground max-w-xl">
                  Log in to your account and start shortening links with analytics that help you grow.
                </CardDescription>
              </div>

              {/* <div className="grid gap-3 mb-6">
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
                </button>
              </div> */}

              {/* <div className="relative my-6">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                <div className="relative mx-auto w-fit bg-white px-4 text-sm text-muted-foreground">OR</div>
              </div> */}

              <CardContent className="p-0">
                <form onSubmit={handleLoginForm} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-navy">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="rounded-2xl border-gray-300 focus-visible:ring-orange"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-navy">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 rounded-2xl border-gray-300 focus-visible:ring-orange"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-2xl bg-navy hover:bg-[#15274d] text-white py-3 text-base font-semibold transition-colors" disabled={loading}>
                    {loading ? "Signing in..." : "Log in"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <span>Don't have an account? </span>
                  <Link to="/signup" className="font-semibold text-navy hover:text-orange hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </div>

            <div className="relative overflow-hidden bg-orange/5 px-18 py-18 h-full md:px-12 lg:px-14">
              <div className="absolute -right-32 top-10 h-56 w-56 rounded-full bg-orange/20 blur-3xl" />
              <div className="relative">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-orange">LinkShort</span>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-navy">Shorten, share, and track with ease.</h2>
                <p className="mt-4 max-w-lg text-sm text-muted-foreground">
                  Access powerful link shortening with analytics, team-ready link management, and fast URL creation.
                </p>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-3xl border border-orange/20 bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange text-white">
                        <PieChart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">Analytics built in</p>
                        <p className="text-sm text-muted-foreground">See click trends and URL performance instantly.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-orange/20 bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">Link growth</p>
                        <p className="text-sm text-muted-foreground">Create memorable URLs and increase sharing.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}