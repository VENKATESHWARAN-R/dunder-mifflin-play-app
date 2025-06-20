# Past Incidents Log (Fictional Examples)

This log contains examples of fictional past issues and their resolutions, providing context for AI agents.

---

**Incident ID:** INC-2024-001
**Date:** 2024-10-15
**Severity:** High
**Services Affected:** Backend API
**Title:** API unresponsive under moderate load - DB connection pool exhaustion

**Symptoms:**
* API endpoints (`/api/*`) intermittently returned 500 errors or timed out.
* Backend logs showed "TimeoutError: QueuePool limit of size <x> overflow <y> reached" from SQLAlchemy.
* Database monitoring showed a high number of active connections, hitting the configured limit.

**Root Cause:**
* The default SQLAlchemy connection pool size was too small for the number of concurrent requests handled by Gunicorn workers during peak traffic simulation.
* Each worker trying to handle a request would attempt to check out a DB connection, quickly exhausting the pool.

**Resolution:**
* Increased the `pool_size` and `max_overflow` parameters in the `create_engine` call within `backend/app/database.py`.
* Monitored connection usage after the change to confirm resolution.

**Action Items:**
* [Done] Update engine configuration with larger pool size.
* [Done] Add database connection pool monitoring to dashboards.

---

**Incident ID:** INC-2024-002
**Date:** 2024-08-22
**Severity:** Medium
**Services Affected:** Database Seeding Script
**Title:** Database seeding fails with unique constraint violation

**Symptoms:**
* Running `scripts/seed_database.py` failed midway through user creation.
* Logs showed `IntegrityError: duplicate key value violates unique constraint "ix_users_email"` from PostgreSQL/SQLAlchemy.

**Root Cause:**
* The `Faker` library, while generating random data, had a small probability of generating the same email address twice within a single seeding run, especially with a large number of users being created. The `email` column has a unique constraint.

**Resolution:**
* Modified the seeding script (`scripts/seed_database.py`) to wrap user creation in a try/except block.
* Inside the `except IntegrityError`, the script now retries generating a user with different fake data a few times before failing completely.
* Ensured database sessions were rolled back correctly on error.

**Action Items:**
* [Done] Implement retry logic in the seeding script's user creation loop.

---