import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Heart, Server, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';

const Footer = () => {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const { data } = await api.get('/health');
        setHealthStatus(data);
      } catch (err) {
        setHealthStatus({ status: 'offline', database: { mode: 'Offline' } });
      }
    };
    checkHealth();
  }, []);

  return (
    <footer className="w-full bg-[#070A12] border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-glow-purple">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">DevNexus</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier opportunity discovery engine for collegiate software engineers, hackers, and researchers worldwide.
            </p>
            {/* Real-time system health pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus?.status === 'online'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-rose-500'
                }`}
              ></span>
              <span className="text-slate-300 font-medium">
                {healthStatus?.database?.mode || 'Connecting to REST API...'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/hackathons" className="hover:text-purple-400 transition-colors">
                  Browse Hackathons
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-blue-400 transition-colors">
                  Top Tech Internships
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-amber-400 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/hackathons?tag=AI/ML" className="hover:text-slate-200">
                  Artificial Intelligence & LLMs
                </Link>
              </li>
              <li>
                <Link to="/internships?type=Remote" className="hover:text-slate-200">
                  Remote Engineering Roles
                </Link>
              </li>
              <li>
                <Link to="/hackathons?mode=In-Person" className="hover:text-slate-200">
                  In-Person Collegiate Jams
                </Link>
              </li>
              <li>
                <Link to="/internships?skill=React" className="hover:text-slate-200">
                  Frontend & Full-Stack Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Stack & Credentials */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200 mb-4">
              Production Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>JWT Auth & Bcrypt Security</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Server className="w-4 h-4 text-blue-400" />
                <span>Express REST APIs & Mongoose</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Tailwind CSS & React Router</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DevNexus Platform. Engineered for aspiring builders.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
