from pydantic import BaseModel, Field


class ChatRequestSchema(BaseModel):

    message: str = Field(
        ...,
        min_length=2,
        max_length=500,
        description="Mensaje del usuario"
    )


class ChatResponseSchema(BaseModel):

    response: str

    books: list = []