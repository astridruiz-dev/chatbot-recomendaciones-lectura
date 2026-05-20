from pydantic import BaseModel, Field
from typing import Optional, List


class BookSchema(BaseModel):

    id: int

    title: str = Field(
        ...,
        min_length=2,
        max_length=150,
        description="Título del libro"
    )

    author: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Autor del libro"
    )

    language: str = Field(
        ...,
        min_length=2,
        max_length=30,
        description="Idioma del libro"
    )

    publication_year: int = Field(
        ...,
        ge=1900,
        le=2030,
        description="Año de publicación"
    )

    fiction: bool = Field(
        ...,
        description="Indica si el libro es ficción"
    )

    themes: List[str] = Field(
    ...,
    description="Temas principales"
)

    reading_level: str = Field(
        ...,
        min_length=1,
        max_length=30,
        description="Nivel lector"
    )

    recommended_age: int = Field(
        ...,
        ge=5,
        le=18,
        description="Edad recomendada"
    )

    pages: int = Field(
        ...,
        ge=1,
        le=5000,
        description="Cantidad de páginas"
    )

    available: bool = Field(
        ...,
        description="Disponibilidad del libro"
    )

    summary: Optional[str] = Field(
        None,
        max_length=1000,
        description="Resumen del libro"
    )