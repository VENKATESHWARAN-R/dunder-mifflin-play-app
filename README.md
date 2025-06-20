# Dunder Mifflin Play App

A containerized microservice application that simulates a subscription management system for a streaming service. The application consists of a frontend interface, a RESTful backend API, and a PostgreSQL database.

## Overview

This application provides functionality for:
- Managing user accounts
- Browsing subscription plans
- Adding subscriptions to user accounts
- Viewing subscription history and status

## Quick Start

To run the application locally:

```bash
# Start the application with Docker Compose
make up

# Stop the application
make down
```

- Frontend interface: http://localhost:3000
- Backend API: http://localhost:8000
- Database: Automatically seeded on startup

## Documentation

The following documentation is available to help you understand and work with this application:

- [Project Structure](PROJECT_STRUCTURE.md) - Detailed technical explanation of the codebase organization
- [Local Development Setup](local-dev-setup.md) - Instructions for running the application locally
- [Deployment Guide](dunder-mifflin-play-app/deployment.md) - Guide for deploying to Google Cloud Platform

### Technical Documentation

- [API Endpoints](dunder-mifflin-play-app/docs/application/api_endpoints.md) - Complete API reference
- [Business Logic](dunder-mifflin-play-app/docs/application/business_logic.md) - Core business rules and data model
- [Application Architecture](dunder-mifflin-play-app/docs/application/technical_description.md) - Technical overview

### Operations & Troubleshooting

- [Logging Strategy](dunder-mifflin-play-app/docs/infrastructure/logging_strategy.md) - How application logging is handled
- [Known Bugs](dunder-mifflin-play-app/docs/troubleshooting/known_bugs.md) - Documentation of intentional bugs for testing
- [Incident History](dunder-mifflin-play-app/docs/troubleshooting/past_incidents.md) - Log of previous incidents and resolutions

## Project Structure

```
dunder-mifflin-play-app/
├── backend/             # Python Flask API backend
├── frontend/            # HTML/JS/CSS frontend
├── docs/                # Documentation
│   ├── application/     # Application documentation
│   ├── infrastructure/  # Infrastructure documentation
│   └── troubleshooting/ # Troubleshooting guides
├── docker-compose.yml   # Local development orchestration
└── Makefile             # Development workflow commands
```

For a more detailed breakdown of the project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask, SQLAlchemy
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Deployment**: Google Cloud Platform (Cloud Run, Cloud SQL)

## Contributing

For development and contribution information, please refer to the [Local Development Setup](local-dev-setup.md) document.
