from fastapi import APIRouter, Query

from app.services.recommendation_service import get_recommendation_response

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/")
async def list_recommendations(
    search: str | None = Query(default=None, description="Texto de búsqueda: título, autor, tema o resumen"),
    grade: str | None = Query(default=None, description="Grado del estudiante, por ejemplo: 6, 7, 8, 9, 10, 11, 12"),
    language: str | None = Query(default=None, description="Idioma: English o Español"),
    category: str | None = Query(default=None, description="Categoría de lectura"),
    length: str | None = Query(default=None, description="Longitud: Corto, Medio o Largo"),
    available: bool | None = Query(default=None, description="Filtrar solo disponibles o no disponibles"),
    sublocation: str | None = Query(default=None, description="Sublocation del LRC")
):
   return get_recommendation_response(
    search=search,
    grade=grade,
    language=language,
    category=category,
    length=length,
    available=available,
    sublocation=sublocation
)