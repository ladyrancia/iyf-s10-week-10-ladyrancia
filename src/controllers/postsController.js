const store = require('../data/store');

// GET all posts with filtering, sorting, and pagination
const getAllPosts = (req, res) => {
    const { author, search, sort, page = 1, limit = 10 } = req.query;

    let result = [...store.getAllPosts()];

    // Filter by author
    if (author) {
        result = result.filter(post =>
            post.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    // Search in title and content
    if (search) {
        result = result.filter(post =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Sort
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
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
const getPostById = (req, res) => {
    const id = parseInt(req.params.id);
    const post = store.getPostById(id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
};

// POST create new post
const createPost = (req, res) => {
    const { title, content, author } = req.body;

    const newPost = store.createPost({ title, content, author });

    res.status(201).json(newPost);
};

// PUT update post
const updatePost = (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const updatedPost = store.updatePost(id, { title, content });

    if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedPost);
};

// DELETE post
const deletePost = (req, res) => {
    const id = parseInt(req.params.id);

    const success = store.deletePost(id);

    if (!success) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.status(204).send();
};

// PATCH like a post
const likePost = (req, res) => {
    const id = parseInt(req.params.id);

    const post = store.incrementPostLikes(id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost
};
