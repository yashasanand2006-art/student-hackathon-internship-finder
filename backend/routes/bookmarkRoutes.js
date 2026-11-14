const express = require('express');
const router = express.Router();
const {
  getUserBookmarks,
  getUserBookmarkIds,
  toggleBookmark,
  deleteBookmark,
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

router.use(protect); // All bookmark endpoints require authentication

router.get('/', getUserBookmarks);
router.get('/ids', getUserBookmarkIds);
router.post('/toggle', toggleBookmark);
router.delete('/:id', deleteBookmark);

module.exports = router;
