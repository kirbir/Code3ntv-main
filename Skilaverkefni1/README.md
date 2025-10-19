# 📚 Article & Author API

An asynchronous Express.js API built with TypeScript that demonstrates **validation** and **error handling** best practices.

You'll be working with the topics that we have gone over so far:

- ✅ **Input Validation** with Zod schemas
- ✅ **TypeScript** for type safety
- ✅ **RESTful API** design
- ✅ **Express Servers**
- ✅ **Error Handling** middleware patterns
- ✅ **ES Modules** in Node.js
- ✅ **File-based data storage**

## 📁 Project Structure

```
src/
├── data/           # JSON files for data storage
│   ├── articles.json
│   └── authors.json
├── middleware/     # Express middleware
│   ├── errorHandler.ts
│   └── validate.ts
├── routes/         # API route handlers
│   ├── articles.ts
│   └── authors.ts
├── schemas/        # Zod validation schemas
│   ├── arcticlesSchema.ts
│   └── authorSchema.ts
└── server.ts       # Main application file
```

## 📖 API Endpoints

### Articles

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/articles`     | Get all articles   |
| GET    | `/api/articles/:id` | Get article by ID  |
| POST   | `/api/articles`     | Create new article |
| DELETE | `/api/articles/:id` | Delete article     |

### Authors

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/authors`              | Get all authors        |
| GET    | `/api/authors/:id`          | Get author by ID       |
| GET    | `/api/authors/:id/articles` | Get articles by author |
| POST   | `/api/authors`              | Create new author      |
| DELETE | `/api/authors/:id`          | Delete author          |


## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone and navigate to the project:**

   ```bash
   git clone https://github.com/gunnsteinnskula/ntv-h25-fk2.git
   cd skilaverkefni-1
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run server
   ```

4. **The API will be running at:** `http://localhost:3000`
## 🧪 Testing the API

### Example Requests

#### Create a new author:

```bash
 POST http://localhost:3000/api/authors
  {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "bio": "Tech writer and developer"
  }
```

#### Create a new article:

```bash
POST http://localhost:3000/api/articles
  {
    "title": "Learning TypeScript",
    "content": "TypeScript adds static typing to JavaScript...",
    "authorId": 1
  }
```

#### Get articles by a specific author:

```bash
 GET http://localhost:3000/api/authors/1/articles
```

#### Test validation errors:

```bash
  POST http://localhost:3000/api/authors
  {
    "name": "",
    "email": "invalid-email"
  }
```

## 🔍 Understanding Validation

### Zod Schemas

This project uses [Zod](https://zod.dev/) for runtime validation. Here are some validation patterns you can explore:

**Common Zod Validation Patterns:**

```typescript
// String validations
z.string().min(1, 'Field is required');
z.string().max(100, 'Too long');
z.string().email('Invalid email');
z.string().url('Invalid URL');

// Number validations
z.number().positive('Must be positive');
z.number().min(0, 'Cannot be negative');
z.number().max(100, 'Too large');

// Optional fields
z.string().optional();
z.number().optional();

// Custom error messages
z.string().min(1, 'Custom error message here');
```

### Validation Middleware

The validation middleware automatically checks request data before it reaches your route handlers.

**How Validation Middleware Works:**

1. **Intercepts requests** before they reach route handlers
2. **Validates data** against your Zod schemas
3. **Returns errors** if validation fails
4. **Continues processing** if validation passes

**Example Usage in Routes:**

```typescript
// Apply validation to a POST route
router.post('/', validate(createAuthorSchema), routeHandler);

// The validate function checks req.body against the schema
// If invalid, it returns a 400 error with details
// If valid, it calls next() to continue to routeHandler
```

## ⚠️ Understanding Error Handling

### Error Handler Middleware

The global error handler catches all unhandled errors in your application.

**Error Handling Flow:**

1. **Any error occurs** in your route handlers
2. **Call `next(error)`** to pass it to the error handler
3. **Error handler logs** the error for debugging
4. **Sends consistent response** to the client

**Types of Errors Handled:**

- **Validation errors** (400) - Invalid input data
- **Not found errors** (404) - Resource doesn't exist
- **Server errors** (500) - Unexpected application errors

**Best Practices:**

```typescript
// In route handlers, always use try/catch
try {
  // Your route logic here
  const result = await someAsyncOperation();
  res.json(result);
} catch (error) {
  next(error); // Pass to error handler
}
```

### Error Response Format

All errors return a consistent format to make them easy to handle in frontend applications.

**Understanding Error Responses:**

- **Validation errors** include detailed field-level information
- **Not found errors** have simple status and message
- **Server errors** use a different format for security

**Example Error Response Structure:**

```typescript
// Validation error format
{
  error: {
    status: 400,
    message: "Validation failed",
    details: [...] // Array of specific field errors
  }
}

// Simple error format
{
  error: {
    status: 404,
    message: "Resource not found"
  }
}

// Server error format
{
  success: false,
  message: "Server Error"
}
```

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/) - Learn more about schema validation
- [Express.js Guide](https://expressjs.com/) - Official Express.js documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Learn TypeScript
- [REST API Best Practices](https://restfulapi.net/) - RESTful API design principles

**Happy Learning! 🎉**

_hint: use lesson 6 and 7 to see some helpful examples!._