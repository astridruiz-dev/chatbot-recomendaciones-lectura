from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)

    graduation_year = Column(Integer, nullable=True)
    grade = Column(String, nullable=True)

    language = Column(String, nullable=False)
    is_staff = Column(Boolean, default=False)