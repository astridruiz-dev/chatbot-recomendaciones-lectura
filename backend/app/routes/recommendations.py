from fastapi import APIRouter, Query
from typing import List

from app.routes.books import books_db
from app.services.recommendation_service import calculate_book_score

router = APIRouter(
    prefix="/api/v1/recommendations",
    tags=["Recommendations"]
)


@router.get("/")
def get_recommendations(

    keyword: str | None = Query(
        None,
        description="Palabra clave"
    ),

    author: str | None = Query(
        None,
        description="Autor"
    ),

    language: str | None = Query(
        None,
        description="Idioma"
    ),

    fiction: bool | None = Query(
        None,
        description="Ficción o no ficción"
    ),

    reading_level: str | None = Query(
        None,
        description="Nivel lector"
    ),

    theme: str | None = Query(
        None,
        description="Tema literario"
    )

):

    filters = {
        "keyword": keyword,
        "author": author,
        "language": language,
        "fiction": fiction,
        "reading_level": reading_level,
        "theme": theme
    }

    recommendations = []

    for book in books_db:

        score = calculate_book_score(
            book,
            filters
        )

        if score > 0:

            recommendations.append({
                "book": book,
                "score": score
            })

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return recommendations