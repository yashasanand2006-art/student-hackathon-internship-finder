import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Trophy,
  Briefcase,
  Users,
  Bookmark,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import AdminHackathonModal from '../components/AdminHackathonModal';
import AdminInternshipModal from '../components/AdminInternshipModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('hackathons'); // 'hackathons' | 'internships' | 'database'
  const [loading, setLoading] = useState(true);

  // Lists
  const [hackathons, setHackathons] = useState([]);
  const [internships, setInternships] = useState([]);
  const [hackSearch, setHackSearch] = useState('');
  const [internSearch, setInternSearch] = useState('');

  // Modals
  const [hackModalOpen, setHackModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  const [internModalOpen, setInternModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Status feedback
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [seeding, setSeeding] = useState(false);

  const showFeedback = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, hackRes, internRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/hackathons?limit=50'),
        api.get('/internships?limit=50'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (hackRes.data.success) setHackathons(hackRes.data.data || []);
      if (internRes.data.success) setInternships(internRes.data.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showFeedback('Failed to load admin statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Hackathon CRUD operations
  const handleCreateHackathon = () => {
    setSelectedHackathon(null);
    setHackModalOpen(true);
  };

  const handleEditHackathon = (h) => {
    setSelectedHackathon(h);
    setHackModalOpen(true);
  };

  const handleDeleteHackathon = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove hackathon "${title}"?`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/hackathons/${id}`);
      if (data.success) {
        setHackathons((prev) => prev.filter((h) => h._id !== id));
        showFeedback(`Hackathon "${title}" has been deleted.`);
        // refresh stats
        api.get('/admin/stats').then((res) => {
          if (res.data.success) setStats(res.data.data);
        });
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to delete hackathon.', 'error');
    }
  };

  // Internship CRUD operations
  const handleCreateInternship = () => {
    setSelectedInternship(null);
    setInternModalOpen(true);
  };

  const handleEditInternship = (i) => {
    setSelectedInternship(i);
    setInternModalOpen(true);
  };

  const handleDeleteInternship = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove internship "${title}"?`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/internships/${id}`);
      if (data.success) {
        setInternships((prev) => prev.filter((i) => i._id !== id));
        showFeedback(`Internship "${title}" has been deleted.`);
        // refresh stats
        api.get('/admin/stats').then((res) => {
          if (res.data.success) setStats(res.data.data);
        });
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to delete internship.', 'error');
    }
  };

  // Seeder
  const handleRunSeeder = async () => {
    if (!window.confirm('This will repopulate initial hackathons and internships. Proceed?')) {
      return;
    }

    setSeeding(true);
    try {
      const { data } = await api.post('/admin/seed');
      if (data.success) {
        showFeedback(data.message);
        fetchDashboardData();
      }
    } catch (err) {
      showFeedback('Seeding failed.', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const filteredHackathons = hackathons.filter(
    (h) =>
      h.title.toLowerCase().includes(hackSearch.toLowerCase()) ||
      h.organizer.toLowerCase().includes(hackSearch.toLowerCase())
  );

  const filteredInternships = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(internSearch.toLowerCase()) ||
      i.company.toLowerCase().includes(internSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            DevNexus Management Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish listings, update opportunities, monitor metrics, and manage verified events.
          </p>
        </div>

        {/* Database Status indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Database className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300 font-semibold">
            Engine: {stats?.database?.mode || 'Active'}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {feedback.text && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs animate-in fade-in ${
            feedback.type === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">
            Total Students
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">
              {stats?.users?.students ?? 0}
            </span>
            <Users className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {stats?.users?.total ?? 0} total registered users
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">
            Hackathons
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">
              {stats?.hackathons?.total ?? 0}
            </span>
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">
            {stats?.hackathons?.open ?? 0} currently open
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">
            Internships
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white">
              {stats?.internships?.total ?? 0}
            </span>
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">
            {stats?.internships?.active ?? 0} active openings
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <span className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">
            Prize Sum Pool
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-400">
              ${((stats?.hackathons?.totalPrizePool || 0) / 1000).toFixed(0)}K
            </span>
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Across collegiate events
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hackathons'
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Manage Hackathons ({hackathons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'internships'
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manage Internships ({internships.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'database'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Tools</span>
          </button>
        </div>

        {activeTab === 'hackathons' && (
          <button
            onClick={handleCreateHackathon}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-glow-purple transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hackathon</span>
          </button>
        )}

        {activeTab === 'internships' && (
          <button
            onClick={handleCreateInternship}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Internship</span>
          </button>
        )}
      </div>

      {/* Tab 1: Hackathons Table */}
      {activeTab === 'hackathons' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={hackSearch}
              onChange={(e) => setHackSearch(e.target.value)}
              placeholder="Search hackathons by title or organizer..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Title & Organizer</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Prize Pool</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredHackathons.map((h) => (
                    <tr key={h._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{h.title}</div>
                        <div className="text-slate-400 text-[11px]">{h.organizer}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {h.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        ${h.prizePool ? h.prizePool.toLocaleString() : 0}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(h.registrationDeadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.status === 'Open'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditHackathon(h)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Edit Hackathon"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHackathon(h._id, h.title)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400"
                            title="Delete Hackathon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Internships Table */}
      {activeTab === 'internships' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={internSearch}
              onChange={(e) => setInternSearch(e.target.value)}
              placeholder="Search internships by role or company..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Role & Company</th>
                    <th className="py-3 px-4">Arrangement</th>
                    <th className="py-3 px-4">Stipend</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredInternships.map((i) => (
                    <tr key={i._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{i.title}</div>
                        <div className="text-slate-400 text-[11px]">{i.company}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {i.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {i.stipend}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(i.applicationDeadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            i.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditInternship(i)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Edit Internship"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInternship(i._id, i.title)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400"
                            title="Delete Internship"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Database Tools & Maintenance */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Platform Seeder & Mock Data Controls</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Quickly reset or replenish the sample collegiate hackathons and tech internship listings in your current database or in-memory store.
            </p>
            <button
              onClick={handleRunSeeder}
              disabled={seeding}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Seeding Database...' : 'Repopulate Initial Platform Data'}</span>
            </button>
          </div>

          {/* Recent Users List */}
          {stats?.recentUsers && stats.recentUsers.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Recent User Registrations
              </h2>
              <div className="divide-y divide-slate-800/80 text-xs">
                {stats.recentUsers.map((u) => (
                  <div key={u._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-slate-500 text-[11px]">{u.email}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 capitalize">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AdminHackathonModal
        hackathon={selectedHackathon}
        isOpen={hackModalOpen}
        onClose={() => setHackModalOpen(false)}
        onSuccess={(saved, msg) => {
          showFeedback(msg);
          fetchDashboardData();
        }}
      />

      <AdminInternshipModal
        internship={selectedInternship}
        isOpen={internModalOpen}
        onClose={() => setInternModalOpen(false)}
        onSuccess={(saved, msg) => {
          showFeedback(msg);
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
