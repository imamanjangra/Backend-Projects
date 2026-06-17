import { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/Contexts/auth.context";
import { Home, LayoutDashboard, LogOut, Users, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Shorten URL", path: "/Home", icon: <Home size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  ];

  // Optionally add Admin tab if there's a role or we just expose it for demo
  navLinks.push({ name: "Admin", path: "/admin", icon: <Users size={18} /> });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <LinkIcon className="text-black" />
              <span className="text-xl font-bold tracking-tight text-black">LinkShort</span>
              <div className="hidden md:flex ml-10 space-x-8">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 border-gray-200 hover:bg-gray-100">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar below */}
      <div className="md:hidden flex justify-between p-4 bg-white border-b">
         <div className="flex items-center gap-2">
           <LinkIcon className="text-black" />
           <span className="text-xl font-bold tracking-tight text-black">LinkShort</span>
         </div>
         <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
      </div>
      <div className="md:hidden flex flex-wrap justify-center gap-4 p-3 bg-white border-b border-gray-200 text-sm">
        {navLinks.map((link) => (
           <Link
             key={link.path}
             to={link.path}
             className={`flex items-center gap-1 font-medium ${location.pathname === link.path ? 'text-black font-bold' : 'text-gray-500'}`}
           >
             {link.name}
           </Link>
        ))}
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
