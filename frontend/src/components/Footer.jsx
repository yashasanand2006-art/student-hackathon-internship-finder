import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Server, Terminal, Github, ExternalLink } from 'lucide-react';
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
    <footer className="w-full bg-navy-950 border-t border-navy-800 pt-14 pb-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">DevNexus</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              The premier opportunity discovery engine for collegiate engineers, researchers, and builders. Curated hackathons and high-compensation internships verified by campus ambassadors.
            </p>
            {/* Real-time system health pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900 border border-navy-800 text-[11px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus?.status === 'online'
                    ? 'bg-emerald-400'
                    : 'bg-rose-500'
                }`}
              ></span>
              <span className="text-slate-300 font-medium">
                Engine: {healthStatus?.database?.mode || 'Active'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/hackathons" className="text-slate-400 hover:text-white transition-colors">
                  All Hackathons
                </Link>
              </li>
              <li>
                <Link to="/internships" className="text-slate-400 hover:text-white transition-colors">
                  Software Internships
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-slate-400 hover:text-white transition-colors">
                  Saved Radar
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Tracks */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200 mb-4">
              Focus Areas
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/hackathons?tag=Artificial%20Intelligence" className="text-slate-400 hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/hackathons?tag=Robotics" className="text-slate-400 hover:text-white transition-colors">
                  Robotics & Systems
                </Link>
              </li>
              <li>
                <Link to="/internships?type=Remote" className="text-slate-400 hover:text-white transition-colors">
                  Remote Engineering
                </Link>
              </li>
              <li>
                <Link to="/hackathons?tag=Cybersecurity" className="text-slate-400 hover:text-white transition-colors">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Standards */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200 mb-4">
              Platform Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Deadlines</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span>Direct Application Links</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Fair Compensation Standards</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 DevNexus Technologies Inc. All opportunities verified for students.</p>
          <div className="flex items-center gap-6">
            <Link to="/hackathons" className="hover:text-slate-300 transition-colors">
              Terms & Privacy
            </Link>
            <a
              href="https://github.com/yashasanand2006-art/student-hackathon-internship-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <span>GitHub Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
