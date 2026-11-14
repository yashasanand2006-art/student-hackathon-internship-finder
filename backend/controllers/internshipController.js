const { isMongoConnected, Internship, Bookmark, memoryDB, generateId } = require('../utils/store');

// @desc    Get all internships with filtering, search & pagination
// @route   GET /api/internships
// @access  Public
exports.getInternships = async (req, res, next) => {
  try {
    const {
      search,
      type,
      status,
      skill,
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
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { skills: { $regex: search, $options: 'i' } },
        ];
      }

      if (type && type !== 'All') {
        query.type = type;
      }

      if (status && status !== 'All') {
        query.status = status;
      }

      if (skill && skill !== 'All') {
        query.skills = { $in: [new RegExp(skill, 'i')] };
      }

      let sortOptions = {};
      if (sort === 'deadline_soon') {
        sortOptions = { applicationDeadline: 1 };
      } else if (sort === 'oldest') {
        sortOptions = { createdAt: 1 };
      } else {
        sortOptions = { createdAt: -1 };
      }

      const total = await Internship.countDocuments(query);
      const internships = await Internship.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: internships.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        data: internships,
      });
    } else {
      let list = [...memoryDB.internships];

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (i) =>
            i.title.toLowerCase().includes(s) ||
            i.company.toLowerCase().includes(s) ||
            i.description.toLowerCase().includes(s) ||
            i.location.toLowerCase().includes(s) ||
            (i.skills && i.skills.some((sk) => sk.toLowerCase().includes(s)))
        );
      }

      if (type && type !== 'All') {
        list = list.filter((i) => i.type.toLowerCase() === type.toLowerCase());
      }

      if (status && status !== 'All') {
        list = list.filter((i) => i.status.toLowerCase() === status.toLowerCase());
      }

      if (skill && skill !== 'All') {
        list = list.filter(
          (i) => i.skills && i.skills.some((sk) => sk.toLowerCase() === skill.toLowerCase())
        );
      }

      if (sort === 'deadline_soon') {
        list.sort(
          (a, b) =>
            new Date(a.applicationDeadline).getTime() -
            new Date(b.applicationDeadline).getTime()
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

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public
exports.getInternshipById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const internship = await Internship.findById(id);
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }
      return res.status(200).json({ success: true, data: internship });
    } else {
      const internship = memoryDB.internships.find((i) => i._id.toString() === id.toString());
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }
      return res.status(200).json({ success: true, data: internship });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Admin Only)
exports.createInternship = async (req, res, next) => {
  try {
    const {
      title,
      company,
      logoUrl,
      location,
      type,
      stipend,
      duration,
      description,
      requirements,
      skills,
      applicationDeadline,
      applyUrl,
      status,
      featured,
    } = req.body;

    if (!title || !company || !stipend || !description || !applicationDeadline || !applyUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, company, stipend, description, application deadline, and apply URL.',
      });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const parsedReqs = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? requirements.split('\n').map((r) => r.trim()).filter(Boolean)
      : [];

    if (isMongoConnected()) {
      const internship = await Internship.create({
        title: title.trim(),
        company: company.trim(),
        logoUrl: logoUrl || '',
        location: location || 'Remote',
        type: type || 'Remote',
        stipend: stipend.trim(),
        duration: duration || '3 Months',
        description: description.trim(),
        requirements: parsedReqs,
        skills: parsedSkills,
        applicationDeadline: new Date(applicationDeadline),
        applyUrl: applyUrl.trim(),
        status: status || 'Active',
        featured: Boolean(featured),
        createdBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: 'Internship listing created successfully!',
        data: internship,
      });
    } else {
      const newInternship = {
        _id: generateId(),
        title: title.trim(),
        company: company.trim(),
        logoUrl: logoUrl || '',
        location: location || 'Remote',
        type: type || 'Remote',
        stipend: stipend.trim(),
        duration: duration || '3 Months',
        description: description.trim(),
        requirements: parsedReqs,
        skills: parsedSkills,
        applicationDeadline: new Date(applicationDeadline),
        applyUrl: applyUrl.trim(),
        status: status || 'Active',
        featured: Boolean(featured),
        createdBy: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryDB.internships.unshift(newInternship);

      return res.status(201).json({
        success: true,
        message: 'Internship listing created successfully!',
        data: newInternship,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Admin Only)
exports.updateInternship = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      let internship = await Internship.findById(id);
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }

      if (req.body.skills && typeof req.body.skills === 'string') {
        req.body.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (req.body.requirements && typeof req.body.requirements === 'string') {
        req.body.requirements = req.body.requirements.split('\n').map((r) => r.trim()).filter(Boolean);
      }

      internship = await Internship.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        message: 'Internship updated successfully!',
        data: internship,
      });
    } else {
      const index = memoryDB.internships.findIndex((i) => i._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }

      const current = memoryDB.internships[index];
      const updatedSkills = req.body.skills !== undefined
        ? Array.isArray(req.body.skills)
          ? req.body.skills
          : typeof req.body.skills === 'string'
          ? req.body.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : current.skills
        : current.skills;

      const updatedReqs = req.body.requirements !== undefined
        ? Array.isArray(req.body.requirements)
          ? req.body.requirements
          : typeof req.body.requirements === 'string'
          ? req.body.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
          : current.requirements
        : current.requirements;

      const updated = {
        ...current,
        ...req.body,
        skills: updatedSkills,
        requirements: updatedReqs,
        updatedAt: new Date(),
      };

      memoryDB.internships[index] = updated;

      return res.status(200).json({
        success: true,
        message: 'Internship updated successfully!',
        data: updated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Admin Only)
exports.deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const internship = await Internship.findById(id);
      if (!internship) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }

      await internship.deleteOne();
      await Bookmark.deleteMany({ internship: id });

      return res.status(200).json({
        success: true,
        message: 'Internship removed successfully.',
      });
    } else {
      const index = memoryDB.internships.findIndex((i) => i._id.toString() === id.toString());
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Internship not found' });
      }

      memoryDB.internships.splice(index, 1);
      memoryDB.bookmarks = memoryDB.bookmarks.filter(
        (b) => !(b.itemType === 'internship' && b.internship && b.internship.toString() === id.toString())
      );

      return res.status(200).json({
        success: true,
        message: 'Internship removed successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};
