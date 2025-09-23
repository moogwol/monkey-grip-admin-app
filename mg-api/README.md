# Monkey Grip BJJ Club API

A RESTful API for managing BJJ club members and class coupons built with Node.js, Express, and PostgreSQL.

## Features

- Full CRUD operations for members and class coupons
- Input validation and error handling
- Search functionality for members
- Belt promotion tracking
- Payment status management
- Class coupon management
- Health check endpoint
- Security middleware (Helmet, CORS)
- Dockerized for easy deployment

## API Endpoints

### Base URL
`http://localhost:3000/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | Get all members |
| GET | `/members?search=term` | Search members |
| GET | `/members/:id` | Get member by ID |
| POST | `/members` | Create new member |
| PUT | `/members/:id` | Update member |
| DELETE | `/members/:id` | Delete member |
| PATCH | `/members/:id/promote` | Promote member belt |
| PATCH | `/members/:id/payment` | Update payment status |
| GET | `/members/stats` | Get member statistics |
| GET | `/coupons` | Get all class coupons |
| GET | `/coupons/:id` | Get coupon by ID |
| GET | `/members/:id/coupons` | Get member's coupons |
| POST | `/coupons` | Create new coupon |
| PUT | `/coupons/:id` | Update coupon |
| DELETE | `/coupons/:id` | Delete coupon |
| PATCH | `/coupons/:id/use` | Use a class from coupon |

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