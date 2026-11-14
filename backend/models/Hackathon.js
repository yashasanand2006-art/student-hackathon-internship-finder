const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Hackathon title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    mode: {
      type: String,
      enum: ['Online', 'In-Person', 'Hybrid'],
      default: 'Online',
    },
    location: {
      type: String,
      trim: true,
      default: 'Online / Global',
    },
    prizePool: {
      type: Number,
      default: 0,
      min: [0, 'Prize pool cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    maxTeamSize: {
      type: Number,
      default: 4,
      min: [1, 'Team size must be at least 1'],
    },
    websiteUrl: {
      type: String,
      required: [true, 'Registration or website URL is required'],
      trim: true,
    },
    bannerUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'Upcoming', 'Closed'],
      default: 'Open',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

hackathonSchema.index({ title: 'text', description: 'text', tags: 'text', organizer: 'text' });

module.exports = mongoose.model('Hackathon', hackathonSchema);
