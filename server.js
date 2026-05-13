const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const postsController = require('./src/controllers/postsController');
const usersController = require('./src/controllers/usersController');
const commentsController = require('./src/controllers/commentsController');
const logger = require('./src/middleware/logger');
const { validatePost, validateUser, validateComment } = require('./src/middleware/validate');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Posts routes - using the controller functions
app.get('/api/posts', postsController.getAllPosts);
app.get('/api/posts/:id', postsController.getPostById);
app.post('/api/posts', validatePost, postsController.createPost);
app.put('/api/posts/:id', validatePost, postsController.updatePost);
app.delete('/api/posts/:id', postsController.deletePost);
app.patch('/api/posts/:id/like', postsController.likePost);

// Users routes
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:id', usersController.getUserById);
app.post('/api/users', validateUser, usersController.createUser);
app.put('/api/users/:id', validateUser, usersController.updateUser);
app.delete('/api/users/:id', usersController.deleteUser);

// Comments routes
app.get('/api/comments', commentsController.getComments);
app.get('/api/comments/:id', commentsController.getCommentById);
app.post('/api/comments', validateComment, commentsController.createComment);
app.put('/api/comments/:id', validateComment, commentsController.updateComment);
app.delete('/api/comments/:id', commentsController.deleteComment);

// Analytics route
app.get('/api/stats', (req, res) => {
  const stats = require('./src/data/store').getStats();
  res.json(stats);
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;