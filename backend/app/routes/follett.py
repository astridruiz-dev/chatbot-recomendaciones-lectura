from fastapi import APIRouter

from app.services.follett_service import (
    get_follett_access_token,
    get_follett_status,
    get_follett_locations,
    get_follett_sites,
    get_secondary_resource_items,
    get_resource_items_without_site_filter,
    get_cdl_tenants,
    get_resource_types,
    get_resources_by_type
)

router = APIRouter(
    prefix="/follett",
    tags=["Follett"],
)


@router.get("/sites")
async def test_follett_sites():
    sites_data = await get_follett_sites(product_types=["library", "resource"])

    return {
        "status": "ok",
        "message": "Sites de Follett consultados correctamente",
        "sites": sites_data,
    }

@router.get("/secondary/items")
async def test_secondary_items():
    items_data = await get_secondary_resource_items(limit=10)

    return {
        "status": "ok",
        "message": "Ítems de Secundaria consultados correctamente",
        "items": items_data
    }


@router.get("/test-token")
async def test_follett_token():
    access_token = await get_follett_access_token()

    return {
        "status": "ok",
        "message": "Token de Follett obtenido correctamente",
        "token_preview": f"{access_token[:10]}...",
    }


@router.get("/status")
async def test_follett_status():
    status_data = await get_follett_status()

    return {
        "status": "ok",
        "message": "Status de Follett consultado correctamente",
        "follett_status": status_data,
    }

@router.get("/locations")
async def test_follett_locations():
    locations_data = await get_follett_locations()

    return {
        "status": "ok",
        "message": "Locations de Follett consultadas correctamente",
        "locations": locations_data
    }

@router.get("/items/sample")
async def test_items_sample():
    items_data = await get_resource_items_without_site_filter(limit=5)

    return {
        "status": "ok",
        "message": "Muestra de ítems de Follett consultada correctamente",
        "items": items_data
    }

@router.get("/cdl/tenants")
async def test_cdl_tenants():
    tenants_data = await get_cdl_tenants()

    return {
        "status": "ok",
        "message": "Tenants de CDL consultados correctamente",
        "tenants": tenants_data
    }

@router.get("/resources/types")
async def test_resource_types():
    resource_types = await get_resource_types()

    return {
        "status": "ok",
        "message": "Tipos de recursos consultados correctamente",
        "resource_types": resource_types
    }

@router.get("/resources/types/{resource_type}/resources")
async def test_resources_by_type(resource_type: str):
    resources = await get_resources_by_type(resource_type, limit=10)

    return {
        "status": "ok",
        "message": "Recursos por tipo consultados correctamente",
        "resources": resources
    }