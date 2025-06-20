# Application Business Logic

## Core Concept

The application simulates a simple subscription management system. Users can subscribe to different service plans.

## Data Model

The core entities are:

1.  **User (`users` table):** Represents a customer using the service.
    * `id`: Unique identifier.
    * `username`: Unique username.
    * `email`: Unique email address.
    * `created_at`: Timestamp when the user was created.

2.  **Subscription Plan (`subscriptions` table):** Represents the available service tiers.
    * `id`: Unique identifier for the plan.
    * `name`: Name of the subscription plan (e.g., "Basic HD", "Premium 4K").
    * `price`: Monthly price of the plan.
    * `description`: Brief description of the plan features.

3.  **User Subscription (`user_subscriptions` table):** Represents the link between a user and a subscription plan they have signed up for. This acts as a historical record and tracks the current status.
    * `id`: Unique identifier for this specific instance of a subscription.
    * `user_id`: Foreign key linking to the `users` table.
    * `subscription_id`: Foreign key linking to the `subscriptions` table.
    * `start_date`: Timestamp when the subscription period began.
    * `end_date`: Timestamp when the subscription period ended (or will end). `NULL` if currently active and not scheduled to end.
    * `status`: Current status of the subscription (`active`, `cancelled`, `expired`). See `backend/app/models.py` for `SubscriptionStatus` enum.

## Key Business Rules (and Intended Bugs)

* A user can exist without any subscriptions.
* A user can have multiple entries in `user_subscriptions`, representing historical or different concurrent subscriptions (though typically one active per *type*).
* New subscriptions added via the API currently default to `active` status with no `end_date`.
* **Known Bug #1:** The `POST /api/users/{user_id}/subscriptions` endpoint *does not* prevent a user from adding multiple *active* subscriptions of the *same type*. A real system should handle upgrades, downgrades, or prevent duplicates.
* Subscription status changes (`cancelled`, `expired`) are not currently implemented via the API but can be simulated by the seeding script or direct database manipulation.

## API Functionality

The API allows:
* Retrieving lists of users and subscription plans.
* Retrieving details for a specific user.
* Retrieving all subscription records (active, past, etc.) for a specific user.
* Creating a new `user_subscriptions` record (linking a user to a plan).