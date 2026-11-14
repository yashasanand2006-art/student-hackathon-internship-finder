import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import {
  Compass,
  Bookmark,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Briefcase,
  Trophy,
  ArrowRight,
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
    `flex items-center gap-2 text-xs font-semibold tracking-wide transition-all duration-150 px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-white bg-blue-600/15 text-blue-400 border border-blue-500/25'
        : 'text-slate-300 hover:text-white hover:bg-navy-850'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-navy-950/90 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                DevNexus
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Campus
                </span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-medium text-slate-400 -mt-0.5">
                Opportunities for Builders
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/hackathons" className={navLinkClasses}>
              <Trophy className="w-3.5 h-3.5 text-blue-400" />
              <span>Hackathons</span>
            </NavLink>
            <NavLink to="/internships" className={navLinkClasses}>
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Internships</span>
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/bookmarks" className={navLinkClasses}>
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Saved</span>
                  {bookmarks.length > 0 && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      {bookmarks.length}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dashboard</span>
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClasses}>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
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
                  className="flex items-center gap-2.5 p-1 pl-2 pr-3 rounded-full bg-navy-900 border border-navy-800 hover:border-blue-500/40 transition-colors"
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || 'User'
                      )}&background=1E293B&color=94A3B8&bold=true`
                    }
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30"
                  />
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-100 leading-tight truncate max-w-[110px]">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <span className="text-[10px] text-blue-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-navy-900 border border-navy-800 shadow-xl py-2 z-50 animate-in fade-in duration-100"
                  >
                    <div className="px-4 py-2 border-b border-navy-800">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-850"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      Student Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-850"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                      Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-blue-300 hover:text-white hover:bg-navy-850"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        Admin Console
                      </Link>
                    )}

                    <div className="border-t border-navy-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-navy-850 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-800 bg-navy-950 px-4 pt-2 pb-5 space-y-2">
          <Link
            to="/hackathons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-navy-850 rounded-lg"
          >
            <Trophy className="w-4 h-4 text-blue-400" />
            Hackathons
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-navy-850 rounded-lg"
          >
            <Briefcase className="w-4 h-4 text-slate-400" />
            Internships
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/bookmarks"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-navy-850 rounded-lg"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                Saved Opportunities ({bookmarks.length})
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-navy-850 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-navy-850 rounded-lg"
              >
                <User className="w-4 h-4 text-blue-400" />
                Profile Settings
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-navy-850 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-400 bg-rose-950/20 rounded-lg border border-rose-900/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-xs font-semibold text-slate-200 bg-navy-900 border border-navy-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
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
