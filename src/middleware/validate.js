// Validation middleware
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    const errors = [];

    if (!title || title.trim().length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (!content || content.trim().length < 10) {
        errors.push('Content must be at least 10 characters');
    }

    if (!author || author.trim().length < 2) {
        errors.push('Author must be at least 2 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Trim and assign cleaned values
    req.body.title = title.trim();
    req.body.content = content.trim();
    req.body.author = author.trim();

    next();
};

const validateUser = (req, res, next) => {
    const { name, email } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (!email) {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.name = name.trim();
    req.body.email = email.trim();

    next();
};

const validateComment = (req, res, next) => {
    const { author, content } = req.body;
    const errors = [];

    if (!author || author.trim().length < 2) {
        errors.push('Author must be at least 2 characters');
    }

    if (!content || content.trim().length < 1) {
        errors.push('Content is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.author = author.trim();
    req.body.content = content.trim();

    next();
};

module.exports = { validatePost, validateUser, validateComment };