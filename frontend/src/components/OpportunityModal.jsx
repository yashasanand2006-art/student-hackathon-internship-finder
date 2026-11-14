import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Trophy,
  DollarSign,
  ExternalLink,
  Bookmark,
  Share2,
  Users,
  CheckCircle2,
  Building,
  Clock,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';

const OpportunityModal = ({ item, type, onClose }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  if (!item) return null;

  const isHackathon = type === 'hackathon';
  const saved = isBookmarked(type, item._id);

  const handleBookmark = async () => {
    setBookmarkLoading(true);
    await toggleBookmark(type, item);
    setBookmarkLoading(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
          {isHackathon ? (
            item.bannerUrl ? (
              <img
                src={item.bannerUrl}
                alt={item.title}
                className="w-full sm:w-36 h-28 rounded-xl object-cover border border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Trophy className="w-8 h-8" />
              </div>
            )
          ) : item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.company}
              className="w-16 h-16 rounded-xl object-cover border border-slate-700 p-1 bg-slate-800"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building className="w-8 h-8" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isHackathon
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {isHackathon ? item.mode : item.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.status || 'Active'}
              </span>
              {item.featured && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {item.title}
            </h2>
            <p className="text-sm font-medium text-slate-400 mt-1">
              {isHackathon ? `Organized by ${item.organizer}` : `${item.company}`}
            </p>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 mb-6 text-xs">
          {isHackathon ? (
            <>
              <div>
                <span className="text-slate-500 block">Prize Pool</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {item.prizePool ? `$${item.prizePool.toLocaleString()}` : 'Bragging Rights'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Registration Deadline</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {formatDate(item.registrationDeadline)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Team Limit</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Up to {item.maxTeamSize || 4} members
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {item.location || 'Global Virtual'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-slate-500 block">Stipend / Comp</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {item.stipend}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {item.duration || 'Flexible'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Application Deadline</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {formatDate(item.applicationDeadline)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {item.location}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Description Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            About This Opportunity
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Requirements if Internship */}
        {!isHackathon && item.requirements && item.requirements.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Candidate Requirements
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {item.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags / Skills */}
        {((isHackathon && item.tags?.length > 0) || (!isHackathon && item.skills?.length > 0)) && (
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              {isHackathon ? 'Tracks & Technologies' : 'Required Skills'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isHackathon ? item.tags : item.skills).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
          <a
            href={isHackathon ? item.websiteUrl : item.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 active:scale-95 shadow-glow-purple transition-all"
          >
            <span>{isHackathon ? 'Register on Official Site' : 'Apply for Internship'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                saved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
              <span>{saved ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
              title="Share Link"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;
