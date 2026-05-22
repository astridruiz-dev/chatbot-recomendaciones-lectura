from fastapi import APIRouter

from app.schemas.chat_schema import (
    ChatRequestSchema,
    ChatResponseSchema
)

router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Chat"]
)


@router.post(
    "/",
    response_model=ChatResponseSchema,
    status_code=200
)
def chat_endpoint(request: ChatRequestSchema):

    user_message = request.message.lower()

    if "guerra" in user_message:

        return {
            "response":
            "Te recomiendo explorar libros relacionados con guerra y memoria histórica."
        }

    if "ficción" in user_message:

        return {
            "response":
            "La biblioteca tiene varias opciones de ficción disponibles."
        }

    return {
        "response":
        "No encontré una recomendación específica todavía."
    }