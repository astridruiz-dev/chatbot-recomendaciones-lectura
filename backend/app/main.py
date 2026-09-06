import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base
from app.core.database import engine

import app.models

# Importar routers
from app.routes.books import router as books_router
from app.routes.recommendations import router as recommendations_router
from app.routes.chat import router as chat_router
from app.routes.follett import router as follett_router
from app.routes.users import router as users_router
from app.routes.reading_list import router as reading_list_router

load_dotenv()

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_URLS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

Base.metadata.create_all(bind=engine)

# Crear aplicación
app = FastAPI(
    title="Library Chatbot API",
    description="API para recomendación de libros escolares",
    version="1.0.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta principal
@app.get(
    "/",
    tags=["System"]
)
def root():

    return {
        "message": "Library Chatbot API activa"
    }

# Endpoint health
@app.get(
    "/health",
    tags=["System"]
)
def health_check():

    return {
        "status": "ok"
    }

# Conectar routers
app.include_router(books_router)
app.include_router(recommendations_router, prefix="/api/v1")
app.include_router(chat_router)
app.include_router(follett_router, prefix="/api/v1")
app.include_router(users_router)
app.include_router(reading_list_router, prefix="/api/v1")