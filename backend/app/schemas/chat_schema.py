from pydantic import BaseModel, Field


class ChatRequestSchema(BaseModel):

    message: str = Field(
        ...,
        min_length=2,
        max_length=500,
        description="Mensaje del usuario"
    )

    language: str = Field(
        default="Spanish",
        description="Idioma seleccionado"
    )

    reading_level: str = Field(
        default="11° grado",
        description="Nivel lector"
    )


class ChatResponseSchema(BaseModel):

    response: str

    books: list = []