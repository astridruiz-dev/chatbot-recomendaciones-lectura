from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.schemas.recommendation_schema import RecommendationResponseSchema

from app.routes.books import books_db
from app.services.recommendation_service import calculate_book_score

router = APIRouter(
    prefix="/api/v1/recommendations",
    tags=["Recommendations"]
)


@router.get(
    "/",
    response_model=List[RecommendationResponseSchema],
    status_code=200,
    responses={
        400: {"description": "Solicitud inválida"},
        500: {"description": "Error interno del servidor"}
    }
)
def get_recommendations(
    keyword: str | None = Query(None, description="Palabra clave"),
    author: str | None = Query(None, description="Autor"),
    language: str | None = Query(None, description="Idioma"),
    fiction: bool | None = Query(None, description="Ficción o no ficción"),
    reading_level: str | None = Query(None, description="Nivel lector"),
    theme: str | None = Query(None, description="Tema literario")
):
    filters = {
        "keyword": keyword,
        "author": author,
        "language": language,
        "fiction": fiction,
        "reading_level": reading_level,
        "theme": theme
    }

    if not any([
        keyword,
        author,
        language,
        fiction is not None,
        reading_level,
        theme
    ]):
        raise HTTPException(
            status_code=400,
            detail="Debe proporcionar al menos un filtro"
        )

    recommendations = []

    for book in books_db:
        score = calculate_book_score(book, filters)

        if score > 0:
            # ✅ Todo este bloque debe estar indentado dentro del if
            recommendation_reason = []

            if keyword:
                recommendation_reason.append(
                    "El libro coincide con la búsqueda realizada"
                )

            if author:
                recommendation_reason.append(
                    "Coincide con el autor solicitado"
                )

            if language:
                recommendation_reason.append(
                    "Disponible en el idioma solicitado"
                )

            if reading_level:
                recommendation_reason.append(
                    "Adecuado para el nivel lector indicado"
                )

            if theme:
                recommendation_reason.append(
                    "Presenta afinidad con la temática solicitada"
                )

            if book["available"]:
                recommendation_reason.append(
                    "Actualmente disponible en biblioteca"
                )

            recommendations.append({
                "book": book,
                "score": score,
                "recommendation_reason": ", ".join(recommendation_reason)
            })

    # ✅ Fuera del for, pero dentro de la función
    recommendations.sort(key=lambda x: x["score"], reverse=True)

    return recommendations