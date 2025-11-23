# 📋 Expected API Responses - Recipe Database API

This document outlines the exact responses that are expected for each endpoint in the Recipe Database API.

---

## 🥗 Recipe Database Schema

Let's work with a delicious recipes schema, which tracks recipes, cuisines, and ratings!

### **Cuisines Table**

```sql
CREATE TABLE cuisines (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
```

### **Recipes Table**

```sql
CREATE TABLE recipes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cook_time_minutes INTEGER,
    difficulty VARCHAR(50),
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cuisine_id BIGINT NOT NULL,

    FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON DELETE CASCADE
);
```

---

## 📖 API Endpoints Overview

### Recipes

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/recipes`     | Get all recipes   |
| GET    | `/api/recipes/:id` | Get recipe by ID  |
| POST   | `/api/recipes`     | Create new recipe |
| PUT    | `/api/recipes/:id` | Update recipe     |
| DELETE | `/api/recipes/:id` | Delete recipe     |

### Cuisines

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/api/cuisines`             | Get all cuisines       |
| GET    | `/api/cuisines/:id/recipes` | Get recipes by cuisine |
| POST   | `/api/cuisines`             | Create new cuisine     |
| PUT    | `/api/cuisines/:id`         | Update cuisine         |
| DELETE | `/api/cuisines/:id`         | Delete cuisine         |

### Search

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/recipes?q=query` | Search for recipes |

---

## 🍳 Recipes Endpoints

### **GET /api/recipes**

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Pasta Carbonara",
    "description": "Classic Italian pasta dish with eggs, cheese, and pancetta",
    "cook_time_minutes": 30,
    "difficulty": "medium",
    "rating": 4.5,
    "created_at": "2024-11-06T10:00:00Z",
    "cuisine_id": 1,
    "cuisine_name": "Italian"
  },
  {
    "id": 2,
    "title": "Chocolate Chip Cookies",
    "description": "Soft and chewy homemade cookies",
    "cook_time_minutes": 25,
    "difficulty": "easy",
    "rating": 4.8,
    "created_at": "2024-11-06T11:00:00Z",
    "cuisine_id": 2,
    "cuisine_name": "American"
  },
  {
    "id": 3,
    "title": "Beef Stir Fry",
    "description": "Quick and healthy Asian-inspired dish",
    "cook_time_minutes": 20,
    "difficulty": "easy",
    "rating": 4.2,
    "created_at": "2024-11-06T12:00:00Z",
    "cuisine_id": 3,
    "cuisine_name": "Asian"
  }
]
```

**Empty Response (200):**

```json
[]
```

### **GET /api/recipes/:id**

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Pasta Carbonara",
  "description": "Classic Italian pasta dish with eggs, cheese, and pancetta",
  "cook_time_minutes": 30,
  "difficulty": "medium",
  "rating": 4.5,
  "created_at": "2024-11-06T10:00:00Z",
  "cuisine_id": 1,
  "cuisine_name": "Italian"
}
```

**Not Found Response (404):**

```json
{
  "error": "Recipe not found"
}
```

**Invalid ID Response (400):**

```json
{
  "error": "Invalid recipe ID"
}
```

### **POST /api/recipes**

**Request Body:**

```json
{
  "title": "Beef Stir Fry",
  "description": "Quick and healthy Asian-inspired dish",
  "cook_time_minutes": 20,
  "difficulty": "easy",
  "rating": 4.2,
  "cuisine_id": 3,
  "cuisine_name": "Asian"
}
```

**Success Response (201):**

```json
{
  "id": 3,
  "title": "Beef Stir Fry",
  "description": "Quick and healthy Asian-inspired dish",
  "cook_time_minutes": 20,
  "difficulty": "easy",
  "rating": 4.2,
  "created_at": "2024-11-06T12:00:00Z",
  "cuisine_id": 3,
  "cuisine_name": "Asian"
}
```

**Validation Error Response (400):**

```json
{
  "error": "Recipe title is required"
}
```

**Multiple Validation Errors (400):**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "cook_time_minutes",
      "message": "Cook time must be a positive number"
    }
  ]
}
```

**Invalid Data Type (400):**

```json
{
  "error": "Invalid data type",
  "message": "Cook time must be a number"
}
```

### **PUT /api/recipes/:id**

**Request Body (partial update):**

```json
{
  "difficulty": "hard",
  "rating": 4.8
}
```

**Success Response (200):**

```json
{
  "id": 3,
  "title": "Beef Stir Fry",
  "description": "Quick and healthy Asian-inspired dish",
  "cook_time_minutes": 20,
  "difficulty": "hard",
  "rating": 4.8,
  "created_at": "2024-11-06T12:00:00Z",
  "cuisine_id": 3,
  "cuisine_name": "Asian"
}
```

**Not Found Response (404):**

```json
{
  "error": "Recipe not found"
}
```

### **DELETE /api/recipes/:id**

**Success Response (204):**

```
No Content
```

**Not Found Response (404):**

```json
{
  "error": "Recipe not found"
}
```

### **GET /api/recipes/:id/cuisine**

**Success Response (200):**

```json
{
  "id": 1,
  "name": "Italian"
}
```

**No Cuisine Response (404):**

```json
{
  "error": "Cuisine not found"
}
```

---

## 🌍 Cuisines Endpoints

### **GET /api/cuisines**

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "Italian"
  },
  {
    "id": 2,
    "name": "American"
  },
  {
    "id": 3,
    "name": "Asian"
  },
  {
    "id": 4,
    "name": "French"
  },
  {
    "id": 5,
    "name": "Mexican"
  }
]
```

### **GET /api/cuisines/:id**

**Success Response (200):**

```json
{
  "id": 1,
  "name": "Italian"
}
```

### **POST /api/cuisines**

**Request Body:**

```json
{
  "name": "Mediterranean"
}
```

**Success Response (201):**

```json
{
  "id": 6,
  "name": "Mediterranean"
}
```

**Validation Error Response (400):**

```json
{
  "error": "Cuisine name is required"
}
```

**Duplicate Name Error Response (400):**

```json
{
  "error": "Cuisine already exists",
  "message": "Cuisine with name 'Mediterranean' already exists"
}
```

### **GET /api/cuisines/:id/recipes**

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Pasta Carbonara",
    "description": "Classic Italian pasta dish with eggs, cheese, and pancetta",
    "cook_time_minutes": 30,
    "difficulty": "medium",
    "rating": 4.5,
    "created_at": "2024-11-06T10:00:00Z",
    "cuisine_id": 1,
    "cuisine_name": "Italian"
  },
  {
    "id": 4,
    "title": "Spaghetti Aglio e Olio",
    "description": "Simple Italian pasta with garlic and olive oil",
    "cook_time_minutes": 15,
    "difficulty": "easy",
    "rating": 4.3,
    "created_at": "2024-11-06T13:00:00Z",
    "cuisine_id": 1,
    "cuisine_name": "Italian"
  }
]
```

---

## 🔍 Search Endpoint

### **GET /api/recipes?q=pasta**

**Success Response (200):**

```json
{
  "recipes": [
    {
      "id": 1,
      "title": "Pasta Carbonara",
      "description": "Classic Italian pasta dish with eggs, cheese, and pancetta",
      "difficulty": "medium",
      "rating": 4.5,
      "cuisine_id": 1,
      "cuisine_name": "Italian"
    }
  ]
}
```

**No Results Response (200):**

```json
{
  "recipes": []
}
```

**Missing Query Response (400):**

```json
{
  "error": "Search query is required"
}
```

---

## ❌ Error Responses

### **400 Bad Request**

```json
{
  "error": "Validation error",
  "message": "Recipe title is required"
}
```

### **404 Not Found**

```json
{
  "error": "Recipe not found"
}
```

### **500 Internal Server Error**

```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

### **503 Service Unavailable**

```json
{
  "error": "Database connection failed",
  "message": "Please try again later"
}
```

---

## ✅ Validation Rules

### **Recipe Validation**

| Field             | Rules                                  | Error Message                               |
| ----------------- | -------------------------------------- | ------------------------------------------- |
| title             | Required, max 255 characters           | "Title is required" / "Title too long"      |
| description       | Optional, text                         | "Description too long"                      |
| cook_time_minutes | Optional, positive integer             | "Cook time must be positive"                |
| difficulty        | Optional, max 50 characters            | "Difficulty too long"                       |
| rating            | Optional, decimal 0-5, 1 decimal       | "Rating must be between 0 and 5"            |
| cuisine_id        | Required, must exist in cuisines table | "Cuisine ID required" / "Cuisine not found" |

### **Cuisine Validation**

| Field | Rules                                | Error Message                                                |
| ----- | ------------------------------------ | ------------------------------------------------------------ |
| name  | Required, max 255 characters, unique | "Name is required" / "Name too long" / "Name already exists" |

### **Validation Patterns**

**Single Field Error:**

```json
{
  "error": "Field-specific error message"
}
```

**Multiple Field Errors:**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "field_name",
      "message": "Specific error message"
    }
  ]
}
```

**Foreign Key Errors:**

```json
{
  "error": "Resource not found",
  "message": "Referenced resource with ID X does not exist"
}
```

---
