# Backend API & Worker Service

This is the backend service for the Order Processing Platform. It is a high-performance Python application built with **FastAPI**, **SQLAlchemy**, **PostgreSQL**, **Redis**, and **Dramatiq** for background task execution.

---

## 🛠️ Technology Stack

* **API Framework**: FastAPI (running on Uvicorn)
* **ORM**: SQLAlchemy
* **Database**: PostgreSQL (handling order records)
* **Task Broker**: Redis
* **Worker Framework**: Dramatiq (asynchronous task runner)

---

## 📂 Directory Structure

```
Backend/
├── app/
│   ├── database/       # DB connection & Session Local configurations
│   ├── models/         # SQLAlchemy schemas (Order model)
│   ├── routes/         # REST endpoints (/orders and /orders/{id})
│   └── main.py         # FastAPI application entrypoint & CORS config
├── bin/
│   ├── dramatiq.sh     # Dramatiq container startup script
│   └── entrypoint.sh   # FastAPI container startup script
├── tasks/
│   └── order_tasks.py  # Dramatiq worker task declarations
├── Dockerfile          # Multi-stage image build
├── docker-compose.yml  # Local stack (FastAPI, Worker, DB, Redis)
├── Makefile            # Task runner shortcuts
└── requirements.txt    # Python dependencies
```

---

## ⚙️ Configuration & Environment

Environment variables are managed using a `.env` file (copied from `.env.sample`).

| Variable | Description | Local Default | Docker Default |
| :--- | :--- | :--- | :--- |
| `ENV` | Environment type (`DEVELOPMENT` / `PRODUCTION`) | `DEVELOPMENT` | `DEVELOPMENT` |
| `MODE` | Worker or Web execution mode | `DEVELOPMENT` | `DEVELOPMENT` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` (localhost) | `postgresql://...` (`db`) |
| `REDIS_HOST` | Redis broker host | `localhost` | `redis` |
| `REDIS_PORT` | Redis broker port | `6379` | `6379` |

---

## 🚀 Execution Instructions

### A. Running via Docker Compose (Recommended)
Verify you have created the shared docker network:
```bash
docker network create shared-net
```
Then use the built-in **Makefile** commands:
```bash
# Build the Docker image
make build

# Spin up Postgres, Redis, FastAPI, and Dramatiq Worker
make up

# Tail logs for all containers
make logs

# Stop and clean containers
make down
```

---

### B. Running Locally (Without Docker)
1. **Prerequisites**: Ensure you have local PostgreSQL and Redis servers running.
2. **Setup Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. **Configure Environment Variables**:
   ```bash
   cp .env.sample .env
   # Make sure DATABASE_URL and REDIS_HOST point to localhost
   ```
4. **Start Web Server**:
   ```bash
   uvicorn app.main:app --port 10100 --reload
   ```
5. **Start Dramatiq Worker** (in a separate terminal):
   ```bash
   source venv/bin/activate
   dramatiq tasks.order_tasks
   ```
