# Application Technical Description

## Local Dev reference
This document provides a technical overview of the Dunder Mifflin Play application, including its architecture, components, and how to run it locally using Docker Compose.
* The backend API runs on [http://localhost:8000](http://localhost:8000)
* The frontend runs on [http://localhost:3000](http://localhost:3000)
* The database is ephemeral and seeded on startup.
* Use the `.env` file in the frontend to configure the backend URL if needed.

## Project Structure
- `backend/src/` — All backend code (Flask app, models, database, seeding)
- `frontend/` — All frontend static files (HTML, JS, CSS)
- `docker-compose.yml` — Orchestrates backend, frontend, and database
- `.env_example` — Example environment variables for backend

## Notes
- All legacy backend/app, backend/scripts, and k8s files have been removed.
- Only the new backend/src/ structure is used.
- Use the Makefile for all Docker Compose operations.
view

This application follows a standard microservice pattern with a distinct frontend, backend, and database.

## Backend (`backend/`)

* **Language/Framework:** Python 3.9+ with Flask.
* **API:** RESTful API using Flask Blueprints. See `api_endpoints.md`.
* **Database Interaction:** SQLAlchemy ORM is used to interact with the PostgreSQL database. Sessions are managed per request.
* **Database Schema:** Defined in `backend/app/models.py`. See `business_logic.md` for details on the data model.
* **Configuration:** Database connection details and other settings are primarily configured via environment variables (expected to be provided by Kubernetes ConfigMaps and Secrets). See `backend/app/database.py`.
* **Logging:** Uses Python's standard `logging` module, configured in `backend/app/utils.py`. Logs are directed to `stdout`/`stderr` for easy capture by container orchestration systems. Log format includes timestamp, logger name, level, and message.
* **Dependencies:** Managed via `backend/requirements.txt`.
* **WSGI Server:** Gunicorn is used for running the Flask application in the container (see `backend/Dockerfile`).

## Frontend (`frontend/`)

* **Technology:** Plain HTML, CSS, and JavaScript. No complex framework is used for simplicity.
* **Functionality:** Provides a basic user interface to interact with the backend API endpoints (list users, plans, user subscriptions; add subscriptions). See `frontend/script.js`.
* **API Communication:** Uses the browser's `Workspace` API to make requests to the backend. **Note:** The `API_BASE_URL` in `script.js` might need adjustment depending on how the backend service is exposed in Kubernetes (e.g., NodePort, Ingress). Currently configured for relative path `/api`.
* **Serving:** Served as static files by an Nginx web server (see `frontend/Dockerfile`).

## Database (`database/`)

* **Type:** PostgreSQL.
* **Schema Management:** SQLAlchemy `Base.metadata.create_all()` is used on backend startup (`backend/app/database.py`) to ensure tables defined in `models.py` exist. For production, a proper migration tool (like Alembic) would be recommended.
* **Data Seeding:** A separate script `scripts/seed_database.py` uses the `Faker` library to populate the database with realistic test data. This script needs to be run manually or via a Kubernetes Job after the database is ready. It connects using environment variables similar to the backend.

## Containerization

* Dockerfiles are provided for both the `backend` and `frontend` services.
* The backend image includes Python, dependencies, and Gunicorn.
* The frontend image uses a standard Nginx image and copies the static files.

## Development Setup

For local development, the following ports are used:

* The backend API runs on [http://localhost:8000](http://localhost:8000)
* The frontend runs on [http://localhost:5000](http://localhost:5000)
* The database is ephemeral and seeded on startup.
* Use the `.env` file in the frontend to configure the backend URL if needed.