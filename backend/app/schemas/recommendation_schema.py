from pydantic import BaseModel
from typing import List

from app.schemas.book_schema import BookSchema


class RecommendedBookSchema(BaseModel):

    book: BookSchema
    score: int


class RecommendationResponseSchema(BaseModel):

    recommendations: List[RecommendedBookSchema]