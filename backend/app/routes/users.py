from fastapi import APIRouter
from fastapi import HTTPException

from app.schemas.users import UserCreate
from app.models.user import User
from app.core.database import SessionLocal
from app.services.user_utils import extract_graduation_year
from app.services.user_utils import calculate_grade


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)

INSTITUTIONAL_DOMAIN = "@abc-net.edu.sv"


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
        email = user.email.strip().lower()

        if not email.endswith(INSTITUTIONAL_DOMAIN):
            raise HTTPException(
                status_code=400,
                detail="Solo se permiten correos institucionales @abc-net.edu.sv"
            )

        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Este correo institucional ya está registrado"
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

        new_user = User(
            email=email,
            graduation_year=graduation_year,
            grade=grade,
            language=user.language,
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

    finally:
        db.close()

