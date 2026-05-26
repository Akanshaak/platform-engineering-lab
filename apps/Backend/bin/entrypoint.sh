#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Make sure etc directory exists for version storage
mkdir -p etc

echo "Starting in Mode $MODE"

# Store the git commit version if inside a git repository
git rev-parse HEAD > etc/version 2>/dev/null || echo "unknown" > etc/version
WORKERS=${WORKERS:-4}

# Ensure git is marked as a safe directory if inside a container
git config --global --add safe.directory /app || true

if [ "$MODE" != "PRODUCTION" ]; then
    echo "Starting in DEVELOPMENT mode..."
    # Start FastAPI server using uvicorn with live reload
    exec uvicorn app.main:app --host 0.0.0.0 --port 10100 --reload
else
    echo "Starting in PRODUCTION mode..."
    echo "$(date +'%Y-%m-%d')-$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")" > /app/VERSION
    # Start FastAPI server using uvicorn with multiple workers for production
    exec uvicorn app.main:app --host 0.0.0.0 --port 10100 --workers $WORKERS
fi
