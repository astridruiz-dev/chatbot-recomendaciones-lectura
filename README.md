# chatbot-recomendaciones-lectura

Chatbot EdTech de recomendaciones de lectura con FastAPI y React.

## Descripción del proyecto

Este proyecto consiste en un asistente de descubrimiento de libros para apoyar a estudiantes, staff y personal del LRC en la búsqueda de lecturas dentro del contexto de la biblioteca escolar.

El sistema permite buscar libros, recibir recomendaciones según intereses, idioma, grado y extensión, consultar detalles bibliográficos y guardar libros en una lista de lectura personal.

El MVP funciona actualmente con datos simulados locales, debido a que la integración real con Follett Destiny quedó pendiente por requerir permisos, autenticación o soporte adicional del proveedor/institución.

## Objetivo del MVP

Desarrollar una aplicación web funcional que permita a usuarios institucionales descubrir libros del LRC mediante búsquedas, recomendaciones guiadas y una lista personal de lectura.

El alcance del MVP es un asistente de descubrimiento de libros, no un chatbot generalista.

## Usuarios del sistema

El sistema contempla dos tipos principales de usuarios:

- Estudiantes: pueden buscar libros, recibir recomendaciones por grado e intereses, guardar libros en su lista de lectura y consultar su perfil.
- Staff y personal del LRC: pueden explorar colecciones del LRC y consultar detalles bibliográficos de los libros.

## Funcionalidades principales

- Login institucional con Google.
- Identificación de usuario estudiante o staff.
- Selección de idioma de búsqueda.
- Búsqueda de libros por título, autor o tema.
- Recomendaciones de lectura independiente.
- Recomendaciones por grado.
- Flujo “Sorpréndeme”.
- Exploración de colecciones del LRC.
- Vista de detalle del libro.
- Lista de lectura personal.
- Perfil de usuario.
- Cierre de sesión.
- Token propio de sesión para proteger solicitudes entre frontend y backend.

## Tecnologías utilizadas

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- JWT / python-jose
- Google Auth
- python-dotenv

### Frontend

- React
- Vite
- Tailwind CSS
- Google OAuth Provider
- JavaScript

### Control de versiones

- Git
- GitHub

## Estructura general del proyecto

```text
chatbot-recomendaciones-lectura/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── data/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## Variables de entorno

El proyecto utiliza archivos `.env` para separar configuración local, credenciales y URLs del código fuente.

Los archivos `.env` reales no deben subirse al repositorio.

### Backend

Crear el archivo:

```text
backend/.env
```

Ejemplo de variables necesarias:

```env
# Google Login
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# App session token
APP_SECRET_KEY=change-this-secret-key
APP_TOKEN_EXPIRE_MINUTES=120

# CORS
FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173

# Follett Destiny - experimental routes
FOLLETT_BASE_URL=https://your-follett-host
FOLLETT_API_BASE_PATH=/api/v1/rest/context/destiny
FOLLETT_CLIENT_ID=your-follett-client-id
FOLLETT_CLIENT_SECRET=your-follett-client-secret
FOLLETT_PRINCIPAL_ID=your-principal-id
FOLLETT_SECONDARY_SITE_ID=101
```

### Frontend

Crear el archivo:

```text
frontend/.env
```

Ejemplo de variables necesarias:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Seguridad de variables

Los archivos `.env` contienen valores reales y deben permanecer fuera de GitHub.

Los archivos `.env.example` sí se incluyen en el repositorio porque solo documentan las variables necesarias con valores de ejemplo.

```text
.env          = valores reales, no se sube
.env.example  = plantilla, sí se sube
```

## Ejecución local del backend

Desde la raíz del proyecto:

```powershell
cd backend
```

Crear entorno virtual:

```powershell
py -m venv ..\.venv
```

Activar entorno virtual en PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
..\.venv\Scripts\activate
```

Instalar dependencias:

```powershell
pip install -r requirements.txt
```

Levantar servidor:

```powershell
uvicorn app.main:app --reload
```

Swagger estará disponible en:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

## Ejecución local del frontend

Desde la raíz del proyecto, abrir otra terminal:

```powershell
cd frontend
```

Instalar dependencias:

```powershell
npm install
```

Levantar frontend:

```powershell
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

## Base de datos local

El MVP utiliza SQLite como base de datos local mediante el archivo `library_chatbot.db`, configurado en `backend/app/core/database.py`.

Esta base permite guardar información básica del sistema durante la ejecución local, como usuarios registrados y libros agregados a la lista de lectura.

Actualmente, `library_chatbot.db` está excluido del repositorio mediante `.gitignore`, ya que es un archivo local generado durante la ejecución del proyecto.

En un futuro despliegue en servidor o contenedor, se deberá configurar una estrategia de persistencia para evitar pérdida de datos. Por ejemplo, si se usa Docker, sería necesario montar un volumen persistente para conservar el archivo de base de datos, o migrar a una base de datos administrada como Cloud SQL, Firestore u otra opción institucional.

## Datos simulados

Durante el cierre del MVP, el sistema funciona con un catálogo local simulado ubicado en:

```text
backend/app/data/mock_books.py
```

Este catálogo contiene libros con campos equivalentes a los esperados desde un sistema bibliotecario real:

- título
- autor
- idioma
- páginas
- disponibilidad
- estado
- sublocation del LRC
- call number
- ISBN
- resumen
- resumen en español
- resumen en inglés
- categoría
- enlace simulado a Destiny

El uso de datos simulados permite demostrar el funcionamiento del sistema sin depender del acceso completo al catálogo real de Follett Destiny.

## Endpoints principales

### Sistema

```text
GET /
GET /health
```

### Recomendaciones

```text
GET /api/v1/recommendations/
GET /api/v1/recommendations/popular-by-grade
```

### Usuarios

```text
POST /api/v1/users/google-login
```

### Lista de lectura

```text
GET /api/v1/reading-list/
POST /api/v1/reading-list/
DELETE /api/v1/reading-list/{book_id}
```

La lista de lectura utiliza el token propio de sesión para identificar al usuario. El backend obtiene el correo desde el token y no desde un correo enviado directamente por el frontend.

### Follett Destiny

```text
GET /api/v1/follett/test-token
GET /api/v1/follett/status
GET /api/v1/follett/sites
GET /api/v1/follett/sites/secondary-lrc
GET /api/v1/follett/self-service/titles
GET /api/v1/follett/cdl/tenants
GET /api/v1/follett/cdl/search
GET /api/v1/follett/patrons/{patron_id}
GET /api/v1/follett/sites/{site_id}/patrons/{patron_id}
GET /api/v1/follett/locations
GET /api/v1/follett/resources/types/{resource_type_id}/resources
GET /api/v1/follett/circulation/patrons/{patron_id}/status
```

Estas rutas están marcadas como `Follett - Experimental` porque fueron utilizadas para pruebas técnicas de conectividad e integración. No forman parte del flujo final del MVP.

## Integración con Follett Destiny

Durante el desarrollo se realizaron pruebas exploratorias con la API de Follett Destiny.

Se logró validar autenticación básica mediante token y consultar endpoints técnicos como status y sites. Sin embargo, la consulta real de catálogo/títulos quedó pendiente porque requiere permisos, autenticación adicional, principal válido, token AASP o soporte adicional del proveedor/institución.

Por esta razón, el MVP final se presenta con datos simulados locales. La integración real con Follett queda documentada como fase futura del proyecto.

## Flujos seguros de demostración

Para el video final y la defensa, se recomienda demostrar únicamente flujos previamente validados con el catálogo simulado.

Flujos sugeridos:

1. Login institucional con Google.
2. Menú principal de estudiante.
3. Búsqueda por título.
4. Vista de detalle de libro.
5. Agregar libro a lista de lectura.
6. Ver lista de lectura desde perfil.
7. Eliminar libro de lista de lectura.
8. Recomendaciones por grado.
9. Lectura independiente con categoría validada.
10. Flujo “Sorpréndeme”.
11. Vista de staff o personal del LRC.
12. Exploración de colecciones del LRC.

## Limitaciones actuales

- El catálogo real de Follett Destiny no está integrado al flujo principal del MVP.
- Las rutas de Follett se conservan como evidencia técnica experimental.
- La base de datos SQLite es local y no conserva datos entre computadoras distintas.
- La lista de lectura depende de la base local `library_chatbot.db`.
- El sistema está preparado para ejecución local, no para despliegue final en producción.
- Docker no se incluye en esta fase porque el proyecto puede requerir modificaciones importantes cuando se habilite la conexión real con Follett.

## Trabajo futuro

- Completar integración real con Follett Destiny cuando se obtengan los permisos necesarios.
- Sustituir o complementar el catálogo simulado por datos reales.
- Migrar persistencia local a una base de datos institucional o administrada.
- Preparar despliegue en servidor o nube institucional.
- Agregar pruebas automatizadas.
- Mejorar control de roles y permisos.
- Ampliar documentación técnica para producción.

## Estado del proyecto

Este repositorio contiene el MVP desarrollado durante el Servicio Social. El sistema está preparado para demostración local con datos simulados y evidencia técnica de exploración con Follett Destiny.