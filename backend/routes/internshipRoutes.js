const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getInternships)
  .post(protect, authorize('admin'), createInternship);

router
  .route('/:id')
  .get(getInternshipById)
  .put(protect, authorize('admin'), updateInternship)
  .delete(protect, authorize('admin'), deleteInternship);

module.exports = router;
