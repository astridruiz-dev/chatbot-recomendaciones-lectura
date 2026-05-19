from fastapi import APIRouter, Query

from app.services.recommendation_service import calculate_book_score
from app.schemas.recommendation_schema import RecommendationResponseSchema


router = APIRouter(
    prefix="/api/v1/recommendations",
    tags=["Recommendations"]
)

# Base de datos temporal
books_db = [
    {
        "id": 1,
        "title": "Maus",
        "author": "Art Spiegelman",
        "theme": "war",
        "recommended_age": 15,
        "available": True
    },
    {
        "id": 2,
        "title": "Harry Potter",
        "author": "J.K. Rowling",
        "theme": "magic",
        "recommended_age": 12,
        "available": True
    },
    {
        "id": 3,
        "title": "Un día en la vida",
        "author": "Manlio Argueta",
        "theme": "social conflict",
        "recommended_age": 16,
        "available": False
    }
]


@router.get(
    "/",
    response_model=RecommendationResponseSchema,
    status_code=200
)
def recommend_books(
    keyword: str = Query(None, description="Palabra clave"),
    recommended_age: int = Query(None, ge=5, le=18)
):

    scored_books = []

    for book in books_db:

        score = calculate_book_score(
            book,
            keyword,
            recommended_age
        )

        if score > 0:
            scored_books.append({
                "book": book,
                "score": score
            })

    scored_books.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "recommendations": scored_books
    }