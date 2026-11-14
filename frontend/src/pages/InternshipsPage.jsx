import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  DollarSign,
  Bookmark,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import SearchFilterBar from '../components/SearchFilterBar';
import OpportunityModal from '../components/OpportunityModal';
import { useBookmarks } from '../context/BookmarkContext';

const INTERNSHIP_SKILLS = [
  'TypeScript',
  'React',
  'Python',
  'PyTorch',
  'Go',
  'Rust',
  'C++',
  'Node.js',
  'Distributed Systems',
  'Docker',
  'Robotics',
];

const InternshipsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState('newest');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || 'All');

  const [selectedInternship, setSelectedInternship] = useState(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (type !== 'All') params.append('type', type);
        if (status !== 'All') params.append('status', status);
        if (selectedSkill !== 'All') params.append('skill', selectedSkill);
        if (sort) params.append('sort', sort);

        const { data } = await api.get(`/internships?${params.toString()}`);
        if (data.success) {
          setInternships(data.data || []);
          setTotalCount(data.total || data.count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch internships:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchInternships();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, type, status, sort, selectedSkill]);

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setStatus('All');
    setSort('newest');
    setSelectedSkill('All');
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
        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Careers Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Software & Systems Internships
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Apply to paid, verified engineering, AI research, and infrastructure internships across top tech companies.
        </p>
      </div>

      {/* Filter Component */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        primaryFilter={type}
        setPrimaryFilter={setType}
        primaryOptions={['Remote', 'Onsite', 'Hybrid', 'Full-time', 'Part-time']}
        primaryLabel="Arrangement"
        statusFilter={status}
        setStatusFilter={setStatus}
        statusOptions={['All', 'Active', 'Closed']}
        sort={sort}
        setSort={setSort}
        sortOptions={[
          { label: 'Recently Added', value: 'newest' },
          { label: 'Deadline (Soonest)', value: 'deadline_soon' },
          { label: 'Oldest', value: 'oldest' },
        ]}
        selectedTag={selectedSkill}
        setSelectedTag={setSelectedSkill}
        availableTags={INTERNSHIP_SKILLS}
        onReset={handleResetFilters}
      />

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{internships.length}</strong> of{' '}
          <strong className="text-white">{totalCount}</strong> opportunities
        </span>
      </div>

      {/* Grid of Internship Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="card-base rounded-2xl h-72 animate-pulse p-6"
            />
          ))}
        </div>
      ) : internships.length === 0 ? (
        <div className="card-base rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Internships Found</h3>
          <p className="text-xs text-slate-400">
            No roles matched your current filter criteria. Try clearing search filters to see all available roles.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => {
            const saved = isBookmarked('internship', internship._id);

            return (
              <div
                key={internship._id}
                className="card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Company Info & Bookmark */}
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
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-blue-400 font-medium">
                            {internship.location}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400">
                            {internship.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark('internship', internship)}
                      className="p-2 rounded-lg bg-navy-950 text-slate-400 hover:text-amber-400 transition-colors border border-navy-800"
                      title={saved ? 'Remove Bookmark' : 'Save Bookmark'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-slate-100 mb-2 line-clamp-1">
                    {internship.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {internship.description}
                  </p>

                  {/* Key Specs Pill Row */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-4 p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <div className="flex items-center gap-1.5 truncate">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-emerald-400 truncate">
                        {internship.stipend}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{internship.duration}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {internship.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium badge-slate"
                      >
                        {skill}
                      </span>
                    ))}
                    {internship.skills?.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-semibold">
                        +{internship.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-2 border-t border-navy-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Due: {formatDate(internship.applicationDeadline)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedInternship(internship)}
                      className="px-3 py-1.5 rounded-lg font-semibold text-xs text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 transition-all"
                    >
                      Requirements
                    </button>
                    <a
                      href={internship.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-colors"
                      title="Apply on Official Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedInternship && (
        <OpportunityModal
          item={selectedInternship}
          type="internship"
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
};

export default InternshipsPage;
