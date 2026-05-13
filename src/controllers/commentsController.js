const store = require('../data/store');

// GET comments by post ID (query param)
const getComments = (req, res) => {
    const { postId } = req.query;
    let comments = store.getAllComments();

    if (postId) {
        comments = comments.filter(c => c.postId === parseInt(postId));
    }

    res.json(comments);
};

// GET single comment by ID
const getCommentById = (req, res) => {
    const id = parseInt(req.params.id);
    const comment = store.getCommentById(id);
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
};

// POST create new comment
const createComment = (req, res) => {
    const { postId, author, content } = req.body;

    if (!postId || !author || !content) {
        return res.status(400).json({ error: 'postId, author, and content are required' });
    }

    const newComment = store.createComment({
        postId: parseInt(postId),
        author,
        content
    });

    res.status(201).json(newComment);
};

// PUT update comment
const updateComment = (req, res) => {
    const id = parseInt(req.params.id);
    const { author, content } = req.body;
    const updatedComment = store.updateComment(id, { author, content });
    if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(updatedComment);
};

// DELETE comment
const deleteComment = (req, res) => {
    const id = parseInt(req.params.id);
    const success = store.deleteComment(id);
    if (!success) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(204).send();
};

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};
