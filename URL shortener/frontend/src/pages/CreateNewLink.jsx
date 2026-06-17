import API from "@/service/Api";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CreateNewLink() {
  const [createUrl, setCreateurl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState(false);
  const [qrCode, setQRCode] = useState("");
  const [showQr, setShowQr] = useState(false);

  async function handleShorten(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setShortUrl("");
    setQRCode("");
    setShowQr(false);

    
    try {
      const res = await API.post("/url/create", {
        originalUrl: createUrl,
        qrcode: qr,
      });
      console.log(res);
      
      const shortID = res.data.newUrl?.shortID;

      setShortUrl(`http://localhost:8000/${shortID}`);
      setQRCode(res.data.newUrl?.Qrcode || "");
      setCreateurl("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (!shortUrl) return;

    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-white shadow-2xl">
          <div className="absolute inset-y-0 right-0 w-72 opacity-20 blur-3xl bg-white/50" />

          <div className="relative grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
                Smart Shortening
              </span>

              <h1 className="text-4xl text-orange font-extrabold tracking-tight sm:text-5xl">
                Shorten any link with a polished result.
              </h1>

              <p className="max-w-2xl text-base text-white/90 sm:text-lg">
                Paste a long URL and instantly generate a short link. Toggle QR
                generation, copy the link, and preview the result.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/20  p-6 shadow-xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-white/80">
                QR code status
              </p>

              <div className="mt-6 flex items-center justify-between rounded-3xl bg-white/15 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">
                    Current mode
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {qr ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  {qr ? "QR ON" : "QR OFF"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Create a short link
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Enter a long URL below and generate a short link instantly.
              </p>

              <form onSubmit={handleShorten} className="mt-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Long URL
                  </label>

                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="url"
                      placeholder="https://example.com/very/long/url"
                      value={createUrl}
                      onChange={(e) => setCreateurl(e.target.value)}
                      required
                      disabled={loading}
                      className="h-14 rounded-3xl border-slate-200 pl-12 text-base focus:border-orange-400 focus-visible:ring-orange/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Generate QR code
                    </p>

                    <p className="text-sm text-slate-500">
                      The short URL will include a QR if enabled.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setQr(true)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        qr
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-white text-slate-700 ring-1 ring-slate-200"
                      }`}
                    >
                      On
                    </button>

                    <button
                      type="button"
                      onClick={() => setQr(false)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        !qr
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-white text-slate-700 ring-1 ring-slate-200"
                      }`}
                    >
                      Off
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-3xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !createUrl}
                  className="w-full rounded-3xl bg-navy py-4 text-base font-semibold text-white hover:bg-[#15274d]"
                >
                  {loading ? "Shortening..." : "Generate Link"}
                </Button>
              </form>
            </div>

            <div className="border-l border-slate-100 bg-slate-50 p-8">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Result
                    </p>

                    <h3 className="mt-3 text-xl font-bold text-slate-900">
                      Ready to share
                    </h3>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                    Instant
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Short link
                    </p>

                    <p className="mt-3 break-all text-sm font-medium text-slate-900">
                      {shortUrl || "Your shortened link will appear here."}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!shortUrl}
                    onClick={copyToClipboard}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d5551c] disabled:cursor-not-allowed disabled:bg-orange-200"
                  >
                    <Copy size={16} />
                    {copied ? "Copied" : "Copy Link"}
                  </button>

                  {qrCode && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                            QR Code
                          </p>

                          <p className="mt-2 text-sm text-slate-600">
                            Scan to open your short URL.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowQr(!showQr)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                          {showQr ? "Hide" : "Show"}
                        </button>
                      </div>

                      {showQr && (
                        <div className="mt-4 flex items-center justify-center rounded-3xl bg-slate-100 p-4">
                          <img
                            src={qrCode}
                            alt="QR Code"
                            className="h-48 w-48 rounded-2xl object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CreateNewLink;