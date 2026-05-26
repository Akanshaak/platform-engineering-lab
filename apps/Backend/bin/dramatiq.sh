#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Make sure etc directory exists for version storage
mkdir -p etc

PROCESSES=${PROCESSES:-2}
THREADS_PER_PROCESS=${THREADS_PER_PROCESS:-2}

# Store the git commit version if inside a git repository
git rev-parse HEAD > etc/version 2>/dev/null || echo "unknown" > etc/version
echo "Starting Dramatiq worker in Mode $MODE (Processes: $PROCESSES, Threads: $THREADS_PER_PROCESS)"

# Ensure git is marked as a safe directory if inside a container
git config --global --add safe.directory /app || true

# Run dramatiq worker
exec dramatiq tasks.order_tasks --processes $PROCESSES --threads $THREADS_PER_PROCESS
