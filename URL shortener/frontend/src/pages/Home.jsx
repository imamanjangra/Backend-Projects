import { useState, useContext } from "react";
import { Link2, Copy, Check, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";  
import { Link, useNavigate } from "react-router-dom";
import API from "@/service/Api";
import { AuthContext } from "@/Contexts/auth.context";
export default function Home() {

  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log(originalUrl, shortUrl,);

  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  
  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    try {
      const res = await API.post("/url/create", { originalUrl });

      if (!user) {
        navigate("/login");
        return;
      }
      const shortID = res.data.newUrl.shortID;
      console.log(shortID);

      setShortUrl(`http://localhost:8000/${shortID}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6fa]">
      {/* Guest Navigation */}
      <nav className="w-full bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange rounded p-1">
              <Navigation size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-navy">LinkShort</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-navy hover:text-orange transition-colors">Log in</Link>
            <Link to="/signup">
              <Button className="bg-orange hover:bg-[#d5551c] text-white">Sign up Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-center mb-10 w-full max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-navy mb-6">
            Build stronger digital <span className="text-orange">connections</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Use our URL shortener to create neat and memorable links. Sign up for advanced analytics and link management.
          </p>
        </div>

        <Card className="w-full max-w-3xl border-border shadow-lg rounded-2xl overflow-hidden bg-white mx-4">
          <form onSubmit={handleShorten} className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-navy mb-4">Shorten a long link</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-2">
              <div className="relative w-full flex-1">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                <Input
                  type="url"
                  placeholder="Paste your long URL here (e.g. https://example.com/very/long/url)"
                  value={originalUrl}
                  onChange={e => setOriginalUrl(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-12 h-16 text-lg rounded-xl border-gray-300 focus-visible:ring-orange"
                />
              </div>
              <Button type="submit" disabled={loading || !originalUrl} className="h-16 px-10 w-full sm:w-auto rounded-xl bg-navy hover:bg-[#15274d] text-white font-bold text-lg transition-colors shrink-0">
                {loading ? "Shortening..." : "Get your link"}
              </Button>
            </div>

            {error && <div className="text-red-500 text-sm font-medium mt-2">{error}</div>}


          </form>
        </Card>
      </div>
    </div>
  );
}