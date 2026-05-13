import { Request, Response } from 'express';
import store from '../data/store';

// GET all posts with filtering, sorting, and pagination
export const getAllPosts = (req: Request, res: Response) => {
    const { author, search, sort, page = 1, limit = 10 } = req.query;

    let result = [...store.getAllPosts()];

    // Filter by author
    if (author) {
        result = result.filter(post =>
            post.author.toLowerCase().includes(author.toString().toLowerCase())
        );
    }

    // Search in title and content
    if (search) {
        result = result.filter(post =>
            post.title.toLowerCase().includes(search.toString().toLowerCase()) ||
            post.content.toLowerCase().includes(search.toString().toLowerCase())
        );
    }

    // Sort
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
        data: paginatedResult,
        pagination: {
            total: result.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(result.length / limitNum)
        }
    });
};

// GET single post by ID
export const getPostById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const post = store.getPostById(id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
};

// POST create new post
export const createPost = (req: Request, res: Response) => {
    const { title, content, author } = req.body;

    const newPost = store.createPost({ title, content, author });

    res.status(201).json(newPost);
};

// PUT update post
export const updatePost = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const updatedPost = store.updatePost(id, { title, content });

    if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedPost);
};

// DELETE post
export const deletePost = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const success = store.deletePost(id);

    if (!success) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.status(204).send();
};

// PATCH like a post
export const likePost = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const post = store.incrementPostLikes(id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
};
