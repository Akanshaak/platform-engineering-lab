import dramatiq
from dramatiq.brokers.redis import RedisBroker
import time
from redis import Redis
import os

redis_host = os.getenv("REDIS_HOST", "redis")
redis_port = int(os.getenv("REDIS_PORT", 6379))

# Configure Dramatiq to use the Redis Broker
broker = RedisBroker(host=redis_host, port=redis_port)
dramatiq.set_broker(broker)

redis_client = Redis(
    host=redis_host,
    port=redis_port,
    db=0
)

from app.database.db import SessionLocal
from app.models.order import Order

@dramatiq.actor
def process_order(order_id):
    db = SessionLocal()
    try:
        # Fetch the order from the database
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            print(f"Order {order_id} not found in database.")
            return

        # Update status to PROCESSING
        order.status = "PROCESSING"
        db.commit()
        db.refresh(order)
        print(f"Processing order: {order_id}")

        # Simulate order processing logic (e.g. payment, billing, logistics)
        time.sleep(5)

        # Update status to COMPLETED
        order.status = "COMPLETED"
        db.commit()
        print(f"Completed order: {order_id}")

    except Exception as e:
        print(f"Error processing order {order_id}: {str(e)}")
        # Update status to FAILED in case of any system/processing errors
        try:
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                order.status = "FAILED"
                db.commit()
        except Exception as db_err:
            print(f"Failed to set status to FAILED for order {order_id}: {str(db_err)}")
    finally:
        # Ensure session is always closed
        db.close()
