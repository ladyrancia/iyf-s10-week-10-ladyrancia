# Node.js Express CRUD API - Complete Implementation

This project demonstrates a complete production-ready REST API using Node.js, Express, and best practices. All daily challenges have been completed.

## Features Implemented

### Core Requirements
- **Node.js Built-in Modules**: Uses `fs` and `path` modules extensively in `src/data/store.ts` for file-based data persistence.
- **Express Server**: Configured in `server.js` (JS) and `src/presentation/server.ts` (TS) with middleware.
- **Routes & Request Handling**: Full REST endpoints with proper HTTP methods.
- **Route Parameters**: Used extensively (`:id`, `:id/like`) to identify resources.
- **Query Strings**: Used for filtering, sorting, and pagination (`?author=John&sort=newest&page=1&limit=10`).
- **JSON Responses**: All endpoints return proper JSON with appropriate HTTP status codes.
- **Full CRUD API**: Complete Create, Read, Update, Delete operations for Posts, Users, and Comments.
- **Middleware**: Custom validation, error handling, and logging middleware.
- **Error Handling**: Central error middleware with consistent error format.
- **Organized Code**: Clean separation - routes, controllers, data layer.
- **Environment Variables**: `.env` configuration for port, environment, data directory.
- **Postman Collection**: Ready for API testing (`postman-collection.json`).

### Additional Features
- File-based persistent storage (saves to `data/store.json`)
- Data validation middleware for all input
- Request logging middleware with timing
- Health check endpoint
- Analytics/stats endpoint
- Pagination, sorting, filtering, search
- Like/unlike functionality
- Proper 404 handling

## Project Structure

```
├── server.js                    # JavaScript entry point
├── src/
│   ├── data/
│   │   ├── store.js            # File-based storage service (JS)
│   │   └── store.ts            # TypeScript version with full interface
│   ├── middleware/
│   │   ├── logger.js           # Request logging
│   │   ├── validate.js         # Validation middleware
│   │   └── errorHandler.js     # Error handling
│   ├── controllers/
│   │   ├── postsController.js
│   │   ├── postsController.ts
│   │   ├── usersController.js
│   │   ├── usersController.ts
│   │   ├── commentsController.js
│   │   └── commentsController.ts
│   └── presentation/
│       ├── server.ts           # TypeScript Express setup
│       ├── routes/
│       │   ├── posts.ts
│       │   ├── users.ts
│       │   └── comments.ts
│       └── middleware/
│           └── errorMiddleware.ts
├── __tests__/
│   └── api.test.ts             # Comprehensive Jest test suite
├── postman-collection.json     # Postman import file
├── .env.example                # Environment variables template
├── .env                        # Development environment
├── package.json
├── tsconfig.json
└── jest.config.js              # Jest configuration
```

## API Endpoints

### Health & Stats
- `GET /health` - Server health check
- `GET /api/stats` - Overall statistics

### Posts (`/api/posts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List all (filter, sort, paginate) |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post (and comments) |
| PATCH | `/api/posts/:id/like` | Increment like count |

**Query Parameters for GET /api/posts:**
- `author` - filter by author name
- `search` - search in title & content
- `sort` - `newest` (default), `oldest`, `popular`
- `page` - page number (default 1)
- `limit` - items per page (default 10)

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Comments (`/api/comments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments?postId=1` | List all (filter by postId) |
| GET | `/api/comments/:id` | Get single comment |
| POST | `/api/comments` | Create comment |
| PUT | `/api/comments/:id` | Update comment |
| DELETE | `/api/comments/:id` | Delete comment |

## Running the Application

### Prerequisites
- Node.js v18+ installed

### Installation
```bash
npm install
```

### Development (TypeScript with hot reload)
```bash
npm run dev
```
Server runs at http://localhost:3000

### Production (JavaScript, compiled)
```bash
npm run build
npm start
```

### Environment Variables
Create `.env` file (see `.env.example`):
```env
PORT=3000
NODE_ENV=development
DATA_DIR=./data
LOG_LEVEL=info
```

## Testing

### Automated Tests (Jest)
```bash
npm test
```

The test suite (`src/__tests__/api.test.ts`) covers:
- All CRUD operations for Posts, Users, Comments
- Route parameters validation
- Query string filtering, sorting, pagination
- Validation error responses (400)
- Not found responses (404)
- Error handling middleware
- Analytics endpoint

### Manual Testing with Postman
Import `postman-collection.json` into Postman. Collection includes:
- All API endpoints with example payloads
- Query string examples
- Error case examples
- Environment variable `{{baseUrl}}` set to `http://localhost:3000`

## Key Implementation Details

### File-Based Storage (`src/data/store.ts`)
- Uses `fs` module: `fs.readFileSync`, `fs.writeFileSync`, `fs.existsSync`, `fs.mkdirSync`
- Uses `path` module: `path.join`, `path.resolve` for cross-platform path handling
- Data persisted to `data/store.json` (auto-created)
- Provides same API as in-memory store (methods: `getAllPosts`, `createPost`, etc.)
- Loads data on startup, saves on every mutation

### Middleware
- **Logger**: Logs request method, URL, response time, status code
- **Validation**: Validates post/user/comment fields (length, format)
- **Error Handler**: Centralized error formatting with stack trace in dev mode

### Controllers
- Pure functions that use store service
- Return JSON responses with correct status codes
- Handle both successful and error cases

### Routes
- Express Router instances grouped by resource
- Clean separation from controllers

## Technical Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: JavaScript & TypeScript (both supported)
- **Storage**: File system (JSON) - uses `fs` & `path`
- **Testing**: Jest + Supertest
- **Middleware**: helmet, compression, custom
- **Validation**: Custom (could be replaced with express-validator)
- **Environment**: dotenv

## Checklist: All Daily Challenges Complete ✅

- [x] Run JavaScript with Node.js
- [x] Use built-in Node.js modules (fs, path)
- [x] Create Express server
- [x] Define routes and handle requests
- [x] Use route parameters and query strings
- [x] Send JSON responses with status codes
- [x] Build full CRUD API (Posts, Users, Comments)
- [x] Create and use middleware (logger, validation, error)
- [x] Handle errors properly
- [x] Organize code with routes and controllers
- [x] Use environment variables
- [x] Test API with Postman (collection provided)
- [x] Write automated test suite (Jest)

## Notes

- The TypeScript build may show missing type definition warnings for some transitively required packages. These are non-critical and can be resolved by installing additional `@types/*` packages as needed.
- The file-based storage ensures data persists across server restarts.
- The project follows clean architecture principles with clear separation of concerns.

---

**Project built with** ⚡ **by Kilo** - All requirements satisfied.
