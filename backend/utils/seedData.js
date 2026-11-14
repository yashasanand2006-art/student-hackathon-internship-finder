const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const Bookmark = require('../models/Bookmark');
const { initialHackathons, initialInternships } = require('./initialData');

dotenv.config();

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/opportunity_nexus';
  try {
    console.log(`Connecting to ${uri}...`);
    await mongoose.connect(uri);
    console.log('MongoDB connected for seeding.');

    // Clear existing collections
    await User.deleteMany({});
    await Hackathon.deleteMany({});
    await Internship.deleteMany({});
    await Bookmark.deleteMany({});
    console.log('Cleared existing records.');

    // Create demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Sarah Connor (Admin)',
      email: 'admin@nexus.edu',
      password: hashedPassword,
      role: 'admin',
      university: 'MIT',
      major: 'Systems Engineering',
      gradYear: '2024',
      skills: ['Architecture', 'Kubernetes', 'Security', 'Go'],
      bio: 'Platform administrator overseeing hackathon listings and verified campus recruiters.',
    });

    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@nexus.edu',
      password: hashedPassword,
      role: 'student',
      university: 'Stanford University',
      major: 'Computer Science',
      gradYear: '2027',
      skills: ['React', 'Node.js', 'Python', 'Tailwind CSS', 'TypeScript'],
      bio: 'Junior CS student passionate about building scalable web applications and exploring AI.',
    });

    console.log('Seeded Users: student@nexus.edu & admin@nexus.edu (password: password123)');

    // Seed hackathons
    const hackathonsWithAdmin = initialHackathons.map((h) => ({
      ...h,
      createdBy: adminUser._id,
    }));
    const createdHackathons = await Hackathon.insertMany(hackathonsWithAdmin);
    console.log(`Seeded ${createdHackathons.length} hackathons.`);

    // Seed internships
    const internshipsWithAdmin = initialInternships.map((i) => ({
      ...i,
      createdBy: adminUser._id,
    }));
    const createdInternships = await Internship.insertMany(internshipsWithAdmin);
    console.log(`Seeded ${createdInternships.length} internships.`);

    // Seed sample bookmark for student
    await Bookmark.create({
      user: studentUser._id,
      itemType: 'hackathon',
      hackathon: createdHackathons[0]._id,
    });

    await Bookmark.create({
      user: studentUser._id,
      itemType: 'internship',
      internship: createdInternships[0]._id,
    });

    console.log('Seeded sample student bookmarks.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}
