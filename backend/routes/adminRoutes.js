const express = require('express');
const router = express.Router();
const { getAdminStats, seedDatabase } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.post('/seed', seedDatabase);

module.exports = router;
