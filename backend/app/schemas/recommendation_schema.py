from pydantic import BaseModel

from app.schemas.book_schema import BookSchema


class RecommendationResponseSchema(BaseModel):

    book: BookSchema

    score: int

    recommendation_reason: str