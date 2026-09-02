from datetime import datetime
from pydantic import BaseModel


class ReadingListItemCreate(BaseModel):
    user_email: str | None = None

    book_id: str
    title: str
    author: str | None = None

    language: str | None = None
    pages: int | None = None
    length: str | None = None

    available: bool | None = True
    sublocation: str | None = None
    call_number: str | None = None
    isbn: str | None = None

    summary: str | None = None
    cover_emoji: str | None = None
    cover_url: str | None = None
    destiny_url: str | None = None


class ReadingListItemResponse(BaseModel):
    id: int
    user_email: str

    book_id: str
    title: str
    author: str | None = None

    language: str | None = None
    pages: int | None = None
    length: str | None = None

    available: bool | None = True
    sublocation: str | None = None
    call_number: str | None = None
    isbn: str | None = None

    summary: str | None = None
    cover_emoji: str | None = None
    cover_url: str | None = None
    destiny_url: str | None = None

    added_at: datetime

    model_config = {
        "from_attributes": True
    }