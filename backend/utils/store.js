const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');
const Internship = require('../models/Internship');
const Bookmark = require('../models/Bookmark');
const { initialHackathons, initialInternships } = require('./initialData');

// In-Memory collections fallback for zero-friction setup
const memoryDB = {
  users: [],
  hackathons: [],
  internships: [],
  bookmarks: [],
  initialized: false,
};

// Generate an ObjectId-like string
const generateId = () => new mongoose.Types.ObjectId().toString();

// Initialize in-memory seed records if MongoDB is not present
const initMemoryStore = async () => {
  if (memoryDB.initialized) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Default Student & Admin accounts
  const demoStudent = {
    _id: generateId(),
    name: 'Alex Rivera',
    email: 'student@nexus.edu',
    password: hashedPassword,
    role: 'student',
    university: 'Stanford University',
    major: 'Computer Science',
    gradYear: '2027',
    skills: ['React', 'Node.js', 'Python', 'Tailwind CSS', 'TypeScript'],
    bio: 'Junior CS student passionate about building scalable web applications, participating in hackathons, and exploring generative AI.',
    githubUrl: 'https://github.com/alexrivera-dev',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-cs',
    portfolioUrl: 'https://alexrivera.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const demoAdmin = {
    _id: generateId(),
    name: 'Sarah Connor (Admin)',
    email: 'admin@nexus.edu',
    password: hashedPassword,
    role: 'admin',
    university: 'MIT',
    major: 'Systems Architecture',
    gradYear: '2024',
    skills: ['Architecture', 'Kubernetes', 'Security', 'Go'],
    bio: 'Platform administrator overseeing hackathon listings and verified campus recruiters.',
    githubUrl: 'https://github.com/admin-nexus',
    linkedinUrl: 'https://linkedin.com/in/admin-nexus',
    portfolioUrl: 'https://nexus.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryDB.users.push(demoStudent, demoAdmin);

  // Populate hackathons
  initialHackathons.forEach((h) => {
    memoryDB.hackathons.push({
      _id: generateId(),
      ...h,
      createdBy: demoAdmin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Populate internships
  initialInternships.forEach((i) => {
    memoryDB.internships.push({
      _id: generateId(),
      ...i,
      createdBy: demoAdmin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Pre-seed 1 bookmark for student
  memoryDB.bookmarks.push({
    _id: generateId(),
    user: demoStudent._id,
    itemType: 'hackathon',
    hackathon: memoryDB.hackathons[0]._id,
    internship: null,
    createdAt: new Date(),
  });

  memoryDB.bookmarks.push({
    _id: generateId(),
    user: demoStudent._id,
    itemType: 'internship',
    hackathon: null,
    internship: memoryDB.internships[0]._id,
    createdAt: new Date(),
  });

  memoryDB.initialized = true;
};

// Check if real MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  isMongoConnected,
  initMemoryStore,
  memoryDB,
  generateId,
  User,
  Hackathon,
  Internship,
  Bookmark,
};
