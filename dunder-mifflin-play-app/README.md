# Dunder Mifflin Play Application

This is the main application directory for the Dunder Mifflin Play streaming service.

## Application Components

This directory contains the complete application stack:

- **Backend** (`/backend`): Flask-based RESTful API that handles business logic and database interactions
- **Frontend** (`/frontend`): Simple HTML/JS/CSS interface for user interaction
- **Deployment** (`deployment.md`): Instructions for deploying to Google Cloud Platform
- **Documentation** (`/docs`): Comprehensive documentation about the application

## Local Development

For local development, use Docker Compose:

```bash
# From the project root:
make up
```

## Services

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Database**: PostgreSQL (automatically seeded with test data)

## Environment Configuration

- Use the `.env_example` file as a template to create a `.env` file for configuration
- The database is ephemeral and reseeded on startup in the development environment

## Documentation

See the `/docs` directory for comprehensive documentation:

- `/docs/application/` - API endpoints, business logic, and technical details
- `/docs/infrastructure/` - Logging strategy and infrastructure information
- `/docs/troubleshooting/` - Known bugs and past incident reports

## Deployment

For deployment instructions, refer to `deployment.md` which provides a step-by-step guide for deploying to Google Cloud Platform using Cloud Run and Cloud SQL.

## Scripts

- `deploy_backend.sh` - Script for deploying the backend service
- `deploy_frontend.sh` - Script for deploying the frontend service