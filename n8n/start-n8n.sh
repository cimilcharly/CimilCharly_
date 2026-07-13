#!/bin/bash

# Navigate to n8n folder if not already there
cd "$(dirname "$0")"

# Check if .env file exists in the parent directory
PARENT_ENV="../.env"
if [ ! -f "$PARENT_ENV" ]; then
    echo "[n8n] Creating root .env from .env.example. Please update your GEMINI_API_KEY there!"
    cp ../.env.example "$PARENT_ENV"
fi

# Copy the parent .env to local n8n .env for Docker compose
cp "$PARENT_ENV" .env

echo "[n8n] Starting n8n container..."
docker compose up -d

echo "[n8n] Waiting for n8n to start (http://localhost:5678)..."
sleep 5

echo "[n8n] n8n should now be running at http://localhost:5678"
echo "[n8n] To import the workflow, navigate to Workflows -> Import from File, and choose workflow.json."
