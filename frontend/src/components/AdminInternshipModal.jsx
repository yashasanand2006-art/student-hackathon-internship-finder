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
    stipend: '$55/hr',
    duration: 'Summer 2027 (12 weeks)',
    description: '',
    requirements: 'Currently enrolled in BS/MS in Computer Science or related degree\nExperience with modern TypeScript and React / Node.js\nStrong problem solving and team collaboration skills',
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
        duration: internship.duration || 'Summer 2027 (12 weeks)',
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
        logoUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=200&q=80',
        location: 'Remote',
        type: 'Remote',
        stipend: '$55/hr',
        duration: 'Summer 2027 (12 weeks)',
        description: '',
        requirements: 'Currently enrolled in BS/MS in Computer Science or related technical discipline\nProficiency in modern programming languages (TypeScript, Python, or Go)\nSolid foundation in data structures and API design',
        skills: 'TypeScript, React, Node.js',
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
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {internship ? 'Edit Internship Listing' : 'Post Verified Tech Internship'}
            </h2>
            <p className="text-xs text-slate-400">
              Set role details, requirements, compensation, and application deadlines
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
                Role Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
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
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Stripe, Anthropic, Vercel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Arrangement</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-200"
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
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Compensation / Stipend *
              </label>
              <input
                type="text"
                required
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="$55/hr or $9,500/mo"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Role Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
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
              className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="Enrolled in Computer Science or related degree&#10;Proficiency in TypeScript or Python"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="React, TypeScript, Go"
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
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
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
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
                placeholder="https://company.com/careers/..."
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Duration / Term
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full p-2.5 bg-navy-950 border border-navy-800 rounded-xl text-slate-100"
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
                <option value="Active">Active</option>
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
              <span>{loading ? 'Saving...' : internship ? 'Update Internship' : 'Post Internship'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminInternshipModal;
