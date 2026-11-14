const { isMongoConnected, Bookmark, Hackathon, Internship, memoryDB, generateId } = require('../utils/store');

// @desc    Get all bookmarks for current user
// @route   GET /api/bookmarks
// @access  Private
exports.getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isMongoConnected()) {
      const bookmarks = await Bookmark.find({ user: userId })
        .populate('hackathon')
        .populate('internship')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: bookmarks.length,
        data: bookmarks,
      });
    } else {
      const userBookmarks = memoryDB.bookmarks.filter(
        (b) => b.user.toString() === userId.toString()
      );

      // Populate hackathon or internship objects
      const populated = userBookmarks.map((b) => {
        let hackathonObj = null;
        let internshipObj = null;

        if (b.itemType === 'hackathon' && b.hackathon) {
          hackathonObj =
            memoryDB.hackathons.find(
              (h) => h._id.toString() === b.hackathon.toString()
            ) || null;
        } else if (b.itemType === 'internship' && b.internship) {
          internshipObj =
            memoryDB.internships.find(
              (i) => i._id.toString() === b.internship.toString()
            ) || null;
        }

        return {
          ...b,
          hackathon: hackathonObj,
          internship: internshipObj,
        };
      });

      return res.status(200).json({
        success: true,
        count: populated.length,
        data: populated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarked IDs for fast UI sync
// @route   GET /api/bookmarks/ids
// @access  Private
exports.getUserBookmarkIds = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isMongoConnected()) {
      const bookmarks = await Bookmark.find({ user: userId }).select('itemType hackathon internship');

      const hackathons = bookmarks
        .filter((b) => b.itemType === 'hackathon' && b.hackathon)
        .map((b) => b.hackathon.toString());

      const internships = bookmarks
        .filter((b) => b.itemType === 'internship' && b.internship)
        .map((b) => b.internship.toString());

      return res.status(200).json({
        success: true,
        data: { hackathons, internships },
      });
    } else {
      const userBookmarks = memoryDB.bookmarks.filter(
        (b) => b.user.toString() === userId.toString()
      );

      const hackathons = userBookmarks
        .filter((b) => b.itemType === 'hackathon' && b.hackathon)
        .map((b) => b.hackathon.toString());

      const internships = userBookmarks
        .filter((b) => b.itemType === 'internship' && b.internship)
        .map((b) => b.internship.toString());

      return res.status(200).json({
        success: true,
        data: { hackathons, internships },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark for hackathon or internship
// @route   POST /api/bookmarks/toggle
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemType, itemId } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both itemType (hackathon/internship) and itemId.',
      });
    }

    if (!['hackathon', 'internship'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid itemType. Must be either "hackathon" or "internship".',
      });
    }

    if (isMongoConnected()) {
      const query = {
        user: userId,
        itemType,
        [itemType]: itemId,
      };

      const existing = await Bookmark.findOne(query);

      if (existing) {
        await existing.deleteOne();
        return res.status(200).json({
          success: true,
          bookmarked: false,
          message: 'Bookmark removed.',
          itemId,
        });
      } else {
        const newBookmark = await Bookmark.create({
          user: userId,
          itemType,
          hackathon: itemType === 'hackathon' ? itemId : null,
          internship: itemType === 'internship' ? itemId : null,
        });

        return res.status(201).json({
          success: true,
          bookmarked: true,
          message: 'Saved to bookmarks!',
          bookmark: newBookmark,
          itemId,
        });
      }
    } else {
      const existingIndex = memoryDB.bookmarks.findIndex(
        (b) =>
          b.user.toString() === userId.toString() &&
          b.itemType === itemType &&
          b[itemType] &&
          b[itemType].toString() === itemId.toString()
      );

      if (existingIndex !== -1) {
        memoryDB.bookmarks.splice(existingIndex, 1);
        return res.status(200).json({
          success: true,
          bookmarked: false,
          message: 'Bookmark removed.',
          itemId,
        });
      } else {
        const newBookmark = {
          _id: generateId(),
          user: userId,
          itemType,
          hackathon: itemType === 'hackathon' ? itemId : null,
          internship: itemType === 'internship' ? itemId : null,
          createdAt: new Date(),
        };

        memoryDB.bookmarks.push(newBookmark);

        return res.status(201).json({
          success: true,
          bookmarked: true,
          message: 'Saved to bookmarks!',
          bookmark: newBookmark,
          itemId,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single bookmark by ID
// @route   DELETE /api/bookmarks/:id
// @access  Private
exports.deleteBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (isMongoConnected()) {
      const bookmark = await Bookmark.findOne({ _id: id, user: userId });
      if (!bookmark) {
        return res.status(404).json({ success: false, message: 'Bookmark not found' });
      }

      await bookmark.deleteOne();
      return res.status(200).json({ success: true, message: 'Bookmark deleted' });
    } else {
      const index = memoryDB.bookmarks.findIndex(
        (b) => b._id.toString() === id.toString() && b.user.toString() === userId.toString()
      );

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Bookmark not found' });
      }

      memoryDB.bookmarks.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Bookmark deleted' });
    }
  } catch (error) {
    next(error);
  }
};
