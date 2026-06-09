import os
import requests

from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

FOLLETT_BASE_URL = os.getenv("FOLLETT_BASE_URL")
FOLLETT_CLIENT_ID = os.getenv("FOLLETT_CLIENT_ID")
FOLLETT_CLIENT_SECRET = os.getenv("FOLLETT_CLIENT_SECRET")
FOLLETT_TOKEN = os.getenv("FOLLETT_TOKEN")


def get_follett_configuration():


    """
    Obtiene la configuración del servicio Follett
    desde las variables de entorno.
    """

    return {
        "base_url": FOLLETT_BASE_URL,
        "client_id": FOLLETT_CLIENT_ID,
        "client_secret": FOLLETT_CLIENT_SECRET,
        "token": FOLLETT_TOKEN
    }
def get_follett_headers():

    """
    Genera los encabezados necesarios para autenticarse
    con la API de Follett utilizando Bearer Token.
    """

    return {
        "Authorization": f"Bearer {FOLLETT_TOKEN}",
        "Content-Type": "application/json"
    }


def test_follett_connection():

    """
    Realiza una solicitud de prueba a una API externa para validar
    la arquitectura de integración.
    """

    try:

        response = requests.get(
            "https://jsonplaceholder.typicode.com/posts/1",
            timeout=10
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException as error:

        return {
            "status": "error",
            "message": str(error)
        }