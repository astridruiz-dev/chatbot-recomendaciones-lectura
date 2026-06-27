import os

from dotenv import load_dotenv
from fastapi import HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token


load_dotenv()


def verify_google_token(credential: str) -> str:
    google_client_id = os.getenv("GOOGLE_CLIENT_ID")

    if not google_client_id:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_ID no está configurado en el backend"
        )

    try:
        token_info = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            google_client_id
        )

        email = token_info.get("email")
        email_verified = token_info.get("email_verified")

        if not email or not email_verified:
            raise HTTPException(
                status_code=401,
                detail="No se pudo verificar el correo de Google"
            )

        return email

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Token de Google inválido"
        )