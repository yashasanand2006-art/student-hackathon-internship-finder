import React, { useState, useEffect } from 'react';
import { X, Briefcase, Save, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AdminInternshipModal = ({ internship, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    logoUrl: '',
    location: 'Remote',
    type: 'Remote',
    stipend: '$50/hr',
    duration: 'Summer 2027 (12 weeks)',
    description: '',
    requirements: 'Pursuing BS/MS in Computer Science\nProficiency in modern JavaScript / TypeScript\nPassion for software engineering',
    skills: 'React, TypeScript, Node.js',
    applicationDeadline: '',
    applyUrl: '',
    status: 'Active',
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (internship) {
      setFormData({
        title: internship.title || '',
        company: internship.company || '',
        logoUrl: internship.logoUrl || '',
        location: internship.location || 'Remote',
        type: internship.type || 'Remote',
        stipend: internship.stipend || '',
        duration: internship.duration || '3 Months',
        description: internship.description || '',
        requirements: Array.isArray(internship.requirements)
          ? internship.requirements.join('\n')
          : '',
        skills: Array.isArray(internship.skills) ? internship.skills.join(', ') : '',
        applicationDeadline: internship.applicationDeadline
          ? internship.applicationDeadline.substring(0, 10)
          : '',
        applyUrl: internship.applyUrl || '',
        status: internship.status || 'Active',
        featured: Boolean(internship.featured),
      });
    } else {
      setFormData({
        title: '',
        company: '',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        location: 'Remote',
        type: 'Remote',
        stipend: '$50/hr',
        duration: 'Summer 2027 (12 weeks)',
        description: '',
        requirements: 'Pursuing BS/MS in Computer Science or related degree\nExperience with React and Node.js\nStrong problem solving and team collaboration skills',
        skills: 'React, TypeScript, Node.js',
        applicationDeadline: new Date(Date.now() + 86400000 * 30).toISOString().substring(0, 10),
        applyUrl: '',
        status: 'Active',
        featured: false,
      });
    }
    setError('');
  }, [internship, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (internship && internship._id) {
        // Update
        const { data } = await api.put(`/internships/${internship._id}`, payload);
        if (data.success) {
          onSuccess(data.data, 'Internship updated successfully!');
          onClose();
        }
      } else {
        // Create
        const { data } = await api.post('/internships', payload);
        if (data.success) {
          onSuccess(data.data, 'New internship published!');
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save internship.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {internship ? 'Edit Internship Listing' : 'Post New Tech Internship'}
            </h2>
            <p className="text-xs text-slate-400">
              Admin controls to add or update verified engineering internship positions
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Software Engineering Intern"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Stripe, Vercel, Datadog"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
              >
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
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
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                placeholder="e.g. Seattle, WA or Remote"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Stipend / Comp *
              </label>
              <input
                type="text"
                required
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                placeholder="$55/hr or $9,000/mo"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Job Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="Responsibilities, team mission, and impact of this internship"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Requirements (one bullet per line)
            </label>
            <textarea
              rows={3}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="Currently enrolled in Computer Science&#10;Proficient in TypeScript"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                placeholder="React, TypeScript, Jest"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.applicationDeadline}
                onChange={(e) =>
                  setFormData({ ...formData, applicationDeadline: e.target.value })
                }
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Application Link *
              </label>
              <input
                type="url"
                required
                value={formData.applyUrl}
                onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                placeholder="https://company.com/jobs/..."
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                placeholder="Summer 2027 (12 weeks)"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
              />
              Mark as Featured Opportunity
            </label>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Status:</span>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 shadow-glow-blue"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : internship ? 'Update Internship' : 'Post Internship'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminInternshipModal;
