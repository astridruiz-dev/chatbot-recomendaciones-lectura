from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.users import UserCreate
from app.schemas.users import GoogleLoginRequest
from app.models.user import User
from app.core.database import SessionLocal
from app.services.user_utils import extract_graduation_year
from app.services.user_utils import calculate_grade
from app.services.google_auth_service import verify_google_token
from app.core.security import create_access_token


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)

INSTITUTIONAL_DOMAIN = "@abc-net.edu.sv"


def save_or_update_user(db, email: str, language: str):
    email = email.strip().lower()

    if not email.endswith(INSTITUTIONAL_DOMAIN):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten correos institucionales @abc-net.edu.sv"
        )

    graduation_year = extract_graduation_year(
        email
    )

    is_staff = graduation_year is None

    grade = None

    if graduation_year:
        grade = calculate_grade(
            graduation_year
        )

        if grade is None:
            raise HTTPException(
                status_code=400,
                detail="El año de graduación no corresponde a un grado activo"
            )

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        existing_user.graduation_year = graduation_year
        existing_user.grade = grade
        existing_user.language = language
        existing_user.is_staff = is_staff

        db.commit()
        db.refresh(existing_user)

        return {
            "message": "Usuario actualizado correctamente",
            "id": existing_user.id,
            "email": existing_user.email,
            "graduation_year": existing_user.graduation_year,
            "grade": existing_user.grade,
            "language": existing_user.language,
            "is_staff": existing_user.is_staff
        }

    new_user = User(
        email=email,
        graduation_year=graduation_year,
        grade=grade,
        language=language,
        is_staff=is_staff
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Usuario guardado correctamente",
        "id": new_user.id,
        "email": new_user.email,
        "graduation_year": new_user.graduation_year,
        "grade": new_user.grade,
        "language": new_user.language,
        "is_staff": new_user.is_staff
    }


@router.get("/")
def get_users():
    db = SessionLocal()

    try:
        users = db.query(User).all()
        return users

    finally:
        db.close()


@router.post("/register")
def register_user(user: UserCreate):
    db = SessionLocal()

    try:
        return save_or_update_user(
            db,
            user.email,
            user.language
        )

    finally:
        db.close()


@router.post("/google-login")
def google_login(login_data: GoogleLoginRequest):
    db = SessionLocal()

    try:
        email = verify_google_token(
            login_data.credential
        )

        user = save_or_update_user(
            db,
            email,
            login_data.language
        )

        access_token = create_access_token(
            data={
                "sub": user["email"],
                "is_staff": user["is_staff"],
                "grade": user["grade"]
            }
        )

        return {
            "user": user,
            "access_token": access_token,
            "token_type": "bearer"
        }

    finally:
        db.close()