/* eslint-disable react-hooks/static-components */

import { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/Contexts/auth.context";
import { Copy, Navigation, Link as LinkIcon, Settings, BarChart2, ShieldAlert, LogOut, Menu, X ,House } from "lucide-react";
import { useState } from "react";

export default function SidebarLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/app", icon: <House size={20} /> },
    { name: "Links", path: "/app/links", icon: <LinkIcon size={20} /> },
    { name: "Analytics", path: "/app/analytics", icon: <BarChart2 size={20} /> },
    { name: "Settings", path: "/app/settings", icon: <Settings size={20} /> },

    ...(user?.role === "admin"
      ? [{ name: "Admin", path: "/app/admin", icon: <ShieldAlert size={20} /> }]
      : []),
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-navy text-white">
      <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
        <div className="bg-orange rounded p-1.5">
          <Navigation size={24} className="text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight">LinkShort</span>
      </div>

      <div className="px-4 py-6 flex-1">
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Dashboard</p>
        <div className="space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium text-sm ${isActive
                  ? "bg-orange text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-sm truncate pr-2">
            <p className="font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate w-35">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-3 mt-2 rounded-lg transition-colors font-medium text-sm text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f4f6fa] overflow-hidden">
      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 z-50">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0 w-64 z-10 shadow-xl">
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-navy px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-orange rounded p-1">
              <Navigation size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">LinkShort</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-1 hover:bg-white/10 rounded">
            <Menu size={24} />
          </button>
        </div>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
