from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.orders import router as order_router

from app.database.db import engine
from app.models.order import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for the frontend UI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(order_router)

@app.get("/health")
def health():
    return {"status": "ok"}

