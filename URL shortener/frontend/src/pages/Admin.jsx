import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, Search, Edit3, Trash2, FolderOpen } from "lucide-react";
import API from "@/service/Api";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [urls, setUrls] = useState([]);
  const [allUrls, setAllUrls] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showUrls, setShowUrls] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [expandedUserUrls, setExpandedUserUrls] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUrlId, setEditingUrlId] = useState(null);
  const [editUserFullName, setEditUserFullName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUrlOriginal, setEditUrlOriginal] = useState("");
  const [editUrlShortID, setEditUrlShortID] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const fetchAdminData = async () => {
    setLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const [statsRes, totalUserRes, totalUrlRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/TotalUser"),
        API.get("/admin/TotalUrl"),
      ]);

      const fetchedUsers = totalUserRes?.data?.user || [];
      const fetchedUrls = totalUrlRes?.data?.url || [];

      setStats(statsRes?.data);
      setUsers(fetchedUsers);
      setAllUsers(fetchedUsers);
      setUrls(fetchedUrls);
      setAllUrls(fetchedUrls);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSearchUsers = async () => {
    setStatusMessage("");
    if (!searchUser.trim()) {
      setUsers(allUsers);
      setStatusMessage("Showing all users.");
      return;
    }

    try {
      const res = await API.get(`/admin/serchUser?query=${encodeURIComponent(searchUser.trim())}`);
      setUsers(res.data.user || []);
      setStatusMessage(`${res.data.count || 0} user(s) found.`);
    } catch (err) {
      setError(err.response?.data?.message || "User search failed");
    }
  };

  const handleSearchUrls = async () => {
    setStatusMessage("");
    if (!searchUrl.trim()) {
      setUrls(allUrls);
      setStatusMessage("Showing all URLs.");
      return;
    }

    try {
      const res = await API.get(`/admin/serchUrl?query=${encodeURIComponent(searchUrl.trim())}`);
      setUrls(res.data.url || []);
      setStatusMessage(`${res.data.count || 0} URL(s) found.`);
    } catch (err) {
      setError(err.response?.data?.message || "URL search failed");
    }
  };

  const handleToggleUserUrls = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setExpandedUserUrls([]);
      return;
    }

    try {
      const res = await API.get(`/admin/userUrl/${userId}`);
      setExpandedUserId(userId);
      setExpandedUserUrls(res.data.url || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user URLs");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await API.delete(`/admin/deleteUser/${userId}`);
      setStatusMessage("User deleted successfully.");
      setExpandedUserId((current) => (current === userId ? null : current));
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteUrl = async (urlId) => {
    if (!window.confirm("Delete this URL permanently?")) return;

    try {
      await API.delete(`/admin/deleteUrl/${urlId}`);
      setStatusMessage("URL deleted successfully.");
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete URL");
    }
  };

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditUserFullName(user.FullName || "");
    setEditUserEmail(user.email || "");
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setEditUserFullName("");
    setEditUserEmail("");
  };

  const handleUpdateUser = async (userId) => {
    if (!editUserFullName.trim() && !editUserEmail.trim()) {
      setStatusMessage("Provide name or email to update.");
      return;
    }

    try {
      await API.post(`/admin/updateUser/${userId}`, {
        FullName: editUserFullName.trim(),
        email: editUserEmail.trim(),
      });
      setStatusMessage("User updated successfully.");
      cancelEditUser();
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const startEditUrl = (url) => {
    setEditingUrlId(url._id);
    setEditUrlOriginal(url.originalUrl || "");
    setEditUrlShortID(url.shortID || "");
  };

  const cancelEditUrl = () => {
    setEditingUrlId(null);
    setEditUrlOriginal("");
    setEditUrlShortID("");
  };

  const handleUpdateUrl = async (urlId) => {
    if (!editUrlOriginal.trim() && !editUrlShortID.trim()) {
      setStatusMessage("Provide URL or short code to update.");
      return;
    }

    try {
      await API.post(`/admin/updateUrl/${urlId}`, {
        originalUrl: editUrlOriginal.trim(),
        customName: editUrlShortID.trim(),
      });
      setStatusMessage("URL updated successfully.");
      cancelEditUrl();
      await fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update URL");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Users className="text-black w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">Admin Panel</h1>
            <p className="text-gray-500">Manage users, URLs, and admin actions.</p>
          </div>
        </div>
      </div>

      <Card className="border-border shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-6">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading admin data...</div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {statusMessage && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {statusMessage}
                </div>
              )}

              {stats && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-slate-200 shadow-none">
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                        <p className="mt-2 text-3xl font-semibold text-black">{stats.totalUser}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowUsers((prev) => !prev)}
                        className="w-full"
                      >
                        {showUsers ? "Hide Users" : "Show Total Users"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 shadow-none">
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total URLs</h3>
                        <p className="mt-2 text-3xl font-semibold text-black">{stats.totalUrl}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowUrls((prev) => !prev)}
                        className="w-full"
                      >
                        {showUrls ? "Hide URLs" : "Show Total URLs"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Search size={16} />
                    <span className="text-sm font-medium">Search Users</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Search by name or email"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                    />
                    <Button variant="secondary" onClick={handleSearchUsers} className="shrink-0">
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchUser("");
                        setUsers(allUsers);
                        setStatusMessage("");
                      }}
                      className="shrink-0"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Search size={16} />
                    <span className="text-sm font-medium">Search URLs</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={searchUrl}
                      onChange={(e) => setSearchUrl(e.target.value)}
                      placeholder="Search by URL or short code"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                    />
                    <Button variant="secondary" onClick={handleSearchUrls} className="shrink-0">
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchUrl("");
                        setUrls(allUrls);
                        setStatusMessage("");
                      }}
                      className="shrink-0"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {showUsers && (
                <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-black">User List</h2>
                      <p className="text-sm text-gray-500">View registered users and manage them directly.</p>
                    </div>
                    <div className="text-sm text-slate-600">{users.length} user(s) displayed</div>
                  </div>

                  {users.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                      No users found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.map((u) => (
                        <div key={u._id} className="rounded-2xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-black text-white grid place-items-center text-lg font-semibold shadow-sm">
                                {u.FullName?.charAt(0) || u.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-black">{u.FullName || "Unknown User"}</div>
                                <div className="text-sm text-gray-500">{u.email}</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleUserUrls(u._id)}
                                className="gap-2"
                              >
                                <FolderOpen size={14} />
                                {expandedUserId === u._id ? "Hide URLs" : "View URLs"}
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => startEditUser(u)}
                                className="gap-2"
                              >
                                <Edit3 size={14} />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(u._id)}
                                className="gap-2"
                              >
                                <Trash2 size={14} />
                                Delete
                              </Button>
                            </div>
                          </div>

                          {editingUserId === u._id && (
                            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                  value={editUserFullName}
                                  onChange={(e) => setEditUserFullName(e.target.value)}
                                  placeholder="Full Name"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                                />
                                <input
                                  value={editUserEmail}
                                  onChange={(e) => setEditUserEmail(e.target.value)}
                                  placeholder="Email"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                                />
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" size="sm" onClick={() => handleUpdateUser(u._id)}>
                                  Save changes
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEditUser}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {expandedUserId === u._id && (
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <h3 className="text-sm font-semibold text-black">URLs for {u.FullName || u.email}</h3>
                              {expandedUserUrls.length === 0 ? (
                                <div className="mt-3 text-sm text-slate-500">No URLs found for this user.</div>
                              ) : (
                                <div className="mt-3 space-y-3">
                                  {expandedUserUrls.map((url) => (
                                    <div key={url._id} className="rounded-2xl border border-slate-200 bg-white p-3">
                                      <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                          <div className="text-sm text-gray-500">Original URL</div>
                                          <div className="text-sm font-medium text-black wrap-break-word">{url.originalUrl || "-"}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm text-gray-500">Short ID</div>
                                          <div className="text-sm font-medium text-slate-900">{url.shortID || "-"}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {showUrls && (
                <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-black">URL List</h2>
                      <p className="text-sm text-gray-500">View and manage shortened URLs.</p>
                    </div>
                    <div className="text-sm text-slate-600">{urls.length} URL(s) displayed</div>
                  </div>

                  {urls.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                      No URLs found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {urls.map((u) => (
                        <div key={u._id} className="rounded-2xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-gray-500">Original URL</div>
                              <div className="text-base font-semibold text-black wrap-break-word">{u.originalUrl || "Unknown URL"}</div>
                              <div className="text-sm text-slate-600">Short ID: <span className="font-medium text-slate-900">{u.shortID || "-"}</span></div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => startEditUrl(u)} className="gap-2">
                                <Edit3 size={14} />
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteUrl(u._id)} className="gap-2">
                                <Trash2 size={14} />
                                Delete
                              </Button>
                            </div>
                          </div>

                          {editingUrlId === u._id && (
                            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <input
                                  value={editUrlOriginal}
                                  onChange={(e) => setEditUrlOriginal(e.target.value)}
                                  placeholder="Original URL"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                                />
                                <input
                                  value={editUrlShortID}
                                  onChange={(e) => setEditUrlShortID(e.target.value)}
                                  placeholder="Short ID"
                                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                                />
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <Button variant="secondary" size="sm" onClick={() => handleUpdateUrl(u._id)}>
                                  Save changes
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEditUrl}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
