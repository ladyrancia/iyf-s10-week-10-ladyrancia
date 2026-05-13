import fs from 'fs';
import path from 'path';

export interface PostData {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  updatedAt?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface CommentData {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface StoreData {
  posts: PostData[];
  users: UserData[];
  comments: CommentData[];
  nextPostId: number;
  nextUserId: number;
  nextCommentId: number;
}

export class FileStorageService {
  private dataDir: string;
  private filePath: string;
  private data: StoreData;

  constructor() {
    this.dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
    this.filePath = path.join(this.dataDir, 'store.json');
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private loadData(): StoreData {
    try {
      if (fs.existsSync(this.filePath)) {
        const rawData = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(rawData);
      }
    } catch (error) {
      console.error('Error loading data file:', error instanceof Error ? error.message : String(error));
    }
    return this.getDefaultData();
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving data file:', error instanceof Error ? error.message : String(error));
    }
  }

  private getDefaultData(): StoreData {
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
  getAllPosts(): PostData[] {
    return this.data.posts;
  }

  getPostById(id: number): PostData | null {
    return this.data.posts.find(p => p.id === id) || null;
  }

  createPost(post: Omit<PostData, 'id' | 'createdAt' | 'likes'>): PostData {
    const newPost: PostData = {
      ...post,
      id: this.data.nextPostId++,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    this.data.posts.push(newPost);
    this.saveData();
    return newPost;
  }

  updatePost(id: number, updates: Partial<PostData>): PostData | null {
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

  deletePost(id: number): boolean {
    const index = this.data.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.posts.splice(index, 1);
    this.data.comments = this.data.comments.filter(c => c.postId !== id);
    this.saveData();
    return true;
  }

  incrementPostLikes(id: number): PostData | null {
    const post = this.getPostById(id);
    if (post) {
      post.likes++;
      this.saveData();
      return post;
    }
    return null;
  }

  // Users methods
  getAllUsers(): UserData[] {
    return this.data.users;
  }

  getUserById(id: number): UserData | null {
    return this.data.users.find(u => u.id === id) || null;
  }

  createUser(user: Omit<UserData, 'id' | 'createdAt'>): UserData {
    const newUser: UserData = {
      ...user,
      id: this.data.nextUserId++,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id: number, updates: Partial<UserData>): UserData | null {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates
    };
    this.saveData();
    return this.data.users[index];
  }

  deleteUser(id: number): boolean {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.data.users.splice(index, 1);
    this.saveData();
    return true;
  }

  // Comments methods
  getAllComments(): CommentData[] {
    return this.data.comments;
  }

  getCommentsByPostId(postId: number): CommentData[] {
    return this.data.comments.filter(c => c.postId === postId);
  }

  getCommentById(id: number): CommentData | null {
    return this.data.comments.find(c => c.id === id) || null;
  }

  createComment(comment: Omit<CommentData, 'id' | 'createdAt'>): CommentData {
    const newComment: CommentData = {
      ...comment,
      id: this.data.nextCommentId++,
      createdAt: new Date().toISOString()
    };
    this.data.comments.push(newComment);
    this.saveData();
    return newComment;
  }

  updateComment(id: number, updates: Partial<CommentData>): CommentData | null {
    const index = this.data.comments.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.comments[index] = {
      ...this.data.comments[index],
      ...updates
    };
    this.saveData();
    return this.data.comments[index];
  }

  deleteComment(id: number): boolean {
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

  // For testing purposes
  clearAllData(): void {
    this.data = this.getDefaultData();
    this.saveData();
  }
}

export default new FileStorageService();
