from fastapi import APIRouter

from app.services.follett_service import (
    get_follett_access_token,
    get_follett_status,
    get_follett_sites,
    get_secondary_lrc_site,
    search_self_service_titles,
    get_cdl_tenants,
    search_cdl_titles,
    get_follett_patron,
    get_follett_site_patron,
    get_follett_locations,
    get_follett_resources_by_type,
    get_follett_patron_circulation_status
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
async def test_self_service_titles(
    search: str = "dragon",
    principal_id: str | None = None,
    site_id: str | None = None
):
    titles = await search_self_service_titles(
        search=search,
        limit=10,
        principal_id_override=principal_id,
        site_id_override=site_id
    )

    return {
        "status": "ok",
        "message": "Títulos de Self-Service consultados correctamente",
        "search": search,
        "site_id_used": site_id or "valor configurado en .env",
        "principal_id_used": principal_id or "valor configurado en .env",
        "titles": titles
    }

@router.get("/cdl/tenants")
async def test_cdl_tenants():
    tenants = await get_cdl_tenants()

    return {
        "status": "ok",
        "message": "Tenants de CDL consultados correctamente",
        "tenants": tenants
    }


@router.get("/cdl/search")
async def test_cdl_search(
    tenant_id: str,
    keywords: str = "dragon"
):
    results = await search_cdl_titles(
        tenant_id=tenant_id,
        keywords=keywords,
        max_results=10
    )

    return {
        "status": "ok",
        "message": "Búsqueda CDL consultada correctamente",
        "tenant_id": tenant_id,
        "keywords": keywords,
        "results": results
    }

@router.get("/patrons/{patron_id}")
async def test_follett_patron(patron_id: str):
    patron = await get_follett_patron(patron_id)

    return {
        "status": "ok",
        "message": "Patron consultado correctamente",
        "patron_id": patron_id,
        "patron": patron
    }


@router.get("/sites/{site_id}/patrons/{patron_id}")
async def test_follett_site_patron(site_id: str, patron_id: str):
    patron = await get_follett_site_patron(
        site_id=site_id,
        patron_id=patron_id
    )

    return {
        "status": "ok",
        "message": "Patron del sitio consultado correctamente",
        "site_id": site_id,
        "patron_id": patron_id,
        "patron": patron
    }

@router.get("/locations")
async def test_follett_locations():
    locations = await get_follett_locations()

    return {
        "status": "ok",
        "message": "Locations de Follett consultadas correctamente",
        "locations": locations
    }

@router.get("/resources/types/{resource_type_id}/resources")
async def test_follett_resources_by_type(resource_type_id: str):
    resources = await get_follett_resources_by_type(resource_type_id)

    return {
        "status": "ok",
        "message": "Recursos por tipo consultados correctamente",
        "resource_type_id": resource_type_id,
        "resources": resources
    }

@router.get("/circulation/patrons/{patron_id}/status")
async def test_follett_patron_circulation_status(patron_id: str):
    circulation_status = await get_follett_patron_circulation_status(patron_id)

    return {
        "status": "ok",
        "message": "Estado de circulación del patron consultado correctamente",
        "patron_id": patron_id,
        "circulation_status": circulation_status
    }