# Copilot Instructions for contacts-app

## Project Overview
This is a complete full-stack contacts management application built with modern technologies and designed as a reusable template for client projects.

**Technology Stack:**
- **Backend API**: Node.js + Express.js with TypeScript-style validation
- **Database**: PostgreSQL 17 with Docker
- **Frontend**: React Router v7 with TypeScript and Vite
- **Containerization**: Docker Compose for full-stack orchestration
- **API Documentation**: Complete REST API documentation

## Architecture & Structure

### Backend (`contacts-api/`)
- **Express.js API** with full CRUD operations
- **PostgreSQL integration** using `pg` library
- **Input validation** with `express-validator`
- **CORS and security** with helmet middleware
- **RESTful endpoints** at `/api/contacts`
- **Health check** endpoint at `/health`

### Frontend (`contacts-frontend/`)
- **React Router v7** with file-system routing
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Custom API client** with error handling
- **Real-time search** with debounced filtering
- **CRUD interface** for contact management

### Database (`contacts-backend/`)
- **PostgreSQL schema** with initialization scripts
- **Seed data** for development
- **Docker volume persistence**

### Docker Setup
- **Multi-container** orchestration
- **Internal networking** between services
- **Environment configuration** for different modes
- **Volume persistence** for database

## Key Features Implemented

### API Endpoints
- `GET /api/contacts` - List all contacts (with search)
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `PATCH /api/contacts/:id/favorite` - Toggle favorite status

### Frontend Features
- **Contact list** with search functionality
- **Contact detail** views with edit/delete actions
- **Form validation** and error handling
- **Loading states** and user feedback
- **Responsive design** with sidebar navigation
- **404 error handling** with back navigation

## Development Workflow

### Getting Started
```bash
# Start all services
docker compose up

# Access frontend: http://localhost:5173
# Access API: http://localhost:3000
# Database: postgres://localhost:5432
```

### Project Structure
```
contacts-app/
├── contacts-api/          # Express.js API
│   ├── src/
│   │   ├── server.js      # Main server
│   │   ├── database.js    # DB connection
│   │   ├── models/        # Data models
│   │   └── routes/        # API routes
│   └── Dockerfile
├── contacts-frontend/     # React Router app
│   ├── app/
│   │   ├── api.ts         # API client
│   │   ├── data.ts        # Data layer
│   │   └── routes/        # File-system routes
│   └── Dockerfile
├── contacts-backend/      # Database setup
│   ├── init-db.sql       # Schema creation
│   └── seed-data.sql     # Sample data
├── docker-compose.yml    # Service orchestration
└── api-docs.txt         # API documentation
```

## Template Usage Guidelines

### For AI Agents
- **Database-first approach**: Modify `init-db.sql` for new data models
- **API-driven development**: Update routes in `contacts-api/src/routes/`
- **Type-safe frontend**: Maintain TypeScript interfaces in `app/api.ts`
- **Docker consistency**: Keep multi-container architecture
- **File-system routing**: Follow React Router v7 conventions in `app/routes/`

### Customization for Clients
1. **Rename entities**: Replace "contacts" with client's domain (users, products, etc.)
2. **Update data model**: Modify database schema and API interfaces
3. **Rebrand frontend**: Update colors, logos, and terminology
4. **Add client features**: Extend with domain-specific functionality
5. **Deploy**: Use existing Docker setup for production

### Security Considerations
- **Environment variables**: Use `.env` files for sensitive config
- **API validation**: All inputs validated with express-validator
- **CORS configuration**: Properly configured for production
- **Database security**: Connection pooling and prepared statements

## Development Commands

### Backend Development
```bash
cd contacts-api
npm install
npm run dev  # Development with nodemon
```

### Frontend Development
```bash
cd contacts-frontend  
npm install
npm run dev  # Vite dev server
```

### Database Management
```bash
# Access database
docker compose exec postgres psql -U contactsuser -d contactsdb

# Reset database
docker compose down -v
docker compose up
```

## Best Practices Implemented
- **RESTful API design** with proper HTTP status codes
- **Error boundaries** and 404 handling in React
- **Loading states** and user feedback
- **Form validation** on both client and server
- **Docker networking** with service discovery
- **TypeScript** for type safety across the stack
- **Modular architecture** for easy customization

## Deployment Ready
- **Production Docker builds** optimized for performance
- **Environment configuration** for different stages
- **Health checks** for monitoring
- **Volume persistence** for data safety
- **Internal networking** for security

This template provides a solid foundation for building modern full-stack web applications with professional development practices and deployment readiness.
