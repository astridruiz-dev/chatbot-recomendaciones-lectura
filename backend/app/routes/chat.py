from fastapi import APIRouter

from app.schemas.chat_schema import (
    ChatRequestSchema,
    ChatResponseSchema
)

from app.routes.books import books_db
from app.services.recommendation_service import calculate_book_score


router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Chat"]
)

conversation_history = []

@router.post(
    "/",
    response_model=ChatResponseSchema,
    status_code=200
)
def chat_endpoint(request: ChatRequestSchema):

    user_message = request.message.lower()

    language = request.language
    reading_level = request.reading_level

    filters = {

    "keyword": None,
    "author": None,
    "language": language,
    "fiction": None,
    "reading_level": reading_level,
    "themes": None
}

    # Detectar temas simples
    if "war" in user_message or "guerra" in user_message:
        filters["themes"] = "War"

    if "violence" in user_message or "violencia" in user_message:
        filters["themes"] = "Violence"

    if "memory" in user_message or "memoria" in user_message:
        filters["themes"] = "Memory"

    recommendations = []

    for book in books_db:
        score = calculate_book_score(book, filters)
        if score > 0:
           recommendations.append({
            "title": book["title"],
            "author": book["author"],
            "themes": book["themes"],
            "reading_level": book["reading_level"],
            "score": score,
            "available": book["available"]
        })

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )
    if recommendations:
        books_text = ", ".join([book["title"] for book in recommendations])

        if language == "English":
            bot_response = (
                f"Based on your interests, you might enjoy: {books_text}."
            )
        else:
            bot_response = (
                f"Según tus intereses, podría gustarte: {books_text}."
            )

        conversation_history.append({
            "user": request.message,
            "bot": bot_response
        })

        return {
            "response": bot_response,
            "books": recommendations
        }

    # No recommendations found
    if language == "English":
        bot_response = (
            "I couldn't find an exact match, but you can try searching by themes or authors."
        )
    else:
        bot_response = (
            "No encontré una coincidencia exacta, pero puedes intentar buscar por temas o autores."
        )

    conversation_history.append({
        "user": request.message,
        "bot": bot_response
    })

    return {
        "response": bot_response,
        "books": []
    }

