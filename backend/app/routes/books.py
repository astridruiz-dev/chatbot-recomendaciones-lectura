from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.schemas.book_schema import BookSchema

# Crear router
router = APIRouter(
    prefix="/api/v1/books",
    tags=["Books"]
)

# Base de datos temporal
books_db = [
    {
        "id": 1,
        "title": "Maus",
        "author": "Art Spiegelman",
        "language": "English",
        "publication_year": 1991,
        "fiction": True,
        "themes": ["Holocaust", "War", "Memory"],
        "reading_level": "Advanced",
        "recommended_age": 16,
        "pages": 296,
        "available": True,
        "summary": "Graphic novel about Holocaust survival."
    },
    {
        "id": 2,
        "title": "Un día en la vida",
        "author": "Manlio Argueta",
        "language": "Spanish",
        "publication_year": 1980,
        "fiction": True,
        "themes": ["Violence", "Social injustice"],
        "reading_level": "Intermediate",
        "recommended_age": 15,
        "pages": 180,
        "available": False,
        "summary": "Novel about daily life during repression."
    }
]

# Obtener todos los libros
@router.get(
    "/",
    response_model=List[BookSchema],
    status_code=200
)
def get_books():

  return books_db
# Obtener libro por ID
@router.get(
    "/{book_id}",
    response_model=BookSchema,
    status_code=200
)

def get_book(book_id: int):

    for book in books_db:

        if book["id"] == book_id:

            return book

    raise HTTPException(
    status_code=404,
    detail="Libro no encontrado"
)

# Buscar libros
@router.get(
    "/search/",
    response_model=List[BookSchema],
    status_code=200
)
def search_books(

    keyword: str | None = Query(
        None,
        description="Palabra clave"
    ),

    author: str | None = Query(
        None,
        description="Autor del libro"
    ),

    language: str | None = Query(
        None,
        description="Idioma"
    ),

    fiction: bool | None = Query(
        None,
        description="Ficción o no ficción"
    ),

    recommended_age: int | None = Query(
        None,
        ge=5,
        le=18,
        description="Edad recomendada"
    ),

    reading_level: str | None = Query(
        None,
        description="Nivel lector"
    )
):

    results = []

    for book in books_db:

        if keyword:

            keyword_match = (
                keyword.lower() in book["title"].lower()
                or keyword.lower() in book["summary"].lower()
                or any(
                    keyword.lower() in theme.lower()
                    for theme in book["themes"]
                )
            )

            if not keyword_match:
                continue

        if author:

            if author.lower() not in book["author"].lower():
                continue

        if language:

            if language.lower() != book["language"].lower():
                continue

        if fiction is not None:

            if fiction != book["fiction"]:
                continue

        if recommended_age:

            if recommended_age != book["recommended_age"]:
                continue

        if reading_level:

            if reading_level.lower() != book["reading_level"].lower():
                continue

        results.append(book)

    return results