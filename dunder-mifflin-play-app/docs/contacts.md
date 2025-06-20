# Application Contacts (Fictional)

This document lists the primary points of contact or teams responsible for different parts of the Subscription POC application.

## Development Teams

* **Backend Team (Serpents):**
    * **Responsibilities:** Flask API development, database schema, business logic implementation, API performance.
    * **Contact:** `#backend-dev` Slack channel, `backend-team@example.com` mailing list.
    * **On-Call:** PagerDuty schedule "Backend On-Call".

* **Frontend Team (Phoenix):**
    * **Responsibilities:** HTML/JS/CSS development, user interface, API integration from the client-side.
    * **Contact:** `#frontend-dev` Slack channel, `frontend-team@example.com` mailing list.

## Operations & Infrastructure

* **Infrastructure Team (Titans):**
    * **Responsibilities:** Kubernetes cluster management, PostgreSQL database administration, networking, monitoring, CI/CD pipelines.
    * **Contact:** `#infra-ops` Slack channel, `infra-team@example.com` mailing list.
    * **On-Call:** PagerDuty schedule "Infra On-Call".

## Database Administration

* **DBA Team (part of Titans):**
    * **Responsibilities:** Database backups, performance tuning, schema migrations (in a real scenario), user access management.
    * **Contact:** Tag `@db-admins` in `#infra-ops` Slack channel.

## Support Tiers

* **Tier 1 Support:** Initial troubleshooting, ticket routing. Uses runbooks based on documentation here.
* **Tier 2 Support:** Application specialists (liaise with Dev teams). Can analyze logs, query database (read-only).
* **Tier 3 Support:** Development and Infrastructure teams (as listed above).