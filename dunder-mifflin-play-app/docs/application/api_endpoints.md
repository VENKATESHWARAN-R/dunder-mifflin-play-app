# API Endpoints

Base URL Path: `/api`

---

### Health Check

* **Endpoint:** `GET /health`
* **Description:** Checks the basic health of the backend service, including database connectivity.
* **Success Response (200 OK):**
    ```json
    {
      "status": "healthy",
      "database_connection": "ok"
    }
    ```
* **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "unhealthy",
      "database_connection": "error",
      "detail": "<error message>"
    }
    ```

---

### Users

* **Endpoint:** `GET /users`
* **Description:** Retrieves a list of all users.
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "username": "user_one",
        "email": "[email address removed]",
        "created_at": "2025-04-06T10:00:00.000Z"
      },
      // ... more users
    ]
    ```

* **Endpoint:** `GET /users/{user_id}`
* **Description:** Retrieves details for a specific user by ID.
* **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "username": "user_one",
      "email": "[email address removed]",
      "created_at": "2025-04-06T10:00:00.000Z"
    }
    ```
* **Error Response (404 Not Found - Correct Behavior):** (Note: Currently returns 500 due to Bug #2)
    ```json
    { "description": "User with id <user_id> not found." }
    ```
* **Error Response (500 Internal Server Error - Actual Behavior Bug #2):**
    ```json
    { "description": "Failed to retrieve user details for ID <user_id>." }
    ```

---

### Subscription Plans

* **Endpoint:** `GET /subscriptions`
* **Description:** Retrieves a list of all available subscription plans.
* **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Basic HD",
        "price": 9.99,
        "description": "Basic High Definition streaming"
      },
      // ... more plans
    ]
    ```

---

### User Subscriptions

* **Endpoint:** `GET /users/{user_id}/subscriptions`
* **Description:** Retrieves all subscription records associated with a specific user.
* **Success Response (200 OK):**
    ```json
    [
      {
        "user_subscription_id": 101,
        "subscription_id": 2,
        "subscription_name": "Premium 4K",
        "start_date": "2025-03-01T12:00:00.000Z",
        "end_date": null,
        "status": "active"
      },
      {
        "user_subscription_id": 55,
        "subscription_id": 1,
        "subscription_name": "Basic HD",
        "start_date": "2024-01-15T08:00:00.000Z",
        "end_date": "2025-01-15T08:00:00.000Z",
        "status": "expired"
      }
      // ... more subscriptions for the user
    ]
    ```
 * **Error Response (404 Not Found):** If the specified `user_id` does not exist.

* **Endpoint:** `POST /users/{user_id}/subscriptions`
* **Description:** Adds a new subscription plan for the specified user.
* **Request Body (JSON):**
    ```json
    {
      "subscription_id": <plan_id_to_add>
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "message": "Subscription added successfully",
      "user_subscription_id": 102,
      "user_id": 1,
      "subscription_id": 1,
      "start_date": "2025-04-06T11:30:00.000Z",
      "status": "active"
    }
    ```
* **Error Responses:**
    * `400 Bad Request`: If `subscription_id` is missing in the body.
    * `404 Not Found`: If the specified `user_id` or `subscription_id` does not exist.
    * `409 Conflict (Intended Behavior - Currently Missing due to Bug #1)`: If the user already has an active subscription of the same type.
    * `500 Internal Server Error`: For database errors or other unexpected issues.
