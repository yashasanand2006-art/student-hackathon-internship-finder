const { isMongoConnected, Hackathon, Bookmark, memoryDB, generateId } = require('../utils/store');

// @desc    Get all hackathons with search, filter, sort & pagination
// @route   GET /api/hackathons
// @access  Public
exports.getHackathons = async (req, res, next) => {
  try {
    const {
      search,
      mode,
      status,
      tag,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    if (isMongoConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { organizer: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      if (mode && mode !== 'All') {
        query.mode = mode;
      }

      if (status && status !== 'All') {
        query.status = status;
      }

      if (tag && tag !== 'All') {
        query.tags = { $in: [new RegExp(tag, 'i')] };
      }

      let sortOptions = {};
      if (sort === 'prize_high') {
        sortOptions = { prizePool: -1 };
      } else if (sort === 'deadline_soon') {
        sortOptions = { registrationDeadline: 1 };
      } else if (sort === 'oldest') {
        sortOptions = { createdAt: 1 };
      } else {
        sortOptions = { createdAt: -1 };
      }

      const total = await Hackathon.countDocuments(query);
      const hackathons = await Hackathon.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: hackathons.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        data: hackathons,
      });
    } else {
      // In-Memory store filtering
      let list = [...memoryDB.hackathons];

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (h) =>
            h.title.toLowerCase().includes(s) ||
            h.organizer.toLowerCase().includes(s) ||
            h.description.toLowerCase().includes(s) ||
            (h.tags && h.tags.some((t) => t.toLowerCase().includes(s)))
        );
      }

      if (mode && mode !== 'All') {
        list = list.filter((h) => h.mode.toLowerCase() === mode.toLowerCase());
      }

      if (status && status !== 'All') {
        list = list.filter((h) => h.status.toLowerCase() === status.toLowerCase());
      }

      if (tag && tag !== 'All') {
        list = list.filter(
          (h) => h.tags && h.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }

      // Sorting
      if (sort === 'prize_high') {
        list.sort((a, b) => (b.prizePool || 0) - (a.prizePool || 0));
      } else if (sort === 'deadline_soon') {
        list.sort(
          (a, b) =>
            new Date(a.registrationDeadline).getTime() -
            new Date(b.registrationDeadline).getTime()
        );
      } else if (sort === 'oldest') {
        list.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      const total = list.length;
      const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.status(200).json({
        success: true,
        count: paginated.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        data: paginated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hackathon by ID
// @route   GET /api/hackathons/:id
// @access  Public
exports.getHackathonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const hackathon = await Hackathon.findById(id);
      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }
      return res.status(200).json({ success: true, data: hackathon });
    } else {
      const hackathon = memoryDB.hackathons.find((h) => h._id.toString() === id.toString());
      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }
      return res.status(200).json({ success: true, data: hackathon });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hackathon
// @route   POST /api/hackathons
// @access  Private (Admin Only)
exports.createHackathon = async (req, res, next) => {
  try {
    const {
      title,
      organizer,
      tagline,
      description,
      mode,
      location,
      prizePool,
      currency,
      startDate,
      endDate,
      registrationDeadline,
      tags,
      maxTeamSize,
      websiteUrl,
      bannerUrl,
      status,
      featured,
    } = req.body;

    if (!title || !organizer || !description || !startDate || !endDate || !registrationDeadline || !websiteUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: title, organizer, description, start/end dates, deadline, and website URL.',
      });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    if (isMongoConnected()) {
      const hackathon = await Hackathon.create({
        title: title.trim(),
        organizer: organizer.trim(),
        tagline: tagline ? tagline.trim() : '',
        description: description.trim(),
        mode: mode || 'Online',
        location: location || 'Online',
        prizePool: Number(prizePool) || 0,
        currency: currency || 'USD',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationDeadline: new Date(registrationDeadline),
        tags: parsedTags,
        maxTeamSize: Number(maxTeamSize) || 4,
        websiteUrl: websiteUrl.trim(),
        bannerUrl: bannerUrl || '',
        status: status || 'Open',
        featured: Boolean(featured),
        createdBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: 'Hackathon created successfully!',
        data: hackathon,
      });
    } else {
      const newHackathon = {
        _id: generateId(),
        title: title.trim(),
        organizer: organizer.trim(),
        tagline: tagline ? tagline.trim() : '',
        description: description.trim(),
        mode: mode || 'Online',
        location: location || 'Online',
        prizePool: Number(prizePool) || 0,
        currency: currency || 'USD',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationDeadline: new Date(registrationDeadline),
        tags: parsedTags,
        maxTeamSize: Number(maxTeamSize) || 4,
        websiteUrl: websiteUrl.trim(),
        bannerUrl: bannerUrl || '',
        status: status || 'Open',
        featured: Boolean(featured),
        createdBy: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryDB.hackathons.unshift(newHackathon);

      return res.status(201).json({
        success: true,
        message: 'Hackathon created successfully!',
        data: newHackathon,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private (Admin Only)
exports.updateHackathon = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      let hackathon = await Hackathon.findById(id);
      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }

      hackathon = await Hackathon.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        message: 'Hackathon updated successfully!',
        data: hackathon,
      });
    } else {
      const index = memoryDB.hackathons.findIndex((h) => h._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      const current = memoryDB.hackathons[index];
      const updatedTags = req.body.tags !== undefined
        ? Array.isArray(req.body.tags)
          ? req.body.tags
          : typeof req.body.tags === 'string'
          ? req.body.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : current.tags
        : current.tags;

      const updated = {
        ...current,
        ...req.body,
        tags: updatedTags,
        updatedAt: new Date(),
      };

      memoryDB.hackathons[index] = updated;

      return res.status(200).json({
        success: true,
        message: 'Hackathon updated successfully!',
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private (Admin Only)
exports.deleteHackathon = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const hackathon = await Hackathon.findById(id);
      if (!hackathon) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      await hackathon.deleteOne();
      await Bookmark.deleteMany({ hackathon: id });

      return res.status(200).json({
        success: true,
        message: 'Hackathon removed successfully.',
      });
    } else {
      const index = memoryDB.hackathons.findIndex((h) => h._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Hackathon not found' });
      }

      memoryDB.hackathons.splice(index, 1);
      memoryDB.bookmarks = memoryDB.bookmarks.filter(
        (b) => !(b.itemType === 'hackathon' && b.hackathon && b.hackathon.toString() === id.toString())
      );

      return res.status(200).json({
        success: true,
        message: 'Hackathon removed successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};
