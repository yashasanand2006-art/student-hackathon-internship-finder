import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Briefcase,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  Bookmark,
  Users,
  Compass,
  Zap,
  Globe2,
} from 'lucide-react';
import api from '../services/api';
import OpportunityModal from '../components/OpportunityModal';
import { useBookmarks } from '../context/BookmarkContext';

const LandingPage = () => {
  const [featuredHackathons, setFeaturedHackathons] = useState([]);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('hackathon');
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, internRes] = await Promise.all([
          api.get('/hackathons?limit=3'),
          api.get('/internships?limit=3'),
        ]);

        if (hackRes.data.success) {
          setFeaturedHackathons(hackRes.data.data || []);
        }
        if (internRes.data.success) {
          setFeaturedInternships(internRes.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/hackathons?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/hackathons');
    }
  };

  const openDetails = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-hero-glow pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-glow-purple">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Over $500,000+ in Hackathon Prizes & Top Tech Internships</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Launch Your Tech Career with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              High-Impact Opportunities
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
            DevNexus connects ambitious student developers to verified collegiate hackathons, high-compensation software internships, and cutting-edge tech events.
          </p>

          {/* Quick Search Launcher */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl mb-12"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search AI hackathons, Stripe internships, React roles..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 shadow-glow-purple transition-all"
            >
              <span>Explore Opps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                $450K+
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Prizes & Travel Grants
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 block">
                50+
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Verified Global Jams
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 block">
                $55/hr
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Avg Top Internship Pay
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">
                100%
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Free for All Students
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Collegiate Competitions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trending Global Hackathons
            </h2>
          </div>
          <Link
            to="/hackathons"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All Hackathons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHackathons.map((hackathon) => {
            const saved = isBookmarked('hackathon', hackathon._id);
            return (
              <div
                key={hackathon._id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Banner */}
                  <div className="relative h-44 w-full bg-slate-800">
                    <img
                      src={
                        hackathon.bannerUrl ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={hackathon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    {/* Mode badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-purple-300 border border-purple-500/30">
                      {hackathon.mode}
                    </span>

                    {/* Bookmark quick button */}
                    <button
                      onClick={() => toggleBookmark('hackathon', hackathon)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-amber-400 transition-colors"
                      title={saved ? 'Remove Bookmark' : 'Save Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Prize Pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                      <DollarSign className="w-3 h-3" />
                      <span>{hackathon.prizePool ? `$${hackathon.prizePool.toLocaleString()}` : 'Prizes'}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <p className="text-xs text-purple-400 font-semibold mb-1">
                      {hackathon.organizer}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {hackathon.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {hackathon.tagline || hackathon.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hackathon.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-5 pb-5 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>
                      {new Date(hackathon.registrationDeadline).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => openDetails(hackathon, 'hackathon')}
                    className="px-3.5 py-1.5 rounded-lg font-semibold text-xs text-purple-300 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Internships Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Career Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Software Internships
            </h2>
          </div>
          <Link
            to="/internships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View All Internships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredInternships.map((internship) => {
            const saved = isBookmarked('internship', internship._id);
            return (
              <div
                key={internship._id}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {internship.logoUrl ? (
                        <img
                          src={internship.logoUrl}
                          alt={internship.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                          {internship.company.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {internship.company}
                        </h4>
                        <span className="text-[11px] text-blue-400 font-medium">
                          {internship.location}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark('internship', internship)}
                      className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mb-2 line-clamp-1">
                    {internship.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {internship.description}
                  </p>

                  {/* Skills pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {internship.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">
                    {internship.stipend}
                  </span>
                  <button
                    onClick={() => openDetails(internship, 'internship')}
                    className="px-3.5 py-1.5 rounded-lg font-semibold text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 transition-all"
                  >
                    View Role
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why DevNexus Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Why Top Developers Choose DevNexus
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A specialized platform engineered specifically to solve the friction of discovering genuine collegiate software roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Zero Dead-End Listings
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every hackathon and internship is verified by campus administrators with real deadlines and live external registration portals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Instant Bookmark Radar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your favorite opportunities in one click. Our student dashboard calculates upcoming deadline countdowns so you never miss an application.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Tailored Skill Filters
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Slice through hundreds of events by technology stack, prize pool size, remote vs in-person modes, and team sizes in real time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-tr from-purple-900/40 via-slate-900 to-blue-900/40 border border-purple-500/30 shadow-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Build, Hack, and Level Up?
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
            Create your student profile today, bookmark upcoming hackathons, and apply directly to vetted tech internships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 shadow-glow-purple transition-all"
            >
              Sign Up Free
            </Link>
            <Link
              to="/hackathons"
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
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

export default LandingPage;
