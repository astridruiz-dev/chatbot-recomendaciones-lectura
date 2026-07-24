from fastapi import APIRouter

from app.services.follett_service import (
    get_follett_access_token,
    get_follett_status,
    get_follett_sites,
    get_secondary_lrc_site,
    search_self_service_titles
)

router = APIRouter(
    prefix="/follett",
    tags=["Follett"]
)


@router.get("/test-token")
async def test_follett_token():
    access_token = await get_follett_access_token()

    return {
        "status": "ok",
        "message": "Token de Follett obtenido correctamente",
        "token_preview": f"{access_token[:10]}..."
    }


@router.get("/status")
async def test_follett_status():
    status_data = await get_follett_status()

    return {
        "status": "ok",
        "message": "Status de Follett consultado correctamente",
        "follett_status": status_data
    }


@router.get("/sites")
async def test_follett_sites():
    sites = await get_follett_sites()

    return {
        "status": "ok",
        "message": "Sites de Follett consultados correctamente",
        "sites": sites
    }

@router.get("/sites/secondary-lrc")
async def test_secondary_lrc_site():
    site = await get_secondary_lrc_site()

    return {
        "status": "ok",
        "message": "Site de secundaria LRC consultado correctamente",
        "site": site
    }

@router.get("/self-service/titles")
async def test_self_service_titles(search: str = "dragon"):
    titles = await search_self_service_titles(search=search, limit=10)

    return {
        "status": "ok",
        "message": "Títulos de Self-Service consultados correctamente",
        "search": search,
        "titles": titles
    }