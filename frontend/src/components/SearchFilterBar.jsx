import React from 'react';
import { Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';

const SearchFilterBar = ({
  search,
  setSearch,
  primaryFilter,
  setPrimaryFilter,
  primaryOptions = [],
  primaryLabel = 'Format',
  statusFilter,
  setStatusFilter,
  statusOptions = ['All', 'Open', 'Upcoming', 'Closed'],
  sort,
  setSort,
  sortOptions = [
    { label: 'Recently Added', value: 'newest' },
    { label: 'Deadline (Soonest)', value: 'deadline_soon' },
    { label: 'Highest Prize Pool', value: 'prize_high' },
  ],
  selectedTag,
  setSelectedTag,
  availableTags = [],
  onReset,
}) => {
  const hasActiveFilters =
    search ||
    (primaryFilter && primaryFilter !== 'All') ||
    (statusFilter && statusFilter !== 'All') ||
    (sort && sort !== 'newest') ||
    (selectedTag && selectedTag !== 'All');

  return (
    <div className="w-full space-y-3.5 mb-8">
      {/* Top Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 p-3 rounded-2xl bg-navy-900 border border-navy-800 shadow-sm">
        {/* Search Input */}
        <div className="relative lg:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keywords, company, track, or location..."
            className="w-full pl-10 pr-9 py-2.5 bg-navy-950 border border-navy-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Filter */}
        {primaryOptions.length > 0 && (
          <div className="lg:col-span-2">
            <select
              value={primaryFilter}
              onChange={(e) => setPrimaryFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-navy-950 border border-navy-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="All">All {primaryLabel}s</option>
              {primaryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 bg-navy-950 border border-navy-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="lg:col-span-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full py-2.5 px-3 bg-navy-950 border border-navy-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            {sortOptions.map((so) => (
              <option key={so.value} value={so.value}>
                {so.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="lg:col-span-1 flex items-center justify-end">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`w-full h-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
              hasActiveFilters
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20 cursor-pointer'
                : 'bg-navy-950/60 text-slate-600 border-navy-800/80 cursor-not-allowed opacity-50'
            }`}
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline lg:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Tag Filter Pills */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            Tracks:
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
              selectedTag === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
            }`}
          >
            All Tracks
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'All' : tag)}
              className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
