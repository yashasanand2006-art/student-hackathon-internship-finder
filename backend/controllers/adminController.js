const { isMongoConnected, User, Hackathon, Internship, Bookmark, memoryDB, initMemoryStore, generateId } = require('../utils/store');
const { initialHackathons, initialInternships } = require('../utils/initialData');
const { getDBStatus } = require('../config/db');

// @desc    Get system statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
exports.getAdminStats = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (isMongoConnected()) {
      const [
        totalUsers,
        totalStudents,
        totalAdmins,
        totalHackathons,
        openHackathons,
        totalInternships,
        activeInternships,
        totalBookmarks,
        hackathonsAgg,
        recentUsers,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'admin' }),
        Hackathon.countDocuments(),
        Hackathon.countDocuments({ status: 'Open' }),
        Internship.countDocuments(),
        Internship.countDocuments({ status: 'Active' }),
        Bookmark.countDocuments(),
        Hackathon.aggregate([
          { $group: { _id: null, totalPrizes: { $sum: '$prizePool' } } },
        ]),
        User.find().select('-password').sort({ createdAt: -1 }).limit(5),
      ]);

      const totalPrizePool = hackathonsAgg.length > 0 ? hackathonsAgg[0].totalPrizes : 0;

      return res.status(200).json({
        success: true,
        data: {
          database: {
            connected: true,
            mode: dbStatus.mode,
          },
          users: {
            total: totalUsers,
            students: totalStudents,
            admins: totalAdmins,
          },
          hackathons: {
            total: totalHackathons,
            open: openHackathons,
            totalPrizePool,
          },
          internships: {
            total: totalInternships,
            active: activeInternships,
          },
          bookmarks: {
            total: totalBookmarks,
          },
          recentUsers,
        },
      });
    } else {
      // In-Memory store stats
      const totalUsers = memoryDB.users.length;
      const totalStudents = memoryDB.users.filter((u) => u.role === 'student').length;
      const totalAdmins = memoryDB.users.filter((u) => u.role === 'admin').length;
      const totalHackathons = memoryDB.hackathons.length;
      const openHackathons = memoryDB.hackathons.filter((h) => h.status === 'Open').length;
      const totalPrizePool = memoryDB.hackathons.reduce((acc, h) => acc + (Number(h.prizePool) || 0), 0);
      const totalInternships = memoryDB.internships.length;
      const activeInternships = memoryDB.internships.filter((i) => i.status === 'Active').length;
      const totalBookmarks = memoryDB.bookmarks.length;
      const recentUsers = memoryDB.users
        .slice(-5)
        .reverse()
        .map(({ password, ...u }) => u);

      return res.status(200).json({
        success: true,
        data: {
          database: {
            connected: false,
            mode: dbStatus.mode,
          },
          users: {
            total: totalUsers,
            students: totalStudents,
            admins: totalAdmins,
          },
          hackathons: {
            total: totalHackathons,
            open: openHackathons,
            totalPrizePool,
          },
          internships: {
            total: totalInternships,
            active: activeInternships,
          },
          bookmarks: {
            total: totalBookmarks,
          },
          recentUsers,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Seed initial hackathons & internships
// @route   POST /api/admin/seed
// @access  Private (Admin Only)
exports.seedDatabase = async (req, res, next) => {
  try {
    if (isMongoConnected()) {
      await Hackathon.deleteMany({});
      await Internship.deleteMany({});

      const hackathonsWithUser = initialHackathons.map((h) => ({
        ...h,
        createdBy: req.user._id,
      }));

      const internshipsWithUser = initialInternships.map((i) => ({
        ...i,
        createdBy: req.user._id,
      }));

      const insertedHackathons = await Hackathon.insertMany(hackathonsWithUser);
      const insertedInternships = await Internship.insertMany(internshipsWithUser);

      return res.status(200).json({
        success: true,
        message: `Database seeded successfully: ${insertedHackathons.length} hackathons & ${insertedInternships.length} internships inserted.`,
      });
    } else {
      memoryDB.hackathons = [];
      memoryDB.internships = [];

      initialHackathons.forEach((h) => {
        memoryDB.hackathons.push({
          _id: generateId(),
          ...h,
          createdBy: req.user._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      initialInternships.forEach((i) => {
        memoryDB.internships.push({
          _id: generateId(),
          ...i,
          createdBy: req.user._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      return res.status(200).json({
        success: true,
        message: `In-Memory Store seeded successfully: ${memoryDB.hackathons.length} hackathons & ${memoryDB.internships.length} internships ready.`,
      });
    }
  } catch (error) {
    next(error);
  }
};
