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
    principal_id = os.getenv("FOLLETT_PRINCIPAL_ID")
    secondary_site_id = os.getenv("FOLLETT_SECONDARY_SITE_ID", "101")

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
        "client_secret": client_secret,
        "principal_id": principal_id,
        "secondary_site_id": secondary_site_id
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

async def search_self_service_titles(
    search: str = "dragon",
    limit: int = 10,
    principal_id_override: str | None = None,
    site_id_override: str | None = None
):
    settings = get_follett_settings()

    principal_id = principal_id_override or settings.get("principal_id")
    site_id = site_id_override or settings.get("secondary_site_id", "101")

    if not principal_id:
        raise HTTPException(
            status_code=500,
            detail="FOLLETT_PRINCIPAL_ID no está configurado en backend/.env"
        )

    params = {
        "$search": search,
        "$top": limit,
        "includeAvailability": "true",
        "includeAllowedActions": "true",
        "materialType": "BOOK"
    }

    return await follett_get(
        f"sites/{site_id}/self/{principal_id}/materials/titles",
        params=params
    )

async def get_cdl_tenants():
    return await follett_get("cdl/tenants")


async def search_cdl_titles(tenant_id: str, keywords: str = "dragon", max_results: int = 10):
    params = {
        "keywords": keywords,
        "ddSearch": "true",
        "skipSubjects": "false",
        "maxResults": max_results
    }

    return await follett_get(
        f"cdl/tenants/{tenant_id}/search",
        params=params
    )

async def get_follett_patron(patron_id: str):
    return await follett_get(f"patrons/{patron_id}")


async def get_follett_site_patron(site_id: str, patron_id: str):
    return await follett_get(f"sites/{site_id}/patrons/{patron_id}")

async def get_follett_locations():
    return await follett_get("locations")

async def get_follett_resources_by_type(resource_type_id: str):
    return await follett_get(f"materials/resourcetypes/{resource_type_id}/resources")

async def get_follett_patron_circulation_status(patron_id: str):
    return await follett_get(f"circulation/patrons/{patron_id}/status")