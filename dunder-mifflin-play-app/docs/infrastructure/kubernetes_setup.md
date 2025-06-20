# Cloud Infrastructure Setup

## Local Development
Docker Compose is used for local development and testing. This provides a consistent local environment that simulates the production setup without the complexity of cloud infrastructure.

## Production Environment
For production deployment, we use Google Cloud Platform's Cloud Run service instead of Kubernetes. Cloud Run is a managed serverless platform that automatically scales container instances based on traffic patterns.

Key production infrastructure components:
- **Cloud Run**: Runs both frontend and backend container instances
- **Cloud SQL**: Hosts PostgreSQL database
- **Artifact Registry**: Stores Docker container images
- **Secret Manager**: Securely stores sensitive configuration

For detailed deployment instructions, please refer to the [deployment guide](../../../deployment.md).