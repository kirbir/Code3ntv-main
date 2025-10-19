# API Documentation

Base URL: `http://localhost:3000`

## 📚 Articles Endpoints

### Get All Articles
```
GET /api/articles
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "content": "Article content...",
      "authorId": "author-uuid"
    }
  ]
}
```

---

### Get Article by ID
```
GET /api/articles/:id
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "content": "Article content...",
    "authorId": "author-uuid"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Article not found."
}
```

---

### Create New Article
```
POST /api/articles
```
**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Article content...",
  "authorId": "valid-author-uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "title": "Article Title",
    "content": "Article content...",
    "authorId": "author-uuid"
  }
}
```

---

### Delete Article
```
DELETE /api/articles/:id
```
**Response (200):**
```
Article deleted successfully
```

---

## 👤 Authors Endpoints

### Get All Authors
```
GET /api/authors
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Author Name",
      "email": "author@example.com",
      "bio": "Author biography..."
    }
  ]
}
```

---

### Get Author by ID
```
GET /api/authors/:id
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Author Name",
    "email": "author@example.com",
    "bio": "Author biography..."
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Author not found."
}
```

---

### Get All Articles by Author
```
GET /api/authors/:id/articles
```
**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "content": "Article content...",
    "authorId": "author-uuid"
  }
]
```

**Response - No Articles (200):**
```json
[]
```

**Error - Author Not Found (404):**
```json
{
  "error": {
    "status": 404,
    "message": "Author not found"
  }
}
```

---

### Create New Author
```
POST /api/authors
```
**Request Body:**
```json
{
  "name": "Author Name",
  "email": "author@example.com",
  "bio": "Author biography..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "name": "Author Name",
    "email": "author@example.com",
    "bio": "Author biography..."
  }
}
```

---

### Delete Author
```
DELETE /api/authors/:id
```
**Response (200):**
```
Author deleted successfully
```

---

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

### General Error (404/500)
```json
{
  "error": {
    "status": 404,
    "message": "Resource not found"
  }
}
```

---

## 🛠️ Running the Server

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

