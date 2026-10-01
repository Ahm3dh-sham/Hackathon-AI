import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Text, DateTime, JSON
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Adjust sqlite connect_args if needed
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BlueprintModel(Base):
    __tablename__ = "blueprints"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    problem_statement = Column(Text, nullable=False)
    problem_analysis = Column(JSON, nullable=True)
    product_spec = Column(JSON, nullable=True)
    technical_architecture = Column(JSON, nullable=True)
    status = Column(String(50), default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
