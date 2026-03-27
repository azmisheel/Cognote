import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSideBar }) => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSideBar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block"></div>
        <div className="flex items-center gap-3">
          <button className="relative inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200 group">
            <Bell
              size={20}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-slate-900"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-700/60">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors duration-200 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-500/30 transition-all duration-200">
                <User size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-white">
                  {user?.email || "user@gmail.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
