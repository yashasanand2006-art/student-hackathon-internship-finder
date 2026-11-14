import React, { useState, useEffect } from 'react';
import { X, Trophy, Save, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminHackathonModal = ({ hackathon, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    tagline: '',
    description: '',
    mode: 'Online',
    location: 'Online',
    prizePool: 50000,
    currency: 'USD',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    tags: 'Artificial Intelligence, Machine Learning, Python',
    maxTeamSize: 4,
    websiteUrl: '',
    bannerUrl: '',
    status: 'Open',
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hackathon) {
      setFormData({
        title: hackathon.title || '',
        organizer: hackathon.organizer || '',
        tagline: hackathon.tagline || '',
        description: hackathon.description || '',
        mode: hackathon.mode || 'Online',
        location: hackathon.location || 'Online',
        prizePool: hackathon.prizePool || 0,
        currency: hackathon.currency || 'USD',
        startDate: hackathon.startDate ? hackathon.startDate.substring(0, 10) : '',
        endDate: hackathon.endDate ? hackathon.endDate.substring(0, 10) : '',
        registrationDeadline: hackathon.registrationDeadline
          ? hackathon.registrationDeadline.substring(0, 10)
          : '',
        tags: Array.isArray(hackathon.tags) ? hackathon.tags.join(', ') : '',
        maxTeamSize: hackathon.maxTeamSize || 4,
        websiteUrl: hackathon.websiteUrl || '',
        bannerUrl: hackathon.bannerUrl || '',
        status: hackathon.status || 'Open',
        featured: Boolean(hackathon.featured),
      });
    } else {
      setFormData({
        title: '',
        organizer: '',
        tagline: '',
        description: '',
        mode: 'Online',
        location: 'Online',
        prizePool: 50000,
        currency: 'USD',
        startDate: new Date().toISOString().substring(0, 10),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
        registrationDeadline: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
        tags: 'Artificial Intelligence, Machine Learning, Python',
        maxTeamSize: 4,
        websiteUrl: '',
        bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        status: 'Open',
        featured: false,
      });
    }
    setError('');
  }, [hackathon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        prizePool: Number(formData.prizePool),
        maxTeamSize: Number(formData.maxTeamSize),
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (hackathon && hackathon._id) {
        // Update
        const { data } = await api.put(`/hackathons/${hackathon._id}`, payload);
        if (data.success) {
          onSuccess(data.data, 'Hackathon updated successfully!');
          onClose();
        }
      } else {
        // Create
        const { data } = await api.post('/hackathons', payload);
        if (data.success) {
          onSuccess(data.data, 'New hackathon published!');
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hackathon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-navy-800 rounded-2xl shadow-elevated p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {hackathon ? 'Edit Hackathon Listing' : 'Publish Verified Hackathon'}
            </h2>
            <p className="text-xs text-slate-400">
              Manage dates, prizes, and application requirements
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Hackathon Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Stanford TreeHacks 2027"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Host / Organizer *
              </label>
              <input
                type="text"
                required
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Stanford University & ACM"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="Short descriptive tagline for cards"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="Full hackathon details, track requirements, and mentorship info"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Format</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-200"
              >
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="e.g. Stanford, CA"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Prize Pool ($ USD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.registrationDeadline}
                onChange={(e) =>
                  setFormData({ ...formData, registrationDeadline: e.target.value })
                }
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Website / Devpost Portal *
              </label>
              <input
                type="url"
                required
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tracks (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="Artificial Intelligence, Robotics, Python"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-navy-950 border-navy-800 focus:ring-0"
              />
              Mark as Featured Opportunity
            </label>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Status:</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="p-1.5 bg-navy-950 border border-navy-800 rounded-lg text-slate-200 text-xs"
              >
                <option value="Open">Open</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-navy-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : hackathon ? 'Update Hackathon' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHackathonModal;
