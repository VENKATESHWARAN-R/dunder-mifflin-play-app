#!/bin/bash
set -e

# Check required environment variables
if [ -z "$PROJECT" ] || [ -z "$REGION" ] || [ -z "$REPO" ] || [ -z "$SERVICE_ACCOUNT" ]; then
  echo "Error: Required environment variables not set."
  echo "Please set PROJECT, REGION, REPO, and SERVICE_ACCOUNT"
  exit 1
fi

BACKEND_URL=$1

if [ -z "$BACKEND_URL" ]; then
  echo "Usage: $0 <BACKEND_URL>"
  exit 1
fi

echo "Using PROJECT: $PROJECT, REGION: $REGION, REPO: $REPO, SERVICE_ACCOUNT: $SERVICE_ACCOUNT"

echo "Building frontend Docker image..."
docker buildx build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT/$REPO/frontend:latest ./frontend

echo "Pushing frontend image to Artifact Registry..."
docker push $REGION-docker.pkg.dev/$PROJECT/$REPO/frontend:latest

echo "Deploying frontend to Cloud Run..."
gcloud run deploy subscription-frontend \
  --image $REGION-docker.pkg.dev/$PROJECT/$REPO/frontend:latest \
  --region $REGION \
  --service-account $SERVICE_ACCOUNT@$PROJECT.iam.gserviceaccount.com \
  --set-env-vars API_BASE_URL=$BACKEND_URL \
  --cpu=0.5 --memory=256Mi \
  --min-instances=1 --max-instances=10 \
  --port=8080 \
  --allow-unauthenticated