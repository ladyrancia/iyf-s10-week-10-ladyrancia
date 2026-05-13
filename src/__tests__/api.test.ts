import request from 'supertest';
import app from '../presentation/server';
import store from '../data/store';

// Clear data before each test
beforeEach(() => {
  store.clearAllData();
});

describe('Health Check', () => {
  test('GET /health should return OK status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Posts API - CRUD Operations', () => {
  describe('GET /api/posts', () => {
    test('should return all posts with pagination metadata', async () => {
      const response = await request(app).get('/api/posts');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('totalPages');
    });

    test('should filter posts by author using query string', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ author: 'John' });
      expect(response.status).toBe(200);
      response.body.data.forEach((post: any) => {
        expect(post.author.toLowerCase()).toContain('john');
      });
    });

    test('should search posts by title/content using query string', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ search: 'Express' });
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should sort posts by newest (default)', async () => {
      const response = await request(app).get('/api/posts');
      for (let i = 0; i < response.body.data.length - 1; i++) {
        const date1 = new Date(response.body.data[i].createdAt);
        const date2 = new Date(response.body.data[i + 1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });

    test('should sort posts by popular (most likes)', async () => {
      const response = await request(app)
        .get('/api/posts')
        .query({ sort: 'popular' });
      for (let i = 0; i < response.body.data.length - 1; i++) {
        expect(response.body.data[i].likes).toBeGreaterThanOrEqual(response.body.data[i + 1].likes);
      }
    });

    test('should paginate results correctly', async () => {
      const page = 1;
      const limit = 2;
      const response = await request(app)
        .get('/api/posts')
        .query({ page, limit });
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeLessThanOrEqual(limit);
      expect(response.body.pagination.page).toBe(page);
      expect(response.body.pagination.limit).toBe(limit);
    });
  });

  describe('GET /api/posts/:id', () => {
    test('should return a single post by ID (route parameter)', async () => {
      const response = await request(app).get('/api/posts/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('content');
    });

    test('should return 404 for non-existent post ID', async () => {
      const response = await request(app).get('/api/posts/9999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Post not found');
    });
  });

  describe('POST /api/posts', () => {
    test('should create a new post with valid data', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is a test post content with enough length',
        author: 'Test Author'
      };
      const response = await request(app)
        .post('/api/posts')
        .send(newPost);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body.author).toBe(newPost.author);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body.likes).toBe(0);
    });

    test('should return 400 if title is too short', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'ab',
          content: 'This is a test post content with enough length',
          author: 'Test Author'
        });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Title must be at least 3 characters');
    });

    test('should return 400 if content is too short', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'short',
          author: 'Test Author'
        });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Content must be at least 10 characters');
    });

    test('should return 400 if author is missing', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'This is a test post content with enough length'
        });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Author must be at least 2 characters');
    });
  });

  describe('PUT /api/posts/:id', () => {
    test('should update an existing post', async () => {
      const updates = {
        title: 'Updated Title',
        content: 'Updated content with more text'
      };
      const response = await request(app)
        .put('/api/posts/1')
        .send(updates);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
      expect(response.body.content).toBe(updates.content);
      expect(response.body).toHaveProperty('updatedAt');
    });

    test('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .put('/api/posts/9999')
        .send({ title: 'Updated' });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Post not found');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    test('should delete a post', async () => {
      const response = await request(app).delete('/api/posts/3');
      expect(response.status).toBe(204);

      // Verify deleted
      const verifyResponse = await request(app).get('/api/posts/3');
      expect(verifyResponse.status).toBe(404);
    });

    test('should return 404 for non-existent post', async () => {
      const response = await request(app).delete('/api/posts/9999');
      expect(response.status).toBe(404);
    });

    test('should also delete associated comments', async () => {
      await request(app).delete('/api/posts/1');
      const commentsResponse = await request(app).get('/api/comments?postId=1');
      expect(commentsResponse.body.length).toBe(0);
    });
  });

  describe('PATCH /api/posts/:id/like', () => {
    test('should increment likes for a post', async () => {
      const getInitial = await request(app).get('/api/posts/1');
      const initialLikes = getInitial.body.likes;

      const response = await request(app).patch('/api/posts/1/like');
      expect(response.status).toBe(200);
      expect(response.body.likes).toBe(initialLikes + 1);
    });

    test('should return 404 for non-existent post', async () => {
      const response = await request(app).patch('/api/posts/9999/like');
      expect(response.status).toBe(404);
    });
  });
});

describe('Comments API', () => {
  describe('GET /api/comments', () => {
    test('should return comments filtered by postId', async () => {
      const response = await request(app)
        .get('/api/comments')
        .query({ postId: 1 });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((comment: any) => {
        expect(comment.postId).toBe(1);
      });
    });
  });

  describe('POST /api/comments', () => {
    test('should create a new comment', async () => {
      const newComment = {
        postId: 1,
        author: 'Test User',
        content: 'Test comment content'
      };
      const response = await request(app)
        .post('/api/comments')
        .send(newComment);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.author).toBe(newComment.author);
      expect(response.body.content).toBe(newComment.content);
    });
  });
});

describe('Users API', () => {
  test('GET /api/users should return all users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/users should create a new user', async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@example.com'
    };
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });
});

describe('Error Handling Middleware', () => {
  test('should handle 404 errors', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('should return proper JSON error format', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error).toHaveProperty('status');
  });
});

describe('Analytics and Statistics', () => {
  test('GET /api/stats should return statistics', async () => {
    const response = await request(app).get('/api/stats');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalPosts');
    expect(response.body).toHaveProperty('totalUsers');
    expect(response.body).toHaveProperty('totalComments');
    expect(response.body).toHaveProperty('totalLikes');
  });
});
