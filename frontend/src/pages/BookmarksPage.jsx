import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Trophy,
  Briefcase,
  Trash2,
  Calendar,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import OpportunityModal from '../components/OpportunityModal';

const BookmarksPage = () => {
  const { bookmarks, loading, deleteBookmark, refreshBookmarks } = useBookmarks();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hackathon', 'internship'
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('hackathon');

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  const filteredBookmarks = bookmarks.filter((b) => {
    if (activeTab === 'all') return true;
    return b.itemType === activeTab;
  });

  const hackathonCount = bookmarks.filter((b) => b.itemType === 'hackathon').length;
  const internshipCount = bookmarks.filter((b) => b.itemType === 'internship').length;

  const handleOpenModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
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
          <Bookmark className="w-3.5 h-3.5 fill-blue-400" />
          <span>Saved Opportunities</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Application Radar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Track upcoming registration deadlines, manage team notes, and revisit your saved hackathons and software internships.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-navy-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-navy-900'
          }`}
        >
          <span>All Saved</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-navy-950">
            {bookmarks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hackathon')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'hackathon'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-navy-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-blue-400" />
          <span>Hackathons</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-navy-950">
            {hackathonCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('internship')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'internship'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-navy-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>Internships</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-navy-950">
            {internshipCount}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card-base h-64 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="card-base rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Saved Opportunities</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the bookmark icon on any hackathon or internship to pin it to your radar.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/hackathons"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Browse Hackathons
            </Link>
            <Link
              to="/internships"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-900 border border-navy-800 transition-colors"
            >
              Browse Internships
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => {
            const isHack = bookmark.itemType === 'hackathon';
            const item = isHack ? bookmark.hackathon : bookmark.internship;

            if (!item) return null;

            return (
              <div
                key={bookmark._id}
                className="card-interactive p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider badge-blue">
                      {isHack ? 'Hackathon' : 'Internship'}
                    </span>

                    <button
                      onClick={() => deleteBookmark(bookmark._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-blue-400 mb-1">
                    {isHack ? item.organizer : item.company}
                  </p>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {isHack ? item.tagline || item.description : item.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[11px] mb-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">
                        {isHack ? 'Prize Pool' : 'Compensation'}
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {isHack
                          ? item.prizePool
                            ? `$${item.prizePool.toLocaleString()}`
                            : 'Free Entry'
                          : item.stipend}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Deadline</span>
                      <span className="text-slate-200 font-semibold">
                        {formatDate(
                          isHack ? item.registrationDeadline : item.applicationDeadline
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-navy-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenModal(item, bookmark.itemType)}
                    className="px-3 py-1.5 rounded-lg font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 transition-colors"
                  >
                    View Details
                  </button>

                  <a
                    href={isHack ? item.websiteUrl : item.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm"
                  >
                    <span>{isHack ? 'Register' : 'Apply'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

export default BookmarksPage;
