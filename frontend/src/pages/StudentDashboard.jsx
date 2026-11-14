import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Trophy,
  Briefcase,
  Bookmark,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import api from '../services/api';
import OpportunityModal from '../components/OpportunityModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { bookmarks, refreshBookmarks } = useBookmarks();
  const [recommended, setRecommended] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('hackathon');

  useEffect(() => {
    refreshBookmarks();

    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get('/hackathons?limit=2');
        if (data.success) {
          setRecommended(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };
    fetchRecommendations();
  }, [refreshBookmarks]);

  const hackathonBookmarks = bookmarks.filter((b) => b.itemType === 'hackathon');
  const internshipBookmarks = bookmarks.filter((b) => b.itemType === 'internship');

  // Compute upcoming deadlines
  const upcomingDeadlines = bookmarks
    .map((b) => {
      const isHack = b.itemType === 'hackathon';
      const item = isHack ? b.hackathon : b.internship;
      if (!item) return null;
      const deadline = new Date(
        isHack ? item.registrationDeadline : item.applicationDeadline
      );
      const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
      return {
        id: b._id,
        item,
        type: b.itemType,
        title: item.title,
        host: isHack ? item.organizer : item.company,
        deadline,
        daysLeft,
        url: isHack ? item.websiteUrl : item.applyUrl,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.deadline - b.deadline)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-blue-950/60 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || 'Student'
                )}&background=7C3AED&color=fff&bold=true`
              }
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-purple-500/30 shadow-glow-purple"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                  {user?.role} Portal
                </span>
                <span className="text-xs text-slate-400">
                  Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>
                  {user?.university || 'University not set'} •{' '}
                  {user?.major || 'Major not set'} ({user?.gradYear || 'Class of 2027'})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/profile"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              to="/hackathons"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 shadow-glow-purple transition-all"
            >
              Find Events
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Saved Hackathons
            </span>
            <span className="text-3xl font-black text-white">
              {hackathonBookmarks.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Saved Internships
            </span>
            <span className="text-3xl font-black text-white">
              {internshipBookmarks.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Next Deadline
            </span>
            <span className="text-xl font-bold text-emerald-400">
              {upcomingDeadlines.length > 0
                ? `${upcomingDeadlines[0].daysLeft} Days Left`
                : 'No Active Alerts'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Deadlines Radar (Left) + Skills & Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approaching Deadlines Radar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Approaching Application Deadlines</span>
            </h2>
            <Link
              to="/bookmarks"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              View All Saved
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                You haven't bookmarked any opportunities yet.
              </p>
              <Link
                to="/hackathons"
                className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600"
              >
                Explore Hackathons
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        dl.type === 'hackathon'
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {dl.type === 'hackathon' ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Briefcase className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        {dl.host}
                      </p>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {dl.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>
                          {dl.deadline.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        dl.daysLeft <= 3
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : dl.daysLeft <= 10
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {dl.daysLeft > 0 ? `${dl.daysLeft}d left` : 'Due Today!'}
                    </span>

                    <a
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open Registration Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Profile & Skills Summary Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <span>Profile & Skill Radar</span>
          </h2>

          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div>
              <span className="text-xs text-slate-400 block mb-1 font-semibold">
                Bio
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{user?.bio || 'Add your bio in profile settings to stand out to team leads and campus recruiters.'}"
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-2 font-semibold">
                Your Technical Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-600/10 text-purple-300 border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No skills added yet</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Profile Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resume Link</span>
                <span className="text-slate-200">
                  {user?.portfolioUrl ? 'Connected' : 'Not linked'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GitHub Profile</span>
                <span className="text-slate-200">
                  {user?.githubUrl ? 'Connected' : 'Not linked'}
                </span>
              </div>
            </div>

            <Link
              to="/profile"
              className="block w-full py-2.5 text-center rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Update Profile Info
            </Link>
          </div>
        </div>
      </div>

      {/* Opportunity Modal */}
      {selectedItem && (
        <OpportunityModal
          item={selectedItem}
          type={modalType}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
