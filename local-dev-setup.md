# How to run the application (Docker Compose)

## Prerequisites
- Docker and Docker Compose installed

## Running the Application

1. Clone the repository and navigate to the project root.
2. Run:
   ```sh
   make up
   ```
3. The backend will be available at http://localhost:8000
4. The frontend will be available at http://localhost:3000
5. The database is ephemeral and will be seeded on startup.

## Project Structure

- `backend/src/` — All backend code (Flask app, models, database, seeding)
- `frontend/` — All frontend static files (HTML, JS, CSS)
- `docker-compose.yml` — Orchestrates backend, frontend, and database
- `.env_example` — Example environment variables for backend

## Notes
- All legacy backend/app, backend/scripts, and k8s files have been removed.
- Only the new backend/src/ structure is used.
- Use the Makefile for all Docker Compose operations.


## Stopping the Application

```sh
make down
```

---

# Removed Kubernetes
All Kubernetes manifests and documentation have been removed. Use Docker Compose for local development and microservice orchestration.
