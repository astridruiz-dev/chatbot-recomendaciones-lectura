import os

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()


def get_follett_settings():
    base_url = os.getenv("FOLLETT_BASE_URL")
    api_base_path = os.getenv("FOLLETT_API_BASE_PATH")
    client_id = os.getenv("FOLLETT_CLIENT_ID")
    client_secret = os.getenv("FOLLETT_CLIENT_SECRET")

    missing_values = []

    if not base_url:
        missing_values.append("FOLLETT_BASE_URL")

    if not api_base_path:
        missing_values.append("FOLLETT_API_BASE_PATH")

    if not client_id:
        missing_values.append("FOLLETT_CLIENT_ID")

    if not client_secret:
        missing_values.append("FOLLETT_CLIENT_SECRET")

    if missing_values:
        raise HTTPException(
            status_code=500,
            detail=f"Faltan variables de entorno de Follett: {', '.join(missing_values)}"
        )

    return {
        "base_url": base_url.rstrip("/"),
        "api_base_path": api_base_path,
        "client_id": client_id,
        "client_secret": client_secret
    }


def get_follett_api_base_url():
    settings = get_follett_settings()
    return f"{settings['base_url']}{settings['api_base_path']}"


async def get_follett_access_token():
    settings = get_follett_settings()

    token_url = f"{settings['base_url']}{settings['api_base_path']}/auth/accessToken"

    payload = {
        "grant_type": "client_credentials",
        "client_id": settings["client_id"],
        "client_secret": settings["client_secret"]
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                token_url,
                data=payload,
                headers=headers
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail={
                    "message": "Follett rechazó la solicitud de token",
                    "follett_status_code": response.status_code,
                    "follett_response": response.text
                }
            )

        token_data = response.json()
        access_token = token_data.get("access_token")

        if not access_token:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Follett respondió, pero no devolvió access_token",
                    "follett_response": token_data
                }
            )

        return access_token

    except httpx.RequestError as error:
        raise HTTPException(
            status_code=502,
            detail=f"No se pudo conectar con Follett: {str(error)}"
        )


async def follett_get(endpoint_path: str, params: dict | None = None):
    access_token = await get_follett_access_token()
    api_base_url = get_follett_api_base_url()

    clean_endpoint_path = endpoint_path.strip("/")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{api_base_url}/{clean_endpoint_path}",
                headers=headers,
                params=params
            )

        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail={
                    "message": "No se pudo consultar el endpoint de Follett",
                    "endpoint": endpoint_path,
                    "follett_status_code": response.status_code,
                    "follett_response": response.text
                }
            )

        return response.json()

    except httpx.RequestError as error:
        raise HTTPException(
            status_code=502,
            detail=f"No se pudo conectar con Follett: {str(error)}"
        )


async def get_follett_status():
    return await follett_get("status")


async def get_follett_sites():
    return await follett_get("sites")

async def get_secondary_lrc_site():
    sites_data = await get_follett_sites()

    sites = sites_data.get("value", [])

    for site in sites:
        if site.get("siteId") == 101:
            return site

    raise HTTPException(
        status_code=404,
        detail="No se encontró el site de secundaria Academia Britanica Cuscatleca-LRC"
    )