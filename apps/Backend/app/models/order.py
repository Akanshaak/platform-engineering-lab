from sqlalchemy import Column, Integer, String
from app.database.db import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String, default="PENDING")
