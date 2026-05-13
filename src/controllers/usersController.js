const store = require('../data/store');

// GET all users
const getAllUsers = (req, res) => {
    const users = store.getAllUsers();
    res.json(users);
};

// GET single user by ID
const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = store.getUserById(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};

// POST create new user
const createUser = (req, res) => {
    const { name, email } = req.body;
    const newUser = store.createUser({ name, email });
    res.status(201).json(newUser);
};

// PUT update user
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const updatedUser = store.updateUser(id, { name, email });
    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
};

// DELETE user
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const success = store.deleteUser(id);
    if (!success) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
