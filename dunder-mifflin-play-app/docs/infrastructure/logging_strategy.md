# Logging Strategy

## Overview

The primary logging strategy for this application is to write structured (or semi-structured) logs to the standard output (`stdout`) and standard error (`stderr`) streams of the containers. This is a standard practice in containerized environments, allowing the container orchestration system (Kubernetes) to collect and manage the logs.

## Backend Logging

* **Implementation:** Uses Python's built-in `logging` module.
* **Configuration:** Configured in `backend/app/utils.py` via `logging.basicConfig`.
* **Output:** Logs are sent to `stdout`.
* **Format:** `%(asctime)s - %(name)s - %(levelname)s - %(message)s`
    * Example: `2025-04-06 14:25:10,123 - backend.app.routes - INFO - GET /api/users requested`
* **Levels:** Primarily uses `INFO` for request handling and business logic steps, `WARNING` for potential issues (e.g., user not found before 404), and `ERROR` for actual errors (e.g., database connection failure, unhandled exceptions, triggered 500 responses). `DEBUG` level is available but not enabled by default.
* **WSGI Server Logs:** Gunicorn (used in the Docker container) also logs access information (requests, status codes) and its own errors to `stdout`/`stderr`, complementing the application logs.

## Frontend Logging

* **Implementation:** Uses browser's `console.log()`, `console.warn()`, `console.error()`.
* **Output:** Visible in the browser's developer console. These logs are client-side and not typically collected centrally unless specific browser monitoring tools are implemented.
* **Content:** Logs API request initiations, successes, and failures (including error messages received from the backend).

## Log Collection in Kubernetes

* Kubernetes automatically captures the `stdout` and `stderr` streams from containers.
* **Viewing Logs:** Use `kubectl logs` command:
    ```bash
    # View logs for a backend pod (replace <pod-name>)
    kubectl logs <backend-pod-name> -n sub-poc

    # Follow logs in real-time
    kubectl logs -f <backend-pod-name> -n sub-poc

    # View logs for the nginx frontend pod (mostly access logs)
    kubectl logs <frontend-pod-name> -n sub-poc
    ```
* **Persistence:** By default, `kubectl logs` shows logs for the current instance of the pod. If the pod restarts, logs are lost unless a cluster-level logging agent (like Fluentd, Fluent Bit, Logstash) is configured to collect logs and send them to a persistent storage backend (like Elasticsearch, Loki, Splunk, etc.). This POC does not include a cluster-level logging setup.

## Potential Improvements (for AI Agent Interaction)

* **Structured Logging:** Transition backend logs to a fully structured format like JSON. This makes automated parsing much easier for AI agents. Libraries like `python-json-logger` can facilitate this.
    * Example JSON log entry:
        ```json
        {
          "timestamp": "2025-04-06T14:25:10.123Z",
          "level": "INFO",
          "logger": "backend.app.routes",
          "message": "GET /api/users requested",
          "request_id": "xyz789", // Add correlation IDs
          "user_id": null // Add relevant context
        }
        ```
* **Correlation IDs:** Implement unique IDs for each incoming request and include them in all related log messages across services (if applicable). This helps trace a single request's journey.
* **Log Levels:** Ensure consistent and meaningful use of log levels (`INFO`, `WARN`, `ERROR`, `DEBUG`).