import { Router } from 'express';
import { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost 
} from '../controllers/postsController';

const router = Router();

// GET all posts
router.get('/', getAllPosts);

// GET single post
router.get('/:id', getPostById);

// POST create new post
router.post('/', createPost);

// PUT update post
router.put('/:id', updatePost);

// DELETE post
router.delete('/:id', deletePost);

// PATCH like a post
router.patch('/:id/like', likePost);

export default router;