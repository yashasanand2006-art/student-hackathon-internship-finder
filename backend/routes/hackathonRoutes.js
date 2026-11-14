const express = require('express');
const router = express.Router();
const {
  getHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} = require('../controllers/hackathonController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getHackathons)
  .post(protect, authorize('admin'), createHackathon);

router
  .route('/:id')
  .get(getHackathonById)
  .put(protect, authorize('admin'), updateHackathon)
  .delete(protect, authorize('admin'), deleteHackathon);

module.exports = router;
