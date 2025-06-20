#!/bin/bash
set -e

# Check required environment variables
if [ -z "$PROJECT" ] || [ -z "$REGION" ] || [ -z "$REPO" ] || [ -z "$SERVICE_ACCOUNT" ] || [ -z "$DATABASE_INSTANCE_NAME" ] || [ -z "$DATABASE_PASSWORD_SECRET" ]; then
  echo "Error: Required environment variables not set."
  echo "Please set PROJECT, REGION, REPO, DATABASE_INSTANCE_NAME, DATABASE_PASSWORD_SECRET and SERVICE_ACCOUNT"
  exit 1
fi

echo "Using PROJECT: $PROJECT, REGION: $REGION, REPO: $REPO, SERVICE_ACCOUNT: $SERVICE_ACCOUNT"

echo "Building backend Docker image..."
docker buildx build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT/$REPO/backend:latest ./backend

echo "Pushing backend image to Artifact Registry..."
docker push $REGION-docker.pkg.dev/$PROJECT/$REPO/backend:latest

echo "Deploying backend to Cloud Run..."
gcloud run deploy subscription-backend \
  --image $REGION-docker.pkg.dev/$PROJECT/$REPO/backend:latest \
  --region $REGION \
  --service-account $SERVICE_ACCOUNT@$PROJECT.iam.gserviceaccount.com \
  --add-cloudsql-instances $PROJECT:$REGION:$DATABASE_INSTANCE_NAME \
  --set-env-vars CLOUD_RUN=true,POSTGRES_USER=subscription_app_user,POSTGRES_DB=subscription_app,INSTANCE_CONNECTION_NAME=$PROJECT:$REGION:$DATABASE_INSTANCE_NAME \
  --set-secrets POSTGRES_PASSWORD=$DATABASE_PASSWORD_SECRET:latest \
  --cpu=1 --memory=512Mi \
  --min-instances=1 --max-instances=2 \
  --port=8080 \
  --allow-unauthenticated