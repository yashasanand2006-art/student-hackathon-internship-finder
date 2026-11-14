import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  DollarSign,
  Bookmark,
  Users,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import SearchFilterBar from '../components/SearchFilterBar';
import OpportunityModal from '../components/OpportunityModal';
import { useBookmarks } from '../context/BookmarkContext';

const HACKATHON_TAGS = [
  'AI/ML',
  'Web3',
  'LLMs',
  'Python',
  'Rust',
  'Full Stack',
  'Solidity',
  'HealthTech',
  'Cybersecurity',
  'Cloud',
  'Open Source',
];

const HackathonsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('newest');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'All');

  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (mode !== 'All') params.append('mode', mode);
        if (status !== 'All') params.append('status', status);
        if (selectedTag !== 'All') params.append('tag', selectedTag);
        if (sort) params.append('sort', sort);

        const { data } = await api.get(`/hackathons?${params.toString()}`);
        if (data.success) {
          setHackathons(data.data || []);
          setTotalCount(data.total || data.count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch hackathons:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchHackathons();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, mode, status, sort, selectedTag]);

  const handleResetFilters = () => {
    setSearch('');
    setMode('All');
    setStatus('All');
    setSort('newest');
    setSelectedTag('All');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" />
          <span>Collegiate Competitions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Student Hackathons
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Browse vetted virtual and in-person hackathons offering prize pools, travel stipends, and sponsor mentorship.
        </p>
      </div>

      {/* Filter Component */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        primaryFilter={mode}
        setPrimaryFilter={setMode}
        primaryOptions={['Online', 'In-Person', 'Hybrid']}
        primaryLabel="Format"
        statusFilter={status}
        setStatusFilter={setStatus}
        statusOptions={['All', 'Open', 'Upcoming', 'Closed']}
        sort={sort}
        setSort={setSort}
        sortOptions={[
          { label: 'Recently Added', value: 'newest' },
          { label: 'Highest Prize Pool', value: 'prize_high' },
          { label: 'Deadline (Soonest)', value: 'deadline_soon' },
          { label: 'Oldest', value: 'oldest' },
        ]}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        availableTags={HACKATHON_TAGS}
        onReset={handleResetFilters}
      />

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{hackathons.length}</strong> of{' '}
          <strong className="text-white">{totalCount}</strong> opportunities
        </span>
      </div>

      {/* Grid of Hackathon Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="glass-panel rounded-2xl h-80 animate-pulse p-6 bg-slate-900/40"
            />
          ))}
        </div>
      ) : hackathons.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Hackathons Found</h3>
          <p className="text-xs text-slate-400">
            No events matched your current search and filter combination. Try resetting your search filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => {
            const saved = isBookmarked('hackathon', hackathon._id);

            return (
              <div
                key={hackathon._id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Banner */}
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

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark('hackathon', hackathon)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-amber-400 transition-colors"
                      title={saved ? 'Remove Bookmark' : 'Save Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Prize Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        {hackathon.prizePool ? `$${hackathon.prizePool.toLocaleString()}` : 'Free Entry'}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
                      {hackathon.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-xs text-purple-400 font-semibold mb-1">
                      {hackathon.organizer}
                    </p>
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                      {hackathon.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {hackathon.tagline || hackathon.description}
                    </p>

                    {/* Metadata items */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{hackathon.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Up to {hackathon.maxTeamSize || 4} Members</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {hackathon.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
                        >
                          {tag}
                        </span>
                      ))}
                      {hackathon.tags?.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-500 font-semibold">
                          +{hackathon.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Due: {formatDate(hackathon.registrationDeadline)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedHackathon(hackathon)}
                      className="px-3 py-1.5 rounded-lg font-semibold text-xs text-purple-300 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 transition-all"
                    >
                      Details
                    </button>
                    <a
                      href={hackathon.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open External Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedHackathon && (
        <OpportunityModal
          item={selectedHackathon}
          type="hackathon"
          onClose={() => setSelectedHackathon(null)}
        />
      )}
    </div>
  );
};

export default HackathonsPage;
