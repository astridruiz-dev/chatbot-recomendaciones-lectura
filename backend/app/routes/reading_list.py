from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.reading_list import ReadingListItem
from app.core.security import get_current_user_payload
from app.schemas.reading_list import (
    ReadingListItemCreate,
    ReadingListItemResponse
)


router = APIRouter(
    prefix="/reading-list",
    tags=["Reading List"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.get(
    "/",
    response_model=list[ReadingListItemResponse]
)
def get_my_reading_list(
    current_user: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user_email = current_user["sub"]

    items = (
        db.query(ReadingListItem)
        .filter(ReadingListItem.user_email == user_email)
        .order_by(ReadingListItem.added_at.desc())
        .all()
    )

    return items

@router.get(
    "/{user_email}",
    response_model=list[ReadingListItemResponse]
)
def get_reading_list(
    user_email: str,
    db: Session = Depends(get_db)
):
    items = (
        db.query(ReadingListItem)
        .filter(ReadingListItem.user_email == user_email)
        .order_by(ReadingListItem.added_at.desc())
        .all()
    )

    return items


@router.post(
    "/",
    response_model=ReadingListItemResponse
)
def add_book_to_reading_list(
    item: ReadingListItemCreate,
    current_user: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user_email = current_user["sub"]

    existing_item = (
        db.query(ReadingListItem)
        .filter(
            ReadingListItem.user_email == user_email,
            ReadingListItem.book_id == item.book_id
        )
        .first()
    )

    if existing_item:
        return existing_item

    new_item = ReadingListItem(
       user_email=user_email,
        book_id=item.book_id,
        title=item.title,
        author=item.author,
        language=item.language,
        pages=item.pages,
        length=item.length,
        available=item.available,
        sublocation=item.sublocation,
        call_number=item.call_number,
        isbn=item.isbn,
        summary=item.summary,
        cover_emoji=item.cover_emoji,
        cover_url=item.cover_url,
        destiny_url=item.destiny_url
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item

@router.delete(
    "/{book_id}"
)
def remove_my_book_from_reading_list(
    book_id: str,
    current_user: dict = Depends(get_current_user_payload),
    db: Session = Depends(get_db)
):
    user_email = current_user["sub"]

    item = (
        db.query(ReadingListItem)
        .filter(
            ReadingListItem.user_email == user_email,
            ReadingListItem.book_id == book_id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="El libro no está en la lista de lectura del usuario"
        )

    db.delete(item)
    db.commit()

    return {
        "status": "ok",
        "message": "Libro eliminado de la lista de lectura",
        "book_id": book_id
    }

@router.delete(
    "/{user_email}/{book_id}"
)
def remove_book_from_reading_list(
    user_email: str,
    book_id: str,
    db: Session = Depends(get_db)
):
    item = (
        db.query(ReadingListItem)
        .filter(
            ReadingListItem.user_email == user_email,
            ReadingListItem.book_id == book_id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="El libro no está en la lista de lectura del usuario"
        )

    db.delete(item)
    db.commit()

    return {
        "status": "ok",
        "message": "Libro eliminado de la lista de lectura",
        "user_email": user_email,
        "book_id": book_id
    }