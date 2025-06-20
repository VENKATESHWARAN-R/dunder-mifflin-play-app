# Deployment Guide

This guide explains step-by-step how to deploy the Dunder Mifflin Play application to Google Cloud Platform (GCP). The application consists of a frontend, backend, and database that will be deployed using Cloud Run and Cloud SQL.

## 1. Project & Region Setup

First, you'll need to set up a GCP project and choose a region where your resources will be deployed. The region should be chosen based on the geographical location of your users to minimize latency.

- **GCP Project**: [YOUR_PROJECT_ID]
- **Region**: [YOUR_REGION] (e.g., us-central1, europe-west1)

## 2. Provision Cloud SQL (Postgres) Instance

Cloud SQL provides a fully managed database service that makes it easy to set up, maintain, and administer your relational PostgreSQL databases in the cloud.

### Create Cloud SQL Instance

Create a PostgreSQL instance in the same region as your Cloud Run services to minimize latency and data transfer costs.

- **Instance Name**: [YOUR_INSTANCE_NAME]
- **Region**: [YOUR_REGION] (must match your project region)
- *(Via GCP Console or CLI)*

### Create Databases

Next, create the application database with appropriate users. We'll create two database users:
- One with read/write permissions for the application
- One with read-only permissions for reporting or monitoring purposes

- subscription_app

#### subscription_app

- User: subscription_app_user (read/write)
- User: subscription_app_readonly (read only)

Example (CLI):

```bash
# Create users with appropriate permissions
gcloud sql users create subscription_app_user --instance=[YOUR_INSTANCE_NAME] --password='[SECURE_PASSWORD]'
gcloud sql users set-password subscription_app_readonly --instance=[YOUR_INSTANCE_NAME] --password='[SECURE_PASSWORD]'
```

## 3. Create Service Account & Grant Permissions

Service accounts are used to authenticate and authorize your Cloud Run services to access other GCP resources. This follows the principle of least privilege by granting only the necessary permissions.

```bash
# Create a service account for your Cloud Run services
gcloud iam service-accounts create [YOUR_SERVICE_ACCOUNT_NAME] \
  --display-name="Service Account for Cloud Run Backend apps"

# Grant permission to connect to Cloud SQL
gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[YOUR_SERVICE_ACCOUNT_NAME]@[YOUR_PROJECT_ID].iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# Grant permission to access secrets in Secret Manager
gcloud projects add-iam-policy-binding [YOUR_PROJECT_ID] \
  --member="serviceAccount:[YOUR_SERVICE_ACCOUNT_NAME]@[YOUR_PROJECT_ID].iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 4. Setup Artifact Registry (for Container Images)

Artifact Registry stores your Docker container images securely with version control. Cloud Run will pull your container images from this registry when deploying your services.

```bash
# Create a Docker repository in Artifact Registry
gcloud artifacts repositories create [YOUR_REPOSITORY_NAME] \
  --repository-format=docker \
  --location=[YOUR_REGION] \
  --description="Docker repo for your application"
```

Authenticate Docker to allow pushing images to your repository:

```bash
# Configure Docker to use your Google Cloud credentials when pushing to Artifact Registry
gcloud auth configure-docker [YOUR_REGION]-docker.pkg.dev
```

## 5. Store Secrets in Secret Manager

Secret Manager provides a secure way to store and manage sensitive data like passwords. This keeps sensitive values out of your code and configuration files, enhancing security.

Store database user password:

```bash
# Create a new secret with the database password
# The -n flag ensures no newline character is added to the password
echo -n '[SECURE_PASSWORD]' | gcloud secrets create [YOUR_SECRET_NAME] \
  --data-file=-
```

Allow your service account to access the secret:

```bash
# Grant the service account permission to access this specific secret
gcloud secrets add-iam-policy-binding [YOUR_SECRET_NAME] \
  --member="serviceAccount:[YOUR_SERVICE_ACCOUNT_NAME]@[YOUR_PROJECT_ID].iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 6. Build, Tag & Push Docker Images

Next, build Docker images from your application code and push them to Artifact Registry. Cloud Run will deploy containers created from these images.

Make sure to use linux/amd64 platform if building on an Apple Silicon Mac, as GCP Cloud Run runs on x86 architecture!

### Backend

```bash
# Build the backend Docker image with the correct architecture
# Tag it with the Artifact Registry path so it can be pushed there
docker buildx build --platform linux/amd64 -t [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/[YOUR_REPOSITORY_NAME]/backend:latest ./backend

# Push the image to Artifact Registry
docker push [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/[YOUR_REPOSITORY_NAME]/backend:latest
```

### Frontend

```bash
# Build and tag the frontend Docker image
docker buildx build --platform linux/amd64 -t [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/[YOUR_REPOSITORY_NAME]/frontend:latest ./frontend

# Push the frontend image to Artifact Registry
docker push [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/[YOUR_REPOSITORY_NAME]/frontend:latest
```

## 7. Deploy to Cloud Run (Backend & Frontend)

Finally, deploy your containers to Cloud Run, which provides a fully managed serverless platform for running containerized applications.

### Backend Deploy

Deploy the backend first, as the frontend will need to know the backend URL:

```bash
gcloud run deploy backend \
  --image [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/[YOUR_REPOSITORY_NAME]/backend:latest \
  --region [YOUR_REGION] \
  --service-account [YOUR_SERVICE_ACCOUNT_NAME]@[YOUR_PROJECT_ID].iam.gserviceaccount.com \
  --add-cloudsql-instances [YOUR_PROJECT_ID]:[YOUR_REGION]:[YOUR_INSTANCE_NAME] \
  --set-env-vars CLOUD_RUN=true,POSTGRES_USER=subscription_app_user,POSTGRES_DB=subscription_app,INSTANCE_CONNECTION_NAME=[YOUR_PROJECT_ID]:[YOUR_REGION]:[YOUR_INSTANCE_NAME] \
  --set-secrets POSTGRES_PASSWORD=[YOUR_SECRET_NAME]:latest \
  --cpu=1 --memory=512Mi \
  --min-instances=1 --max-instances=2 \
  --port=8080 \
  --allow-unauthenticated
```

Key parameters explained:
- `--add-cloudsql-instances`: Connects the Cloud Run service to your Cloud SQL instance
- `--set-env-vars`: Sets environment variables needed by your application
- `--set-secrets`: Injects secrets from Secret Manager as environment variables
- `--min-instances=1`: Keeps at least one instance warm to avoid cold starts
- `--allow-unauthenticated`: Makes the service publicly accessible without authentication

### Frontend Deploy

**Note:** Update API_BASE_URL after backend is deployed with the actual backend URL!

```bash
gcloud run deploy frontend \
  --image [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/[YOUR_REPOSITORY_NAME]/frontend:latest \
  --region [YOUR_REGION] \
  --service-account [YOUR_SERVICE_ACCOUNT_NAME]@[YOUR_PROJECT_ID].iam.gserviceaccount.com \
  --set-env-vars API_BASE_URL=https://backend-[BACKEND_URL_ID].a.run.app \
  --cpu=0.5 --memory=256Mi \
  --min-instances=1 --max-instances=10 \
  --port=8080 \
  --allow-unauthenticated
```

The frontend needs fewer resources than the backend but might need to scale to more instances to handle user traffic spikes.

## 8. Verify Deployment

After deployment, verify that your services are working correctly:

1. Check that both services show as "Deployed" in the Cloud Run console
2. Visit the frontend URL to ensure the application loads correctly
3. Test key functionality to confirm the backend is responding properly

## 9. Maintenance & Monitoring

- **Logging**: View application logs in Cloud Logging
- **Monitoring**: Set up Cloud Monitoring alerts for error rates and latency
- **Updates**: For updates, build new container images with different tags and update your Cloud Run services

## 10. Cost Optimization

- Cloud Run charges based on usage (requests and resource allocation)
- Set appropriate instance limits to control costs
- Consider scheduled scaling for predictable traffic patterns

## Conclusion

You have successfully deployed the Dunder Mifflin Play application on Google Cloud Platform using Cloud Run and Cloud SQL. This guide provided the necessary steps to set up your project, configure resources, deploy your application, and verify the deployment. For ongoing maintenance, monitoring, and cost optimization, refer to the respective sections in this guide.