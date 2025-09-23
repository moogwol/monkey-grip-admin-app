# Contacts API

A RESTful API for managing contacts built with Node.js, Express, and PostgreSQL.

## Features

- Full CRUD operations for contacts
- Input validation and error handling
- Search functionality
- Favorite contacts toggle
- Health check endpoint
- Security middleware (Helmet, CORS)
- Dockerized for easy deployment

## API Endpoints

### Base URL
`http://localhost:3000/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | Get all contacts |
| GET | `/contacts?search=term` | Search contacts |
| GET | `/contacts/:id` | Get contact by ID |
| POST | `/contacts` | Create new contact |
| PUT | `/contacts/:id` | Update contact |
| DELETE | `/contacts/:id` | Delete contact |
| PATCH | `/contacts/:id/favorite` | Toggle favorite status |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## Contact Data Structure

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john.doe@example.com",
  "twitter": "@johndoe",
  "avatar": "https://example.com/avatar.jpg",
  "notes": "Some notes about the contact",
  "favorite": false
}
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}, // Response data
  "count": 0, // For list endpoints
  "errors": [] // For validation errors
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation
```bash
npm install
```

### Run locally
```bash
npm run dev
```

### Run with Docker
```bash
docker-compose up --build
```

## Validation Rules

- `first_name`: Required, max 100 characters
- `last_name`: Required, max 100 characters  
- `email`: Required, valid email format, max 255 characters, unique
- `twitter`: Optional, max 255 characters
- `avatar`: Optional, valid URL
- `notes`: Optional, max 1000 characters
- `favorite`: Optional, boolean

## Error Codes

- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error