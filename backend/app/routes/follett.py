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
    tags=["Follett - Experimental"]
)


# -------------------------------------------------------------------
# Rutas temporales de exploración técnica con Follett Destiny.
#
# Estas rutas NO forman parte del flujo final del MVP.
# Se conservaron como evidencia técnica de las pruebas realizadas
# durante la investigación de integración con Follett.
#
# La integración real quedó pendiente porque los endpoints de catálogo
# y Self-Service requieren permisos/autenticación externos adicionales.
# -------------------------------------------------------------------


@router.get(
    "/test-token",
    summary="Experimental: probar token de Follett",
    description="Ruta temporal para validar si el backend puede obtener un access token de Follett Destiny. No forma parte del flujo final del MVP."
)
async def test_follett_token():
    access_token = await get_follett_access_token()

    return {
        "status": "experimental_ok",
        "message": "Token de Follett obtenido correctamente. Ruta temporal de exploración técnica.",
        "token_preview": f"{access_token[:10]}..."
    }


@router.get(
    "/status",
    summary="Experimental: consultar status de Follett",
    description="Ruta temporal para verificar conectividad general con Follett Destiny."
)
async def test_follett_status():
    status_data = await get_follett_status()

    return {
        "status": "experimental_ok",
        "message": "Status de Follett consultado correctamente. Ruta temporal de exploración técnica.",
        "follett_status": status_data
    }


@router.get(
    "/sites",
    summary="Experimental: consultar sitios de Follett",
    description="Ruta temporal para listar sites disponibles en Follett Destiny y ubicar el LRC correspondiente."
)
async def test_follett_sites():
    sites = await get_follett_sites()

    return {
        "status": "experimental_ok",
        "message": "Sites de Follett consultados correctamente. Ruta temporal de exploración técnica.",
        "sites": sites
    }


@router.get(
    "/sites/secondary-lrc",
    summary="Experimental: consultar site Secondary LRC",
    description="Ruta temporal para validar el site identificado como Secondary LRC dentro de Follett Destiny."
)
async def test_secondary_lrc_site():
    site = await get_secondary_lrc_site()

    return {
        "status": "experimental_ok",
        "message": "Site de secundaria LRC consultado correctamente. Ruta temporal de exploración técnica.",
        "site": site
    }


@router.get(
    "/self-service/titles",
    summary="Experimental: probar títulos Self-Service",
    description="Ruta temporal para explorar el endpoint Self-Service de títulos. No forma parte del flujo final porque requiere autenticación/permisos adicionales."
)
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
        "status": "experimental_ok",
        "message": "Consulta experimental de títulos Self-Service ejecutada.",
        "search": search,
        "site_id_used": site_id or "valor configurado en .env",
        "principal_id_used": principal_id or "valor configurado en .env",
        "titles": titles
    }


@router.get(
    "/cdl/tenants",
    summary="Experimental: consultar tenants CDL",
    description="Ruta temporal para explorar disponibilidad de tenants en CDL."
)
async def test_cdl_tenants():
    tenants = await get_cdl_tenants()

    return {
        "status": "experimental_ok",
        "message": "Tenants de CDL consultados correctamente. Ruta temporal de exploración técnica.",
        "tenants": tenants
    }


@router.get(
    "/cdl/search",
    summary="Experimental: búsqueda CDL",
    description="Ruta temporal para probar búsqueda CDL con tenant_id. No forma parte del flujo final del MVP."
)
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
        "status": "experimental_ok",
        "message": "Búsqueda CDL consultada correctamente. Ruta temporal de exploración técnica.",
        "tenant_id": tenant_id,
        "keywords": keywords,
        "results": results
    }


@router.get(
    "/patrons/{patron_id}",
    summary="Experimental: consultar patron",
    description="Ruta temporal para probar consulta de patrons en Follett Destiny."
)
async def test_follett_patron(patron_id: str):
    patron = await get_follett_patron(patron_id)

    return {
        "status": "experimental_ok",
        "message": "Patron consultado correctamente. Ruta temporal de exploración técnica.",
        "patron_id": patron_id,
        "patron": patron
    }


@router.get(
    "/sites/{site_id}/patrons/{patron_id}",
    summary="Experimental: consultar patron por site",
    description="Ruta temporal para probar consulta de patrons dentro de un site específico."
)
async def test_follett_site_patron(site_id: str, patron_id: str):
    patron = await get_follett_site_patron(
        site_id=site_id,
        patron_id=patron_id
    )

    return {
        "status": "experimental_ok",
        "message": "Patron del sitio consultado correctamente. Ruta temporal de exploración técnica.",
        "site_id": site_id,
        "patron_id": patron_id,
        "patron": patron
    }


@router.get(
    "/locations",
    summary="Experimental: consultar locations",
    description="Ruta temporal para revisar locations disponibles en Follett Destiny."
)
async def test_follett_locations():
    locations = await get_follett_locations()

    return {
        "status": "experimental_ok",
        "message": "Locations de Follett consultadas correctamente. Ruta temporal de exploración técnica.",
        "locations": locations
    }


@router.get(
    "/resources/types/{resource_type_id}/resources",
    summary="Experimental: consultar recursos por tipo",
    description="Ruta temporal para probar recursos por tipo dentro de Follett Destiny."
)
async def test_follett_resources_by_type(resource_type_id: str):
    resources = await get_follett_resources_by_type(resource_type_id)

    return {
        "status": "experimental_ok",
        "message": "Recursos por tipo consultados correctamente. Ruta temporal de exploración técnica.",
        "resource_type_id": resource_type_id,
        "resources": resources
    }


@router.get(
    "/circulation/patrons/{patron_id}/status",
    summary="Experimental: consultar estado de circulación",
    description="Ruta temporal para probar estado de circulación de un patron en Follett Destiny."
)
async def test_follett_patron_circulation_status(patron_id: str):
    circulation_status = await get_follett_patron_circulation_status(patron_id)

    return {
        "status": "experimental_ok",
        "message": "Estado de circulación del patron consultado correctamente. Ruta temporal de exploración técnica.",
        "patron_id": patron_id,
        "circulation_status": circulation_status
    }