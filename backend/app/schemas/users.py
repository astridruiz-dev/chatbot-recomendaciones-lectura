from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    language: str


class UserResponse(BaseModel):
    id: int
    email: str
    graduation_year: int | None = None
    grade: str | None = None
    language: str
    is_staff: bool

    class Config:
        from_attributes = True