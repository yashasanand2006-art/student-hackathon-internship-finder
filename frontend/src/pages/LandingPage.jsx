import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Briefcase,
  ArrowRight,
  Search,
  Calendar,
  DollarSign,
  Bookmark,
  Users,
  Cpu,
  Bot,
  Code2,
  Shield,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';
import OpportunityModal from '../components/OpportunityModal';
import { useBookmarks } from '../context/BookmarkContext';

const TECH_CATEGORIES = [
  {
    name: 'Artificial Intelligence & ML',
    tag: 'Artificial Intelligence',
    icon: Sparkles,
    count: '24+ Active',
    description: 'LLM agents, multimodal reasoning, PyTorch fine-tuning',
    path: '/hackathons?tag=Artificial%20Intelligence',
  },
  {
    name: 'Robotics & Hardware',
    tag: 'Robotics',
    icon: Bot,
    count: '12+ Active',
    description: 'ROS 2, embedded systems, autonomous drones, C++',
    path: '/hackathons?tag=Robotics',
  },
  {
    name: 'Full-Stack & Web',
    tag: 'Web Development',
    icon: Code2,
    count: '38+ Active',
    description: 'Next.js, React, Node.js, distributed databases',
    path: '/internships?skill=React',
  },
  {
    name: 'Systems & Cloud',
    tag: 'Cloud',
    icon: Cpu,
    count: '18+ Active',
    description: 'Go, Rust, Kubernetes, high-concurrency microservices',
    path: '/internships?skill=Go',
  },
  {
    name: 'Cybersecurity',
    tag: 'Cybersecurity',
    icon: Shield,
    count: '9+ Active',
    description: 'CTF tournaments, automated defense, reverse engineering',
    path: '/hackathons?tag=Cybersecurity',
  },
  {
    name: 'Decentralized Tech',
    tag: 'Web3',
    icon: Layers,
    count: '11+ Active',
    description: 'Zero Knowledge proofs, cryptography, DeFi protocols',
    path: '/hackathons?tag=Web3',
  },
];

const LandingPage = () => {
  const [featuredHackathons, setFeaturedHackathons] = useState([]);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [searchTarget, setSearchTarget] = useState('all'); // 'all', 'hackathon', 'internship'
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
    const query = quickSearch.trim();
    if (searchTarget === 'internship') {
      navigate(query ? `/internships?search=${encodeURIComponent(query)}` : '/internships');
    } else {
      navigate(query ? `/hackathons?search=${encodeURIComponent(query)}` : '/hackathons');
    }
  };

  const openDetails = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  return (
    <div className="relative overflow-hidden bg-navy-950">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-hero-ambient pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 border-b border-navy-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-blue text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span>2026–2027 Collegiate Recruiting & Hackathon Calendar Open</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Where ambitious student engineers discover{' '}
            <span className="text-blue-400">verified opportunities.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-10">
            DevNexus aggregates verified collegiate hackathons, high-compensation engineering internships, and research grants. Built specifically for computer science and engineering students.
          </p>

          {/* Professional Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto p-2 rounded-2xl bg-navy-900 border border-navy-800 shadow-elevated mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Scope Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-navy-950 border border-navy-800 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSearchTarget('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    searchTarget === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Opps
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTarget('hackathon')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    searchTarget === 'hackathon'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hackathons
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTarget('internship')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    searchTarget === 'internship'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Internships
                </button>
              </div>

              {/* Text Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Search AI hackathons, Stripe internships, robotics roles..."
                  className="w-full pl-10 pr-4 py-2 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Filter Tag Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-12">
            <span className="text-slate-500 font-medium">Popular:</span>
            {['TreeHacks', 'OpenAI', 'Robotics', 'Remote Internships', '$50+/hr'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuickSearch(item);
                  navigate(`/hackathons?search=${encodeURIComponent(item)}`);
                }}
                className="px-2.5 py-1 rounded-md bg-navy-900 border border-navy-800 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Platform Stat Proof Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-navy-800 text-left">
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
              <span className="text-2xl font-bold text-white block">
                $435,000+
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Prizes & Hardware Grants
              </span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
              <span className="text-2xl font-bold text-blue-400 block">
                $55/hr
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Average Engineering Pay
              </span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
              <span className="text-2xl font-bold text-slate-200 block">
                100% Verified
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Official Campus Portals
              </span>
            </div>
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
              <span className="text-2xl font-bold text-emerald-400 block">
                Free Access
              </span>
              <span className="text-xs text-slate-400 font-medium">
                No Paywalls for Students
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section (Requirement 8) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">
            Focus Areas
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Browse by Engineering Discipline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore curated opportunities tailored to your technical specialization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={cat.path}
                className="card-interactive p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold badge-slate">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-blue-400 transition-colors">
                  <span>Explore opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Hackathons Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Collegiate Competitions</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Featured Collegiate Hackathons
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top university jams offering prize money, travel stipends, and hardware access.
            </p>
          </div>
          <Link
            to="/hackathons"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View All Hackathons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHackathons.map((hackathon) => {
            const saved = isBookmarked('hackathon', hackathon._id);
            return (
              <div
                key={hackathon._id}
                className="card-interactive overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Banner */}
                  <div className="relative h-44 w-full bg-navy-950">
                    <img
                      src={
                        hackathon.bannerUrl ||
                        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={hackathon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

                    {/* Mode badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-navy-950/90 text-blue-300 border border-navy-700">
                      {hackathon.mode}
                    </span>

                    {/* Bookmark button */}
                    <button
                      onClick={() => toggleBookmark('hackathon', hackathon)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-navy-950/90 text-slate-300 hover:text-amber-400 transition-colors border border-navy-700"
                      title={saved ? 'Remove Bookmark' : 'Save Bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Prize Pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-navy-950/90 text-emerald-400 border border-emerald-500/30">
                      <DollarSign className="w-3 h-3" />
                      <span>{hackathon.prizePool ? `$${hackathon.prizePool.toLocaleString()}` : 'Free Entry'}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <p className="text-[11px] text-blue-400 font-semibold mb-1">
                      {hackathon.organizer}
                    </p>
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                      {hackathon.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {hackathon.tagline || hackathon.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {hackathon.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-medium badge-slate"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-5 pb-5 pt-3 border-t border-navy-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {new Date(hackathon.registrationDeadline).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => openDetails(hackathon, 'hackathon')}
                    className="px-3 py-1.5 rounded-lg font-semibold text-xs text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 transition-all"
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
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Engineering Careers</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              High-Compensation Tech Internships
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verified software, AI, and systems engineering roles for Summer 2027.
            </p>
          </div>
          <Link
            to="/internships"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View All Internships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredInternships.map((internship) => {
            const saved = isBookmarked('internship', internship._id);
            return (
              <div
                key={internship._id}
                className="card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {internship.logoUrl ? (
                        <img
                          src={internship.logoUrl}
                          alt={internship.company}
                          className="w-11 h-11 rounded-xl object-cover border border-navy-800 bg-navy-950 p-1"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
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
                      className="p-2 rounded-lg bg-navy-950 text-slate-400 hover:text-amber-400 transition-colors border border-navy-800"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-2 line-clamp-1">
                    {internship.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {internship.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {internship.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium badge-slate"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">
                    {internship.stipend}
                  </span>
                  <button
                    onClick={() => openDetails(internship, 'internship')}
                    className="px-3 py-1.5 rounded-lg font-semibold text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 transition-all"
                  >
                    View Role
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Standards Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">
            Verification Promise
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Engineered for Transparency
          </h2>
          <p className="text-xs text-slate-400">
            No ghost jobs, no expired applications, and no sponsored spam listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Direct Application Portals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every link navigates directly to the official company ATS (Greenhouse, Lever, Workday) or collegiate Devpost portal.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Automated Deadline Radar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save opportunities in one click. Your student dashboard monitors registration deadlines with automated countdown alerts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Fair Compensation Standards
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We exclusively list paid internships and collegiate hackathons offering genuine prize pools and travel stipends.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Box */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-8 sm:p-12 bg-navy-900 border border-navy-800 shadow-elevated text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Start Tracking Opportunities Today
          </h2>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Create your free student profile to bookmark hackathons, save target internships, and receive deadline notifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
            >
              Sign Up Free
            </Link>
            <Link
              to="/hackathons"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 transition-colors"
            >
              Browse Hackathons
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
