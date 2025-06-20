# Dunder Mifflin Play App - Project Structure

This document provides a detailed technical overview of the project structure, explaining the purpose and functionality of each directory and key files.

## Root Directory

- `Makefile` - Contains commands for Docker Compose operations such as starting services (`make up`), stopping services (`make down`), and other development utilities.
- `docker-compose.yml` - Defines and configures the containerized services for the application (backend, frontend, database), specifying network connections, volumes, and environment variables.
- `.env_example` - Example environment variables template for configuring the application, particularly the backend service.
- `PROJECT_STRUCTURE.md` - This file, documenting the technical details of the project structure.
- `local-dev-setup.md` - Instructions for setting up and running the application locally using Docker Compose.
- `deployment.md` - Guide for deploying the application to Google Cloud Platform using Cloud Run and Cloud SQL.

## Backend (`/backend`)

Core service handling business logic, API endpoints, and database interactions.

- `Dockerfile` - Instructions for building the backend container image, based on Python with dependencies installed from requirements.txt.
- `requirements.txt` - Lists Python dependencies required by the backend service (Flask, SQLAlchemy, etc.).
- `/src` - Contains all backend source code:
  - `app.py` - The main Flask application entry point, initializing routes and configurations.
  - `database.py` - Database connection management using SQLAlchemy, including session handling and connection pool settings.
  - `models.py` - SQLAlchemy ORM models defining the database schema (User, Subscription, UserSubscription).
  - `seed.py` - Script for populating the database with sample data for development and testing.

## Frontend (`/frontend`)

User interface for interacting with the backend service.

- `Dockerfile` - Instructions for building the frontend container image, using Nginx to serve static content.
- `entrypoint.sh` - Shell script executed when the frontend container starts, handling environment variable substitution and other initialization tasks.
- `index.html` - Main HTML page structure for the user interface.
- `script.js` - JavaScript code handling UI interactions and API calls to the backend.
- `style.css` - Styling definitions for the frontend interface.
- `nginx.conf` - Nginx web server configuration for serving the static frontend files and potentially proxying API requests.

## Documentation (`/docs`)

Comprehensive documentation for various aspects of the application.

- `/application` - Details about the application's functionality and architecture:
  - `api_endpoints.md` - Lists all available API endpoints, their request/response formats, and status codes.
  - `business_logic.md` - Explains the core business rules and data model relationships.
  - `technical_description.md` - Technical overview of the application architecture and components.
  
- `/infrastructure` - Infrastructure and deployment related documentation:
  - `kubernetes_setup.md` - Note about Kubernetes manifests removal (replaced by Docker Compose).
  - `logging_strategy.md` - Details about the logging strategy, formats, and collection methods.

- `/troubleshooting` - Information for diagnosing and fixing issues:
  - `known_bugs.md` - Documentation of intentional bugs in the application for testing purposes.
  - `past_incidents.md` - Log of previous (fictional) incidents and their resolutions.

- `contacts.md` - Lists fictional points of contact for different aspects of the application.
- `README.md` - Overview of the documentation structure and basic application information.

## Deployment Scripts

- `deploy_backend.sh` - Script for deploying the backend service to the cloud environment.
- `deploy_frontend.sh` - Script for deploying the frontend service to the cloud environment.

## Data Flow

1. User interacts with the frontend UI (`/frontend/index.html` and `/frontend/script.js`)
2. Frontend makes API requests to the backend service endpoints defined in `/backend/src/app.py`
3. Backend processes the requests, interacts with the database using models defined in `/backend/src/models.py`
4. Response data flows back to the frontend which updates the UI accordingly

## Environment Configuration

- Local development uses Docker Compose configurations in `docker-compose.yml`
- Production deployment follows the steps outlined in `deployment.md` for GCP deployment
- Environment variables are managed through `.env` files (based on `.env_example`)

This structure follows a typical microservice pattern with clear separation between frontend, backend, and database components, making it scalable and maintainable.
