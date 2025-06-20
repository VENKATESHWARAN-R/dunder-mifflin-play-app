# Subscription Service POC Application

This project provides a simple microse* The backend API runs on [http://localhost:8000](http://localhost:8000)
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
e application simulating a subscription-based service (like Netflix). It is intended as a testbed for developing and testing AI agents focused on application support tasks like log analysis, database interaction, and documentation lookup.

## Architecture

* **Frontend:** Simple HTML/JS client served by Nginx.
* **Backend:** Python Flask API providing core business logic.
* **Database:** PostgreSQL storing user and subscription data.
* **Containerization:** Docker images for frontend and backend.
* **Orchestration:** Kubernetes YAML files for deployment (tested on Minikube).

## Features

* List subscription plans.
* List users.
* List subscriptions for a specific user.
* Add a new subscription for a user.
* Database seeding with fake data via a script or API endpoint.
* Basic logging from the backend service.
* Includes intentional bugs for debugging practice.

## Quickstart with Makefile (Recommended)

1. **Start Minikube:**
   ```bash
   make minikube-up
   ```
2. **Build Docker Images:**
   ```bash
   eval $(minikube -p minikube docker-env)
   make frontend-build
   # (and build backend image if needed)
   docker build -t subscription-backend:latest ./subscription-poc-app/backend
   ```
3. **Deploy to Kubernetes:**
   ```bash
   make k8s-apply
   ```
4. **Get Backend API URL:**
   ```bash
   make get-backend-url
   # Copy the output and update API_BASE_URL in frontend/script.js
   # Example: const API_BASE_URL = 'http://192.168.49.2:30000/api';
   ```
5. **Rebuild and Redeploy Frontend:**
   ```bash
   make frontend-redeploy
   ```
6. **Seed the Database:**
   ```bash
   make seed-db
   ```
7. **Access the Frontend:**
   ```bash
   make open-frontend
   # Or: minikube service frontend-service -n sub-poc
   ```

## How to Rebuild and Redeploy the Frontend Only

1. Update `API_BASE_URL` in `frontend/script.js` if backend URL changes.
2. Run:
   ```bash
   make frontend-redeploy
   ```
   This will rebuild the Docker image and restart the frontend deployment in Kubernetes.

## Cleaning Up

```bash
make minikube-down
```

See the specific documentation files within this `docs` directory for more details on the application, infrastructure, and known issues.

## Development Notes

* The backend API runs on [http://localhost:8000](http://localhost:8000)
* The frontend runs on [http://localhost:5000](http://localhost:5000)
* The database is ephemeral and seeded on startup.
* Use the `.env` file in the frontend to configure the backend URL if needed.