import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Plus,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    university: '',
    major: '',
    gradYear: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    avatar: '',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        university: user.university || '',
        major: user.major || '',
        gradYear: user.gradYear || '',
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        avatar: user.avatar || '',
      });
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    const clean = skillInput.trim();
    if (!skills.includes(clean)) {
      setSkills([...skills, clean]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateProfile({
        ...formData,
        skills,
      });

      if (res.success) {
        setSuccessMsg('Your profile has been successfully saved!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
          <User className="w-4 h-4" />
          <span>Student Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Developer Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep your academic profile, developer links, and technical skillset up to date.
        </p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mb-6 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-6 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Profile Avatar
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={
                formData.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  formData.name || 'User'
                )}&background=7C3AED&color=fff&bold=true`
              }
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-500/30 shadow-glow-purple"
            />
            <div className="flex-1 w-full space-y-3">
              <span className="text-xs text-slate-400 block font-medium">
                Choose a preset avatar or paste an image link:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: preset })}
                    className={`relative rounded-xl overflow-hidden w-10 h-10 border-2 transition-transform hover:scale-105 ${
                      formData.avatar === preset
                        ? 'border-purple-500 ring-2 ring-purple-500/40'
                        : 'border-slate-700'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="Or paste custom image URL..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Academic & Identity */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Academic & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                University / College
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="e.g. Stanford University"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="e.g. Computer Science"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                placeholder="e.g. 2027"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">
              Short Bio / Elevator Pitch
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell hackathon organizers and internship recruiters about what you love building..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Skills Tag Manager */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Technical Skills & Technologies
          </h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSkill(e);
              }}
              placeholder="Type a skill (e.g. React, PyTorch, Docker) and press Add..."
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social / Developer Links */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Developer Links & Portfolio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <Github className="w-3.5 h-3.5 text-purple-400" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portfolio / Resume URL</span>
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourname.dev"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 shadow-glow-purple active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
