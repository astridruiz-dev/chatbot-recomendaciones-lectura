from fastapi import APIRouter

from app.services.follett_service import (
    get_follett_configuration,
    test_follett_connection
)

router = APIRouter(
    prefix="/follett",
    tags=["Follett"]
)


@router.get("/config")
def get_configuration():

    config = get_follett_configuration()

    return {
        "base_url": config["base_url"],
        "client_id": config["client_id"],
        "status": "Configuration loaded successfully"
    }

@router.get("/test")
def test_connection():

    """
    Simula una conexión con la API de Follett.
    """

    return test_follett_connection()