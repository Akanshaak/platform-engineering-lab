FROM node:22-alpine

WORKDIR /app

# Install system dependencies (nginx, brotli, git)
RUN apk add --upgrade brotli nginx nginx-mod-http-brotli inotify-tools git

# Copy files
COPY package*.json /app/

# Install application dependencies
RUN npm install

# Copy all source files
COPY . /app

# Remove existing builds if present
RUN rm -rf dist

# Build production assets
ARG VITE_COMMIT_HASH
RUN echo "VITE_COMMIT_HASH=$VITE_COMMIT_HASH" >> .env
RUN npm run build

# Brotli compress static files in dist directory
RUN find /app/dist -type f -exec brotli {} \;

# Copy nginx configuration
COPY ./config/default.conf /etc/nginx/http.d/

# Expose port 5173
EXPOSE 5173

# Set script execution permissions and set entrypoint
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
