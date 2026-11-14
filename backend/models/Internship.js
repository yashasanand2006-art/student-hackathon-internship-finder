const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Onsite', 'Hybrid'],
      default: 'Remote',
    },
    stipend: {
      type: String,
      required: [true, 'Stipend / compensation details are required'],
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
      default: '3 Months',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    applyUrl: {
      type: String,
      required: [true, 'Application link is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
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

internshipSchema.index({ title: 'text', company: 'text', skills: 'text', description: 'text' });

module.exports = mongoose.model('Internship', internshipSchema);
