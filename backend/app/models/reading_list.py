from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone


from app.core.database import Base


class ReadingListItem(Base):
    __tablename__ = "reading_list_items"

    id = Column(Integer, primary_key=True, index=True)

    user_email = Column(String, index=True, nullable=False)

    book_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    author = Column(String, nullable=True)

    language = Column(String, nullable=True)
    pages = Column(Integer, nullable=True)
    length = Column(String, nullable=True)

    available = Column(Boolean, default=True)
    sublocation = Column(String, nullable=True)
    call_number = Column(String, nullable=True)
    isbn = Column(String, nullable=True)

    summary = Column(String, nullable=True)
    cover_emoji = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    destiny_url = Column(String, nullable=True)

    added_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))