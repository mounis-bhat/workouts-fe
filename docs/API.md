# API Documentation

This document describes the API endpoints used by the Workouts Frontend application.

## Base URL

```
https://workouts-api.mounis.net
```

## Authentication

The API uses token-based authentication. After successful login, include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Endpoints

### Authentication

#### POST /tokens/auth
Authenticate a user and receive an access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "auth_token": {
    "token": "string",
    "created_at": "2025-06-20T10:00:00Z",
    "expiry": "2025-06-27T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Bad request

### User Management

#### POST /users
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error
- `409` - Username or email already exists

### Workouts

#### GET /workouts
Retrieve all workouts for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "workouts": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Morning Cardio",
      "description": "30-minute cardio session",
      "duration_minutes": 30,
      "calories_burned": 250,
      "created_at": "2025-06-20T08:00:00Z",
      "updated_at": "2025-06-20T08:00:00Z",
      "entries": [
        {
          "id": 1,
          "exercise_name": "Running",
          "sets": null,
          "reps": null,
          "duration_seconds": 1800,
          "weight": null,
          "notes": "Moderate pace",
          "order_index": 1
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

#### POST /workouts
Create a new workout.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "duration_minutes": 45,
  "calories_burned": 300,
  "entries": [
    {
      "exercise_name": "Push-ups",
      "sets": 3,
      "reps": 15,
      "duration_seconds": null,
      "weight": null,
      "notes": "Focus on form",
      "order_index": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": 2,
  "user_id": 1,
  "title": "string",
  "description": "string",
  "duration_minutes": 45,
  "calories_burned": 300,
  "created_at": "2025-06-20T10:00:00Z",
  "updated_at": "2025-06-20T10:00:00Z",
  "entries": [
    {
      "id": 2,
      "exercise_name": "Push-ups",
      "sets": 3,
      "reps": 15,
      "duration_seconds": null,
      "weight": null,
      "notes": "Focus on form",
      "order_index": 1
    }
  ]
}
```

**Status Codes:**
- `201` - Workout created successfully
- `400` - Validation error
- `401` - Unauthorized

#### GET /workouts/:id
Retrieve a specific workout by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Morning Cardio",
  "description": "30-minute cardio session",
  "duration_minutes": 30,
  "calories_burned": 250,
  "created_at": "2025-06-20T08:00:00Z",
  "updated_at": "2025-06-20T08:00:00Z",
  "entries": [
    {
      "id": 1,
      "exercise_name": "Running",
      "sets": null,
      "reps": null,
      "duration_seconds": 1800,
      "weight": null,
      "notes": "Moderate pace",
      "order_index": 1
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - Workout not found

#### PUT /workouts/:id
Update an existing workout.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "duration_minutes": 45,
  "calories_burned": 300,
  "entries": [
    {
      "id": 1,
      "exercise_name": "Updated Exercise",
      "sets": 4,
      "reps": 12,
      "duration_seconds": null,
      "weight": 50,
      "notes": "Increased weight",
      "order_index": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "string",
  "description": "string",
  "duration_minutes": 45,
  "calories_burned": 300,
  "created_at": "2025-06-20T08:00:00Z",
  "updated_at": "2025-06-20T10:00:00Z",
  "entries": [
    {
      "id": 1,
      "exercise_name": "Updated Exercise",
      "sets": 4,
      "reps": 12,
      "duration_seconds": null,
      "weight": 50,
      "notes": "Increased weight",
      "order_index": 1
    }
  ]
}
```

**Status Codes:**
- `200` - Workout updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `404` - Workout not found

#### DELETE /workouts/:id
Delete a workout.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Workout deleted successfully"
}
```

**Status Codes:**
- `200` - Workout deleted successfully
- `401` - Unauthorized
- `404` - Workout not found

## Data Types

### Workout Entry
Represents an individual exercise within a workout.

```typescript
interface WorkoutEntry {
  id?: number;
  exercise_name: string;
  sets?: number | null;
  reps?: number | null;
  duration_seconds?: number | null;
  weight?: number | null;
  notes?: string | null;
  order_index: number;
}
```

### Workout
Represents a complete workout session.

```typescript
interface Workout {
  id: number;
  user_id?: number;
  title: string;
  description: string;
  duration_minutes: number;
  calories_burned: number;
  created_at: string;
  updated_at: string;
  entries: WorkoutEntry[];
}
```

### User
Represents a user account.

```typescript
interface User {
  id?: number;
  username: string;
  email?: string;
}
```

### Auth Token
Represents an authentication token.

```typescript
interface AuthToken {
  token: string;
  created_at: string;
  expiry: string;
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `INVALID_CREDENTIALS` - Invalid username or password
- `TOKEN_EXPIRED` - Authentication token has expired
- `VALIDATION_ERROR` - Request data validation failed
- `NOT_FOUND` - Requested resource not found
- `UNAUTHORIZED` - Missing or invalid authentication
- `DUPLICATE_ENTRY` - Username or email already exists

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code.

## CORS

The API supports CORS for web browsers. The following origins are allowed:
- `http://localhost:3000` (development)
- `https://workouts.yourdomain.com` (production)

## Changelog

### Version 1.0.0
- Initial API release
- User authentication and registration
- CRUD operations for workouts
- Exercise entry management
