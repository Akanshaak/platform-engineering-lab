# Frontend UI Dashboard

A premium, responsive **React + Vite** dashboard built for the Order Processing Platform. It features a dark slate aesthetic, glassmorphism card details, live order creation, and a background poller that tracks active order steps dynamically.

---

## 🛠️ Technology Stack

* **Build Tool**: Vite
* **Core Framework**: React 18
* **Styling**: Custom modern Vanilla CSS (Dark Slate theme, Outfit google font, and custom keyframes)
* **Web Server**: Nginx (Node alpine wrapper with Brotli static compression in production)

---

## 📂 Directory Structure

```
UI/
├── config/
│   └── default.conf    # Nginx block settings (SPA fallback & Brotli support)
├── src/
│   ├── App.jsx         # Core UI Dashboard, form submission, and polling logic
│   └── main.jsx        # React DOM bootstrap entrypoint
├── Dockerfile          # Builds Vite static files & serves via Nginx + Brotli
├── Docker-compose.yml  # Docker Compose file to run client
├── Makefile            # Automates builds and start scripts
├── package.json        # NPM dependencies and execution scripts
└── vite.config.js      # Vite configurations for React plugin transpilation
```

---

## ⚙️ Configuration & Environment

The application points to the Backend API via `.env` variables (copied from `.env.sample`).

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend Endpoint URL (crucial to prefix with `VITE_`) | `http://localhost:8000` |

---

## 🚀 Execution Instructions

### A. Running via Docker Compose (Recommended)
Ensure you have created the shared docker network:
```bash
docker network create shared-net
```
Then use the built-in **Makefile** shortcuts:
```bash
# Build the UI Nginx container
make build

# Spin up the frontend (binds to host port 5173)
make up

# View web server logs
make logs

# Stop UI
make down
```

---

### B. Running Locally (Without Docker)
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup environment file**:
   ```bash
   cp .env.sample .env
   # Make sure VITE_API_URL matches your active backend URL (e.g., http://localhost:10100)
   ```
3. **Start local Vite dev server**:
   ```bash
   npm run start
   # Or explicitly:
   npm run dev
   ```
   Open **[http://localhost:5173](http://localhost:5173)** to access the dashboard.
4. **Compile production build**:
   ```bash
   npm run build
   ```
   The static built assets will be generated inside the `dist/` directory.
