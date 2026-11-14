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
  Building2,
  Clock,
  Sparkles,
  Check,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-navy-900 border border-navy-800 rounded-2xl shadow-elevated p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white hover:bg-navy-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          {isHackathon ? (
            item.bannerUrl ? (
              <img
                src={item.bannerUrl}
                alt={item.title}
                className="w-full sm:w-32 h-24 rounded-xl object-cover border border-navy-800"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Trophy className="w-6 h-6" />
              </div>
            )
          ) : item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.company}
              className="w-14 h-14 rounded-xl object-cover border border-navy-800 bg-navy-950 p-1"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider badge-blue">
                {isHackathon ? item.mode : item.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium badge-emerald">
                {item.status || 'Active'}
              </span>
              {item.featured && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium badge-amber">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {item.title}
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              {isHackathon ? `Hosted by ${item.organizer}` : `${item.company}`}
            </p>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-navy-950 border border-navy-800 mb-6 text-xs">
          {isHackathon ? (
            <>
              <div>
                <span className="text-slate-400 block text-[11px]">Prize Pool</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {item.prizePool ? `$${item.prizePool.toLocaleString()}` : 'Free Entry'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Registration Deadline</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {formatDate(item.registrationDeadline)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Team Limit</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Up to {item.maxTeamSize || 4}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Format / Location</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {item.location || 'Global Virtual'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-slate-400 block text-[11px]">Compensation</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {item.stipend}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Duration</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {item.duration || 'Summer 2027'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Deadline</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {formatDate(item.applicationDeadline)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {item.location}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Description Section */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            About This Opportunity
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Requirements if Internship */}
        {!isHackathon && item.requirements && item.requirements.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {isHackathon ? 'Tracks & Focus Technologies' : 'Required Technical Skills'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isHackathon ? item.tags : item.skills).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium badge-slate"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-navy-800">
          <a
            href={isHackathon ? item.websiteUrl : item.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-sm"
          >
            <span>{isHackathon ? 'Register on Official Site' : 'Apply on Company Site'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                saved
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-navy-800 text-slate-300 border-navy-700 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-400' : ''}`} />
              <span>{saved ? 'Saved' : 'Save to Radar'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-navy-800 text-slate-300 border border-navy-700 hover:text-white hover:bg-navy-700 transition-colors"
              title="Copy Link"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;
