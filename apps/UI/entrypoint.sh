#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Set default mode to DEVELOPMENT if not specified
MODE=${MODE:-DEVELOPMENT}

echo "Starting Frontend UI in Mode $MODE"

if [ "$MODE" != "PRODUCTION" ]; then
    echo "Running in DEVELOPMENT mode: Starting Vite Dev Server..."
    # Run the dev server using npm (binds to port 5173 as per package.json)
    exec npm run dev
else
    echo "Running in PRODUCTION mode: Starting Nginx to serve static files..."
    # Start Nginx in the foreground to keep the container running
    exec nginx -g "daemon off;"
fi
