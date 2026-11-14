import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import {
  Code2,
  Bookmark,
  LayoutDashboard,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Briefcase,
  Trophy,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-white bg-purple-600/20 text-purple-400 border border-purple-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0F19]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-glow-purple group-hover:scale-105 transition-transform duration-200">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                DevNexus
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-purple-400/80 -mt-1">
                Student Opps
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/hackathons" className={navLinkClasses}>
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>Hackathons</span>
            </NavLink>
            <NavLink to="/internships" className={navLinkClasses}>
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Internships</span>
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/bookmarks" className={navLinkClasses}>
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Saved</span>
                  {bookmarks.length > 0 && (
                    <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {bookmarks.length}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard</span>
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClasses}>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Admin Console</span>
              </NavLink>
            )}
          </nav>

          {/* User Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pl-2 pr-3 rounded-full bg-slate-900 border border-slate-700/80 hover:border-purple-500/50 transition-colors"
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || 'User'
                      )}&background=7C3AED&color=fff&bold=true`
                    }
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <span className="text-[10px] text-purple-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      Student Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-glow-purple hover:brightness-110 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0B0F19] px-4 pt-2 pb-5 space-y-2">
          <Link
            to="/hackathons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            Hackathons
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <Briefcase className="w-4 h-4 text-blue-400" />
            Internships
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/bookmarks"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                Saved Opportunities ({bookmarks.length})
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Student Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <User className="w-4 h-4 text-purple-400" />
                Profile Settings
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-300 hover:bg-rose-950/40 rounded-lg"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-400 bg-rose-950/30 rounded-lg border border-rose-900/50"
              >
                <LogOut className="w-4 h-4" />
                Log Out ({user?.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-xs font-semibold text-slate-200 bg-slate-800 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-xs font-semibold text-white bg-purple-600 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
