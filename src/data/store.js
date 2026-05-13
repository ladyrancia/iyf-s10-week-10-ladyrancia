const fs = require('fs');
const path = require('path');

class FileStorageService {
  constructor() {
    this.dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
    this.filePath = path.join(this.dataDir, 'store.json');
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(rawData);
      }
    } catch (error) {
      console.error('Error loading data file:', error.message);
    }
    return this.getDefaultData();
  }

  saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving data file:', error.message);
    }
  }

  getDefaultData() {
    return {
      posts: [
        {
          id: 1,
          title: "Getting Started with Node.js",
          content: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows you to run JavaScript on the server side, enabling full-stack JavaScript development.",
          author: "John Doe",
          createdAt: "2026-01-15T10:00:00Z",
          likes: 10
        },
        {
          id: 2,
          title: "Express.js Fundamentals",
          content: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
          author: "Jane Smith",
          createdAt: "2026-01-16T14:30:00Z",
          likes: 15
        },
        {
          id: 3,
          title: "Understanding REST APIs",
          content: "REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP requests to access and use data.",
          author: "John Doe",
          createdAt: "2026-01-17T09:15:00Z",
          likes: 8
        }
      ],
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          createdAt: "2026-01-10T08:00:00Z"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: "2026-01-11T09:30:00Z"
        }
      ],
      comments: [
        {
          id: 1,
          postId: 1,
          author: "Alice",
          content: "Great introduction to Node.js!",
          createdAt: "2026-01-15T11:00:00Z"
        },
        {
          id: 2,
          postId: 1,
          author: "Bob",
          content: "Very helpful, thanks for sharing.",
          createdAt: "2026-01-15T12:30:00Z"
        },
        {
          id: 3,
          postId: 2,
          author: "Charlie",
          content: "Express makes routing so easy!",
          createdAt: "2026-01-16T15:00:00Z"
        }
      ],
      nextPostId: 4,
      nextUserId: 3,
      nextCommentId: 4
    };
  }

  // Posts methods
  getAllPosts() {
    return this.data.posts;
  }

  getPostById(id) {
    return this.data.posts.find(p => p.id === id) || null;
  }

  createPost(post) {
    post.id = this.data.nextPostId++;
    post.createdAt = post.createdAt || new Date().toISOString();
    post.likes = post.likes || 0;
    this.data.posts.push(post);
    this.saveData();
    return post;
  }

  updatePost(id, updates) {
    const index = this.data.posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.posts[index] = {
      ...this.data.posts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.posts[index];
  }

  deletePost(id) {
    const index = this.data.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.posts.splice(index, 1);
    this.data.comments = this.data.comments.filter(c => c.postId !== id);
    this.saveData();
    return true;
  }

  incrementPostLikes(id) {
    const post = this.getPostById(id);
    if (post) {
      post.likes++;
      this.saveData();
      return post;
    }
    return null;
  }

  // Users methods
  getAllUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  createUser(user) {
    user.id = this.data.nextUserId++;
    user.createdAt = user.createdAt || new Date().toISOString();
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates
    };
    this.saveData();
    return this.data.users[index];
  }

  deleteUser(id) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.data.users.splice(index, 1);
    this.saveData();
    return true;
  }

  // Comments methods
  getAllComments() {
    return this.data.comments;
  }

  getCommentsByPostId(postId) {
    return this.data.comments.filter(c => c.postId === postId);
  }

  getCommentById(id) {
    return this.data.comments.find(c => c.id === id) || null;
  }

  createComment(comment) {
    comment.id = this.data.nextCommentId++;
    comment.createdAt = comment.createdAt || new Date().toISOString();
    this.data.comments.push(comment);
    this.saveData();
    return comment;
  }

  updateComment(id, updates) {
    const index = this.data.comments.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.comments[index] = {
      ...this.data.comments[index],
      ...updates
    };
    this.saveData();
    return this.data.comments[index];
  }

  deleteComment(id) {
    const index = this.data.comments.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.comments.splice(index, 1);
    this.saveData();
    return true;
  }

  // Analytics
  getStats() {
    return {
      totalPosts: this.data.posts.length,
      totalUsers: this.data.users.length,
      totalComments: this.data.comments.length,
      totalLikes: this.data.posts.reduce((sum, p) => sum + p.likes, 0)
    };
  }
}

module.exports = new FileStorageService();
