const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['hackathon', 'internship'],
      required: true,
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      default: null,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate bookmarks per user
bookmarkSchema.index(
  { user: 1, itemType: 1, hackathon: 1, internship: 1 },
  { unique: true }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
