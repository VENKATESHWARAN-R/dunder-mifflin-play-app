# Known Bugs and Issues

This document lists known bugs intentionally left in the application for the purpose of testing AI agent debugging capabilities.

---

## Bug #1: Duplicate Active Subscriptions Allowed

* **Service:** Backend (`backend/app/routes.py`)
* **Endpoint:** `POST /api/users/{user_id}/subscriptions`
* **Description:** The logic for adding a new subscription to a user does not check if the user *already* has an active subscription for the *same* plan (`subscription_id`). This allows multiple `user_subscriptions` records with `status = 'active'` to exist simultaneously for the same user and the same plan.
* **Symptoms:**
    * Users might appear to be billed multiple times for the same service (in a real system).
    * Calling `GET /api/users/{user_id}/subscriptions` might return multiple entries for the same subscription plan with `status: "active"`.
    * The database `user_subscriptions` table can contain these duplicate active entries.
* **Expected Behavior:** The system should either prevent adding a duplicate active subscription (e.g., return a 409 Conflict error) or handle it as an extension/no-op.
* **Location in Code:** The check for existing active subscriptions is commented out or missing in the `add_user_subscription` function in `backend/app/routes.py`.

---

## Bug #2: Incorrect Error Code for User Not Found

* **Service:** Backend (`backend/app/routes.py`)
* **Endpoint:** `GET /api/users/{user_id}`
* **Description:** When a request is made to get details for a user ID that does not exist in the database, the API returns a generic `500 Internal Server Error` instead of the more appropriate `404 Not Found`.
* **Symptoms:**
    * Clients (like the frontend) receive a 500 error when requesting a non-existent user.
    * The backend logs show an ERROR message like "User lookup failed..." but the HTTP response is 500.
    * This masks the actual reason for the failure (resource not found) with a generic server error.
* **Expected Behavior:** The API should return an HTTP status code `404` with a clear error message indicating the user was not found.
* **Location in Code:** In the `get_user` function in `backend/app/routes.py`, the code explicitly calls `abort(500, ...)` when `user is None`, instead of `abort(404, ...)`.

---

## Bug #3: Potential N+1 Query Performance Issue (Subtle)

* **Service:** Backend (`backend/app/routes.py`)
* **Endpoint:** `GET /api/users/{user_id}/subscriptions`
* **Description:** While the current code uses `joinedload` to mitigate this, it highlights a common performance pitfall. If `joinedload(UserSubscription.subscription)` were *not* used, fetching user subscriptions and then accessing `us.subscription.name` for each result *could* trigger a separate database query for each subscription record to load its details (the "N+1" problem). With many subscriptions per user, this could lead to significant database load and slow response times.
* **Symptoms (if `joinedload` was removed):**
    * Slow response times for the `GET /users/{user_id}/subscriptions` endpoint, especially for users with many subscriptions.
    * Increased number of queries observed in database logs or monitoring tools for a single API request.
    * Higher backend service CPU/memory usage under load.
* **Expected Behavior:** Data should be fetched efficiently, ideally with a constant number of queries regardless of the number of subscriptions (e.g., using a single JOIN query).
* **Location in Code:** The use of `options(joinedload(UserSubscription.subscription))` in the `get_user_subscriptions` function in `backend/app/routes.py` currently prevents this bug, but it serves as a documented example of a potential performance issue AI agents might look for. Removing the `options(...)` part would re-introduce the potential N+1 behavior depending on SQLAlchemy's default loading strategy.