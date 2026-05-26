#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables from .env if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
fi

# Set default mode to web if not specified
MODE=${MODE:-web}
ENV=${ENV:-development}

echo "Starting Backend in MODE: $MODE (ENV: $ENV)"

# Function to run the FastAPI web server
run_web() {
  if [ "$ENV" = "development" ]; then
    echo "Starting FastAPI with live reload..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  else
    echo "Starting FastAPI in production mode..."
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000
  fi
}

# Function to run the Dramatiq worker
run_worker() {
  echo "Starting Dramatiq worker..."
  exec dramatiq tasks.order_tasks
}

# Execute based on MODE
case "$MODE" in
  web)
    run_web
    ;;
  worker)
    run_worker
    ;;
  all)
    echo "Starting both Web and Worker processes concurrently..."
    
    # Run web server in background
    if [ "$ENV" = "development" ]; then
      uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
    else
      uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    fi
    WEB_PID=$!
    
    # Run worker in background
    dramatiq tasks.order_tasks &
    WORKER_PID=$!
    
    # Handle shutdown signals gracefully
    trap "kill $WEB_PID $WORKER_PID; exit 0" SIGINT SIGTERM
    
    # Wait for background processes
    wait $WEB_PID $WORKER_PID
    ;;
  *)
    echo "Error: Unknown MODE: $MODE. Choose from: web, worker, all."
    exit 1
    ;;
esac
