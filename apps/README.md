# Order Processing Platform

A real-time Order Processing Platform built with a modern decoupled stack. Users can place orders on a sleek, responsive React dashboard and watch the processing states transition dynamically as background jobs are orchestrated.

---

##  System Architecture

The application is split into two independent services that communicate via REST APIs and background workers:

```
                  ┌───────────────────────┐
                  │   React + Vite UI     │
                  │   (Nginx / Node)      │
                  └───────────┬───────────┘
                              │ HTTP Requests
                              ▼
                  ┌───────────────────────┐
                  │    FastAPI Backend    │
                  │     (Uvicorn Web)     │
                  └───────────┬───────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
   ┌───────────────────────┐     ┌───────────────────────┐
   │      PostgreSQL       │     │      Redis Queue      │
   │    (Database State)   │     │    (Dramatiq Broker)  │
   └───────────────────────┘     └───────────┬───────────┘
                                             │ Task Dispatch
                                             ▼
                                 ┌───────────────────────┐
                                 │    Dramatiq Worker    │
                                 │   (Background Jobs)   │
                                 └───────────────────────┘
```

1. **Frontend (UI)**: Built with **React** and **Vite**. Features a modern dark-slate glassmorphism dashboard that displays live order statuses by polling the API and rendering glowing multi-step progress steps.
2. **Backend API**: Built with **FastAPI** (Uvicorn). Serves order endpoints, writes initial states to the DB, and dispatches background work to the queue.
3. **Background Worker**: Built with **Dramatiq** and **Redis**. Processes incoming orders asynchronously and records state updates (`PENDING` ➡️ `PROCESSING` ➡️ `COMPLETED`/`FAILED`) in the database.
4. **Database**: **PostgreSQL** handles persistent storage of all orders.

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure **Docker** and **Docker Compose** are installed, and create the shared network:
```bash
docker network create shared-net
```

### Running with Docker Compose & Makefiles

#### 1. Start the Backend Stack
Navigate to the backend and spin up PostgreSQL, Redis, FastAPI, and the Dramatiq worker:
```bash
cd Backend
cp .env.sample .env  # Copy default credentials
make build
make up
```

#### 2. Start the Frontend UI
In a new terminal window, navigate to the UI and spin up the web client:
```bash
cd UI
cp .env.sample .env  # Copy default endpoint
make build
make up
```

Open your browser and navigate to **[http://localhost:5174](http://localhost:5174)** to place orders and track processing states live!

---

## 📂 Project Structure

```
apps/
├── Backend/          # FastAPI API, SQLAlchemy DB models, Dramatiq workers
└── UI/               # React + Vite frontend, Nginx static config
```
