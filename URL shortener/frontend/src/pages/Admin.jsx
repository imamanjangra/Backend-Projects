import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Mail } from "lucide-react";
import API from "@/service/Api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="mb-8 flex items-center gap-3">
        <Users className="text-black w-8 h-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Admin Panel</h1>
          <p className="text-gray-500">Manage registered users.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading users...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 font-medium">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center text-gray-500">No users found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((u) => (
                <div key={u._id} className="p-5 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black uppercase text-white font-bold rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      {u.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-black">{u.name || "Unknown User"}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Mail size={14} className="text-gray-400" />
                        {u.email}
                      </div>
                    </div>
                  </div>
                  {/* Actions can be added here */}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
