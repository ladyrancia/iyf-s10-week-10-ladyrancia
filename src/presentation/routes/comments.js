const router = require('express').Router();
const {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentsController');

// GET comments (with optional postId query parameter)
router.get('/', getComments);

// GET single comment by ID
router.get('/:id', getCommentById);

// POST create new comment
router.post('/', createComment);

// PUT update comment
router.put('/:id', updateComment);

// DELETE comment
router.delete('/:id', deleteComment);

module.exports = router;
