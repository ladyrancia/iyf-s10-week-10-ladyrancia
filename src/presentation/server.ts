import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';
import commentsRouter from './routes/comments';
import usersRouter from './routes/users';
import commentsRouter from './routes/comments';
import { errorHandler, notFoundHandler, asyncHandler } from './middleware/errorMiddleware';
import logger from '../middleware/logger';
import { validatePost } from '../middleware/validate';
import { validateUser } from '../middleware/validate';
import { validateComment } from '../middleware/validate';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);

// Stats endpoint
app.get('/api/stats', (req: Request, res: Response) => {
  const store = require('../data/store');
  res.json(store.getStats());
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;