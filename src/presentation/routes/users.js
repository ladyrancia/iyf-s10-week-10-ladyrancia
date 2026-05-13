const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

// GET all users
router.get('/', getAllUsers);

// GET single user
router.get('/:id', getUserById);

// POST create new user
router.post('/', createUser);

// PUT update user
router.put('/:id', updateUser);

// DELETE user
router.delete('/:id', deleteUser);

module.exports = router;
