import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Copy, Check, BarChart2, Calendar, Trash, QrCode, X } from "lucide-react";
import API from "@/service/Api";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { user } = useContext(AuthContext);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/url/getUrl");
        setUrls(res.data?.urls || []);

      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch URLs");
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  const copyToClipboard = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyModalLink = () => {
    if (!selectedUrl?.shortLink) return;
    navigator.clipboard.writeText(selectedUrl.shortLink);
    setCopiedId(selectedUrl.shortLink);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this link?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/url/delete/${id}`);

      setUrls(prev =>
        prev.filter(url => url._id !== id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-navy">Links</h1>
        <Button
          type="button"
          className="bg-orange hover:bg-[#d5551c] text-white"
          onClick={() => navigate("/app")}
        >
          Create new
        </Button>
      </div>

      <Card className="border-border shadow-sm rounded-xl bg-white min-h-125">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading your links...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-medium">{error}</div>
          ) : urls.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Link2 className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">You haven't shortened any links</h3>
              <p className="max-w-sm mb-6 text-sm">Start building your audience by creating your first short link.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {urls.map((url) => {
                const shortLink = `http://localhost:8000/${url.shortID}`;
                const origLink = url.originalUrl || url.original_url;
                // Since this isn't returned by backend natively yet, we mock a title/clicks
                // const title = url.title || "Untitled Link";
                const clicks = url.clicks || Math.floor(Math.random() * 50);

                return (
                  <div key={url._id} className="p-5 sm:p-6 hover:bg-[#f4f6fa] transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 pr-4">
                      {/* <h3 className="font-bold text-lg text-navy truncate mb-1">{title}</h3> */}
                      <div className="flex items-center gap-2 mb-2">
                        <a href={shortLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange hover:underline truncate">
                          {shortLink}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                        <span className="truncate max-w-50 sm:max-w-md block">{origLink}</span>
                      </div>
                      <div className="flex items-center justify-between w-full  gap-4 text-xs font-medium text-gray-400">
                        <div className="flex">
                          <div className="flex items-center gap-1"><Calendar size={14} /> Created recently</div>
                          <div className="flex items-center gap-1 text-navy bg-[#f4f6fa] px-2 py-0.5 rounded-md"><BarChart2 size={14} className="text-orange" /> <button
                            onClick={() => {
                              localStorage.setItem("urlId", url._id);
                              navigate(`/app/analytics/${url._id}`);
                            }}
                          >
                            Analytics
                          </button></div>
                        </div>

                      </div>
                    </div>

                    <div className="flex items-center flex-col gap-2 mt-4 sm:mt-0 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-gray-50 border-gray-200 transition-colors"
                        onClick={() => copyToClipboard(url._id, shortLink)}
                      >
                        {copiedId === url._id ? <Check size={16} className="text-green-600 mr-2" /> : <Copy size={16} className="mr-2" />}
                        {copiedId === url._id ? "Copied" : "Copy"}
                      </Button>
                      <div className="w-full flex items-center justify-evenly mt-1 flex-row" >
                        <button
                          type="button"
                          onClick={() => handleDelete(url._id)}
                        ><Trash size={20} className="text-red-600" />
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={() => {
                            setSelectedUrl({ shortLink, qrcode: url.Qrcode });
                            setShowQrModal(true);
                          }}
                        >
                          <QrCode size={18} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {showQrModal && selectedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-navy">QR Code</h2>
                <p className="text-sm text-gray-500">Scan or copy the short link below.</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                onClick={() => setShowQrModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-6 text-center">
              <div className="inline-flex h-64 w-64 items-center justify-center rounded-3xl bg-gray-50 p-6">
                <img src={selectedUrl.qrcode} alt="QR Code" className="max-h-full max-w-full" />
              </div>
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Short link</p>
                <p className="mt-2 break-all text-sm font-medium text-gray-900">{selectedUrl.shortLink}</p>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-2xl bg-orange px-4 py-3 text-sm font-semibold text-white hover:bg-[#d5551c] transition-colors"
                onClick={() => {
                  copyModalLink();
                }}
              >
                {copiedId === selectedUrl.shortLink ? "Link copied" : "Copy link"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
