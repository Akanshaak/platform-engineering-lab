from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.models.order import Order

from tasks.order_tasks import process_order

router = APIRouter()

class OrderRequest(BaseModel):
    product: str
    quantity: int

@router.post("/orders")
def create_order(order: OrderRequest):

    db: Session = SessionLocal()

    new_order = Order(
        product=order.product,
        quantity=order.quantity,
        status="PENDING"
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    process_order.send(new_order.id)

    return {
        "message": "Order created",
        "order_id": new_order.id
    }

@router.get("/orders/{order_id}")
def get_order(order_id: int):

    db: Session = SessionLocal()

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        return {"error": "Order not found"}

    return {
        "id": order.id,
        "product": order.product,
        "quantity": order.quantity,
        "status": order.status
    }
